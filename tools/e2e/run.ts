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

type HandledSignal = (typeof handledSignals)[number];

let activeChild: ChildProcess | undefined;
let receivedSignal: HandledSignal | undefined;
const signalHandlers = new Map<HandledSignal, () => void>();

function signalExitCode(signal: HandledSignal): number {
  return signal === 'SIGINT' ? 130 : 143;
}

function handleSignal(signal: HandledSignal): void {
  if (receivedSignal !== undefined) {
    return;
  }

  receivedSignal = signal;
  activeChild?.kill(signal);
}

for (const signal of handledSignals) {
  const handler = (): void => handleSignal(signal);
  signalHandlers.set(signal, handler);
  process.on(signal, handler);
}

function runChild(command: string, arguments_: readonly string[]): Promise<number> {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, arguments_, {
      cwd: projectRoot,
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
        if (signal === receivedSignal) {
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

function runPlaywright(arguments_: readonly string[]): Promise<number> {
  return runChild(join(projectRoot, 'node_modules', '.bin', 'playwright'), ['test', ...arguments_]);
}

let exitCode: number;

try {
  await rm(realCatalogBuildRoot, { recursive: true, force: true });
  await rm(fixtureBuildRoot, { recursive: true, force: true });
  await cp(productionBuildRoot, realCatalogBuildRoot, { recursive: true });
  await generateContent(fixtureContentRoot, generatedRoot);
  exitCode = await buildFixtureApplication();

  if (exitCode === 0) {
    await generateContent(productionContentRoot, generatedRoot);
    exitCode = await runPlaywright(process.argv.slice(2));
  }
} finally {
  try {
    await generateContent(productionContentRoot, generatedRoot);
  } finally {
    for (const signal of handledSignals) {
      process.off(signal, signalHandlers.get(signal)!);
    }
  }
}

process.exitCode = receivedSignal === undefined ? exitCode : signalExitCode(receivedSignal);
