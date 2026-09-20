import { spawn, type ChildProcess } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateContent } from '../content/generate.ts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const generatedRoot = join(projectRoot, '.generated');
const productionContentRoot = join(projectRoot, 'content');
const productionBuildRoot = join(projectRoot, 'dist', 'engineering-reference');
const realCatalogBuildRoot = join(projectRoot, 'dist', 'engineering-reference-real');
const handledSignals = ['SIGINT', 'SIGTERM'] as const;

type HandledSignal = (typeof handledSignals)[number];

let activePlaywright: ChildProcess | undefined;
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
  activePlaywright?.kill(signal);
}

for (const signal of handledSignals) {
  const handler = (): void => handleSignal(signal);
  signalHandlers.set(signal, handler);
  process.on(signal, handler);
}

function runPlaywright(arguments_: readonly string[]): Promise<number> {
  return new Promise((resolveRun, rejectRun) => {
    const playwright = spawn(
      join(projectRoot, 'node_modules', '.bin', 'playwright'),
      ['test', ...arguments_],
      {
        cwd: projectRoot,
        stdio: 'inherit',
      },
    );
    activePlaywright = playwright;

    if (receivedSignal !== undefined) {
      playwright.kill(receivedSignal);
    }

    playwright.once('error', rejectRun);
    playwright.once('exit', (code, signal) => {
      if (activePlaywright === playwright) {
        activePlaywright = undefined;
      }

      if (signal !== null) {
        if (signal === receivedSignal) {
          resolveRun(signalExitCode(receivedSignal));
          return;
        }

        rejectRun(new Error(`Playwright exited after signal ${signal}`));
        return;
      }

      resolveRun(code ?? 1);
    });
  });
}

let exitCode: number;

try {
  await rm(realCatalogBuildRoot, { recursive: true, force: true });
  await cp(productionBuildRoot, realCatalogBuildRoot, { recursive: true });
  exitCode = await runPlaywright(process.argv.slice(2));
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
