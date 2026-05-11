import { setupWorker } from 'msw/browser';

import type { SetupWorker } from 'msw/browser';

type WorkerStartOptions = Parameters<SetupWorker['start']>[0];

// Module-level state (Singleton behavior by javascript module nature)
let worker: SetupWorker | null = null;
let startPromise: Promise<void> | null = null;
let isHandlerStarted = false;

const getWorker = (): SetupWorker => {
  if (!worker) {
    worker = setupWorker();
  }
  return worker;
};

const start = async (options: WorkerStartOptions): Promise<void> => {
  // Return existing Promise if already starting or started
  if (startPromise) {
    return startPromise;
  }

  const currentWorker = getWorker();
  console.log('[MockingGUI] Starting MSW Worker...');

  startPromise = currentWorker.start(options).then(() => {
    isHandlerStarted = true;
    console.log('[MockingGUI] MSW Worker started successfully');
  });

  return startPromise;
};

const stop = (): void => {
  if (isHandlerStarted && worker) {
    worker.stop();
    isHandlerStarted = false;
    startPromise = null;
  }
};

const MockingGUIWorkerManager = {
  get isStarted() {
    return isHandlerStarted;
  },
  getWorker,
  start,
  stop,
};

export default MockingGUIWorkerManager;
