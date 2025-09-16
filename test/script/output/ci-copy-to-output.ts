/// <reference path="../../../global.node.v22.d.ts" preserve="true"/>

import { __ROOT, __ROOT_OUTPUT, __ROOT_OUTPUT_SNAPSHOTS_FILE, __ROOT_TEST_SNAPSHOTS_FILE } from '../../__root';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy } from 'fs-extra';
import { join } from 'path';
import { consoleLogger } from 'debug-color2/logger';
import { globSync2 } from '../lib/util';

export default (async () => {

	await copy(join(__ROOT_TEST_SNAPSHOTS_FILE, 'entryAll'), join(__ROOT_OUTPUT_SNAPSHOTS_FILE, 'entryAll'), {
		preserveTimestamps: true,
		dereference: true,
	});

	await Bluebird.each(globSync2([
		'.github/workflows/build.yml',
		'.github/workflows/valid-yaml.yml',
		'docs/**/*',
	], {
		cwd: __ROOT,
	}), (file: string) => {
		consoleLogger.debug(`copy`, file);
		return copy(join(__ROOT, file), join(__ROOT_OUTPUT, file), {
			preserveTimestamps: true,
			dereference: true,
		})
	})

})();

