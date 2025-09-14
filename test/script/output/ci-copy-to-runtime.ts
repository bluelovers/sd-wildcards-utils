import { __ROOT, __ROOT_DATA, __ROOT_TEST_OUTPUT } from '../../__root';
import { globAbsolute } from '../lib/util';
import { globSync } from 'fs';
// @ts-ignore
import Bluebird from 'bluebird';
// @ts-ignore
import { copy, exists, readJSON, writeJSON, readFile } from 'fs-extra';
import { join, extname } from 'upath2';
import { consoleLogger } from 'debug-color2/logger';
import { createHash } from 'crypto';

export default (async () => {

	const __SRC_DIR = join(__ROOT_DATA, 'others');
	const __OUT_DIR = join('S:/.data/wildcards_dy');

	const bool = await exists(__OUT_DIR);

	consoleLogger[bool ? 'yellow' : 'red'].debug(`detect`, bool, __OUT_DIR);

	if (bool)
	{
		const hash_file = join(__ROOT_TEST_OUTPUT, 'hash-sync.json');

		const hashJson: Record<string, string> = await readJSON(hash_file).catch(e => ({}));

		await Bluebird.each(globSync([
			'Vision/**/*.{yaml,txt}',
			'user-*/**/*.{yaml,txt}',
			'!**/_disable/*',
			'!**/_*.{yaml,txt}',
		], {
			cwd: __SRC_DIR,
		}), async (file: string) => {

			const src_file = join(__SRC_DIR, file);
			const out_file = join(__OUT_DIR, file);

			const buf = await readFile(src_file);

			// compute a fixed-length hash (sha256) for the file content
			const hash = createHash('sha256').update(buf).digest('hex');

			if (hashJson[file] !== hash || !await exists(out_file))
			{
				let skip = hashJson[file] === hash || (extname(file) === '.txt' && await exists(src_file + '.yaml')) || await exists(src_file + '.disable');

				if (skip)
				{
					consoleLogger.gray.debug(`skip`, file);
				}
				else
				{
					consoleLogger.yellow.debug(`copy`, file);
					await copy(src_file, out_file, {
						preserveTimestamps: true,
						// dereference: true,
					});
				}

				hashJson[file] = hash;
			}

		});

		await writeJSON(hash_file, hashJson, { spaces: 2 });
	}

})().catch(e => {
	consoleLogger.error(String(e), e)
	consoleLogger.dir(e)
});

