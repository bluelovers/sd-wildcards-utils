import { __ROOT, __ROOT_DATA } from '../../__root';
import { globAbsolute } from '../lib/util';
import { globSync } from 'fs';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy, exists } from 'fs-extra';
import { join, extname } from 'upath2';
import { consoleLogger } from 'debug-color2/logger';

export default (async () => {

	const __SRC_DIR = join(__ROOT_DATA, 'others');
	const __OUT_DIR = join('S:/.data/wildcards_dy');

	const bool = await exists(__OUT_DIR);

	consoleLogger[bool ? 'yellow' : 'red'].debug(`detect`, bool, __OUT_DIR);

	if (bool)
	{
		await Bluebird.each(globSync([
			'Vision/**/*.{yaml,txt}',
			'user-*/**/*.{yaml,txt}',
			'!**/_disable/*',
			'!**/_*.{yaml,txt}',
		], {
			cwd: __SRC_DIR,
		}), async (file: string) => {

			const src_file = join(__OUT_DIR, file);

			if (!await exists(src_file))
			{
				let skip = (extname(file) === '.txt' && await exists(src_file + '.yaml')) || await exists(src_file + '.disable');

				if (skip)
				{
					consoleLogger.gray.debug(`skip`, file);
				}
				else
				{
					consoleLogger.yellow.debug(`copy`, file);
					return copy(src_file, join(__OUT_DIR, file), {
						preserveTimestamps: true,
						dereference: true,
					})
				}
			}

		})
	}

})().catch(e => {
	consoleLogger.error(String(e), e)
	consoleLogger.dir(e)
});

