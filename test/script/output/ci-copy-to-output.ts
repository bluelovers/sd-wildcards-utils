/// <reference path="../../../global.node.v22.d.ts" preserve="true"/>

import { __ROOT, __ROOT_OUTPUT } from '../../__root';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy } from 'fs-extra';
import { join } from 'path';
// @ts-ignore
import { globSync } from 'fs';
import { consoleLogger } from 'debug-color2/logger';

export default (async () => {

	await copy(join(__ROOT, './test/__file_snapshots__/findWildcardsYAMLPathsAll'), join(__ROOT_OUTPUT, '__file_snapshots__/findWildcardsYAMLPathsAll'), {
		preserveTimestamps: true,
		dereference: true,
	});

	await Bluebird.each(globSync([
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

