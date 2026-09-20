import { spawn, type ChildProcess } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateContent } from '../content/generate.ts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const generatedRoot = join(projectRoot, '.generated');
const productionContentRoot = join(projectRoot, 'content');
const fixtureContentRoot = join(projectRoot, 'e2e', 'fixtures', 'content');
const productionBuildRoot = join(projectRoot, 'dist', 'engineering-reference');
const realCatalogBuildRoot = join(projectRoot, 'dist', 'engineering-reference-real');
const fixtureBuildRoot = join(projectRoot, 'dist', 'engineering-reference-fixture');
const handledSignals = ['SIGINT', 'SIGTERM'] as const;
const realTopicCountEnvironmentVariable = 'ENGINEERING_REFERENCE_REAL_TOPIC_COUNT';

type HandledSignal = (typeof handledSignals)[number];

let activeChild: ChildProcess | undefined;
let receivedSignal: HandledSignal | undefined;
const signalHandlers = new Map<HandledSignal, () => void>();

function signalExitCode(signal: HandledSignal): number {
  return signal === 'SIGINT' ? 130 : 143;
}

function handleSignal(signal: HandledSignal): void {
  if (receivedSignal === undefined) {
    receivedSignal = signal;
  }

  activeChild?.kill('SIGINT');
}

for (const signal of handledSignals) {
  const handler = (): void => handleSignal(signal);
  signalHandlers.set(signal, handler);
  process.on(signal, handler);
}

function runChild(
  command: string,
  arguments_: readonly string[],
  environment: Readonly<NodeJS.ProcessEnv> = {},
): Promise<number> {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, arguments_, {
      cwd: projectRoot,
      env: { ...process.env, ...environment },
      stdio: 'inherit',
    });
    activeChild = child;

    if (receivedSignal !== undefined) {
      child.kill(receivedSignal);
    }

    child.once('error', rejectRun);
    child.once('exit', (code, signal) => {
      if (activeChild === child) {
        activeChild = undefined;
      }

      if (signal !== null) {
        if (receivedSignal !== undefined && handledSignals.includes(signal as HandledSignal)) {
          resolveRun(signalExitCode(receivedSignal));
          return;
        }

        rejectRun(new Error(`${command} exited after signal ${signal}`));
        return;
      }

      resolveRun(code ?? 1);
    });
  });
}

function buildFixtureApplication(): Promise<number> {
  return runChild(join(projectRoot, 'node_modules', '.bin', 'ng'), [
    'build',
    '--configuration',
    'production',
    '--output-path',
    fixtureBuildRoot,
  ]);
}

function runPlaywright(arguments_: readonly string[], realTopicCount: number): Promise<number> {
  return runChild(
    join(projectRoot, 'node_modules', '.bin', 'playwright'),
    ['test', ...arguments_],
    { [realTopicCountEnvironmentVariable]: String(realTopicCount) },
  );
}

let exitCode: number | undefined;
let runFailed = false;
let runError: unknown;

try {
  const productionCatalog = await generateContent(productionContentRoot, generatedRoot);
  await rm(realCatalogBuildRoot, { recursive: true, force: true });
  await rm(fixtureBuildRoot, { recursive: true, force: true });
  await cp(productionBuildRoot, realCatalogBuildRoot, { recursive: true });
  await generateContent(fixtureContentRoot, generatedRoot);
  exitCode = await buildFixtureApplication();

  if (exitCode === 0) {
    await generateContent(productionContentRoot, generatedRoot);
    exitCode = await runPlaywright(process.argv.slice(2), productionCatalog.allTopicIds.length);
  }
} catch (error) {
  runFailed = true;
  runError = error;
}

try {
  await generateContent(productionContentRoot, generatedRoot);
} catch (restorationError) {
  if (runFailed) {
    throw new AggregateError(
      [runError, restorationError],
      'The end-to-end run failed and restoring production content also failed.',
      { cause: restorationError },
    );
  }

  throw restorationError;
} finally {
  for (const signal of handledSignals) {
    process.off(signal, signalHandlers.get(signal)!);
  }
}

if (runFailed) {
  throw runError;
}

if (exitCode === undefined) {
  throw new Error('The end-to-end runner completed without an exit code.');
}

process.exitCode = receivedSignal === undefined ? exitCode : signalExitCode(receivedSignal);
