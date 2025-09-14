import { join } from "path";

export const __ROOT = join(__dirname, '..');

export const __ROOT_DATA = join(__ROOT, 'data');

export const __ROOT_OUTPUT = join(__ROOT, 'output');

export const __ROOT_TEST = join(__ROOT, 'test');

export const __ROOT_TEST_OUTPUT = join(__ROOT_TEST, 'output');

export const __ROOT_OUTPUT_WILDCARDS = join(__ROOT_OUTPUT, 'wildcards');

export const __ROOT_TEST_FIXTURES = join(__ROOT_TEST, 'fixtures');

export const __ROOT_TEST_SNAPSHOTS_FILE = join(__ROOT_TEST, '__file_snapshots__');
export const __ROOT_OUTPUT_SNAPSHOTS_FILE = join(__ROOT_OUTPUT, '__file_snapshots__');

export const isWin = process.platform === "win32";
