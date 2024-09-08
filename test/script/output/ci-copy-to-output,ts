/// <reference path="../../../global.node.v22.d.ts" preserve="true"/>

import { __ROOT, __ROOT_OUTPUT } from '../../__root';
// @ts-ignore
import { copy } from 'fs-extra';
import { join } from 'path';

export default (async () => {

	await copy(join(__ROOT, './test/__file_snapshots__/findWildcardsYAMLPathsAll'), join(__ROOT_OUTPUT, '__file_snapshots__/findWildcardsYAMLPathsAll'), {
		preserveTimestamps: true,
		dereference: true,
	});

})();

