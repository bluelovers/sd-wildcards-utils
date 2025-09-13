//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { join, normalize } from 'upath2';
import { globSync } from 'node:fs';
import { __ROOT_TEST_FIXTURES, __ROOT_TEST_SNAPSHOTS_FILE } from './__root';
import { readFileSync } from 'fs-extra';
import {
	parseWildcardsYaml,
	_checkValue,
	IWildcardsYAMLDocumentParsed,
	normalizeDocument,
	stringifyWildcardsYamlData,
} from '../src/index';
import { globSync2 } from './script/lib/util';

beforeAll(async () =>
{

});

describe(`_checkValue`, () => {

	describe(`valid`, () => {

		test.each([
			'2b_\(nier:automata\)_\(cosplay\)',
			'purple_gray',

			`, penis under another's clothes`,

			`{ penis under another's clothes|}`,

			`{, penis under another's clothes}`,

			`{, penis under another's clothes|}`,
			`(naizuri{, penis under another's clothes|}:1.3)`,
		])(`%j`, (input) => {

			let actual = _checkValue(input);

			expect(actual).toBeUndefined();
		})

	})

	describe(`invalid`, () => {

		test.each([
			' __lazy-wildcards/subject/env-elem/stairs/prompts_ ',
			' __lazy-wildcards/subject/__env-elem/stairs/prompts__ ',
			' {__lazy-wildcards/subject/env-elem/stairs/prompts_} ',
			' _lazy-wildcards/subject/env-elem/stairs/prompts__ ',
			' __lazy-wildcards/subject/env-elem__/stairs/prompts__ ',
			' {_lazy-wildcards/subject/env-elem/stairs/prompts__} ',
			`(cum
{, __1/subject/costume-elem/cum/costume-elem2__|}
{, __2/subject/costume-elem/cum/costume-elem__|
{, __3/subject/costume-elem/cum-base/prompts__{0.3:::{1.2|1.3|1.4}|}|})
`,

			`__costume-ethnicity-breasts/tits-rocket/fn/rocket_tits(v=!xxx)__`,
			`__costume-ethnicity-breasts/tits-rocket/fn/rocket_tits(v={x})__`,
			`__costume-ethnicity-breasts/tits-rocket/fn/rocket_tits(v=\${x})__`,

		])(`%j`, (input) => {

			let actual = _checkValue(input);

			expect(actual).not.toBeUndefined();
			expect(actual).toMatchSnapshot();
		})

	})

});

describe(`prompts:error`, () =>
{
	test.each(globSync2([
		`prompts-bad/**.yaml`,
	], {
		cwd: __ROOT_TEST_FIXTURES,
	}))('%j', (file) =>
	{

		const outPath = join(
			__ROOT_TEST_SNAPSHOTS_FILE,
			'stringifyWildcardsYamlData',
		);

		let source = readFileSync(join(__ROOT_TEST_FIXTURES, file));

		let yaml: IWildcardsYAMLDocumentParsed;

		expect(() =>
		{
			yaml = parseWildcardsYaml(source, {
				allowMultiRoot: true,
			});

			stringifyWildcardsYamlData(yaml);
		}).toThrowErrorMatchingSnapshot()
	});

})
