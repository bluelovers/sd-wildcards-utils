import { join } from "path";

export const __ROOT = join(__dirname, '..');

export const __ROOT_DATA = join(__ROOT, 'data');

export const __ROOT_OUTPUT = join(__ROOT, 'output');

export const __ROOT_TEST = join(__ROOT, 'test');

export const __ROOT_OUTPUT_WILDCARDS = join(__ROOT_OUTPUT, 'wildcards');

export const isWin = process.platform === "win32";
