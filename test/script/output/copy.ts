import { __ROOT, __ROOT_OUTPUT } from '../../__root';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy } from 'fs-extra';
import { join } from 'path';
// @ts-ignore
import { globSync } from 'fs';

export default Bluebird.each(globSync([
	'.github/workflows/build.yml',
	'.github/workflows/valid-yaml.yml',
	'docs/**/*',
], {
	cwd: __ROOT,
}), (file: string) => {
	console.log(`copy`, file);
	return copy(join(__ROOT, file), join(__ROOT_OUTPUT, file), {
		preserveTimestamps: true,
		dereference: true,
	})
});
