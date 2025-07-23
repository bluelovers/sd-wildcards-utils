import { __ROOT, __ROOT_DATA } from '../../__root';
import { globAbsolute } from '../lib/util';
import { globSync } from 'fs';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy, exists } from 'fs-extra';
import { join } from 'path';
import { consoleLogger } from 'debug-color2/logger';

export default (async () => {

	const __SRC_DIR = join(__ROOT_DATA, 'others');
	const __OUT_DIR = join('S:/.data/wildcards_dy');

	await exists(__OUT_DIR)
		.then(() => {
			return Bluebird.each(globSync([
				'Vision/**/*.yaml',
				'user-*/**/*.yaml',
			], {
				cwd: __SRC_DIR,
			}), async (file: string) => {

				if (!await exists(join(__OUT_DIR, file))) {
					consoleLogger.yellow.debug(`copy`, file);
					return copy(join(__SRC_DIR, file), join(__OUT_DIR, file), {
						preserveTimestamps: true,
						dereference: true,
					})
				}

			});
		})
		.catch(e => {
			consoleLogger.error(String(e), e)
			consoleLogger.dir(e)
		})
	;

})();

