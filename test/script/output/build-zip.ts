import JSZip from 'jszip';
import Bluebird from 'bluebird';
import { fixedJSZipDate } from 'jszip-fixed-date';
import { join, basename } from 'path';
import { __ROOT_DATA, __ROOT_OUTPUT, __ROOT_OUTPUT_WILDCARDS } from '../../__root';
import { readFile, outputFile } from 'fs-extra';
import crypto from 'crypto';
import { consoleLogger } from 'debug-color2/logger';

export default Bluebird.resolve()
	.then(async () => {
		let zip = new JSZip();

		zip_add_file(zip, join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml'));
		zip_add_file(zip, join(__ROOT_OUTPUT, 'README.md'));

		// zip_add_file(zip, join(__ROOT_DATA, 'others/fake-dummy-wildcards.yaml'));

		zip_add_file(zip, join(__ROOT_DATA, 'others/billions_of_all_in_one.yaml'));

		zip_add_file(zip, join(__ROOT_DATA, 'cf/bundle/corn-flakes-aio-bundle-sex.yaml'));

		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-daoist-priest.yaml'));
		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-jiangshi.yaml'));
		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-martial-artist.yaml'));
		zip_add_file(zip, join(__ROOT_DATA, 'others/corn-flakes-onmyoji.yaml'));

		/*
		globSync([
			'CharaCreatorWildcards/*.yaml',
			'Vision/fake-dummy-wildcards.yaml',
			'navi_atlas.yaml',
		], {
			cwd: join(__ROOT_DATA, 'others'),
		}).forEach(v => {
			zip_add_file(zip, join(__ROOT_DATA, 'others', v), v);
		});
		*/

		fixedJSZipDate(zip, new Date('2000-12-24 23:00:00Z'));

		const zipFile = join(__ROOT_OUTPUT_WILDCARDS, 'lazy-wildcards.yaml.zip');

		const resultOld = md5Buffer(await readFile(zipFile).catch(e => null));

		await zip.generateAsync({
			type: 'nodebuffer',
			mimeType: 'application/zip',
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9
			},
		}).then(buf => {
			const result = md5Buffer(buf);

			consoleLogger.green.info(resultOld);
			if (resultOld !== result) consoleLogger.yellow.info(result);

			return outputFile(zipFile, buf)
		})
	})
;

function zip_add_file(zip: JSZip, src_path: string, zip_filename?: string)
{
	return zip.file(zip_filename ?? basename(src_path), readFile(src_path));
}

function md5Buffer(buf: Uint8Array | null)
{
	try
	{
		if (buf)
		{
			return crypto.createHash('md5').update(buf).digest('hex');
		}
	}
	catch (e)
	{

	}

	return null
}
