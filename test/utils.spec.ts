//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { isWildcardsName, matchDynamicPromptsWildcards } from '../src/util';
import parseWildcardsYaml, { getOptionsFromDocument } from '../src/index';
import { _checkValue } from '../src/valid';

beforeAll(async () =>
{

});

test(`doc.options`, () => {
	let doc = parseWildcardsYaml(null, {
		allowEmptyDocument: true,
	});

	expect(getOptionsFromDocument(doc)).toMatchSnapshot()
});

describe(`matchDynamicPromptsWildcards`, () =>
{

	test.skip(`dummy`, () => {});

	test.each([
		'__season_clothes(season=winter)__',
		'__season_clothes__',
		'__season_clothes(season=__season_clothes__)__',

		'__season_clothes(season=!__season_clothes__)__',

		'__~season_clothes(season=winter)__',

		'__season_clothes(season=__@season_clothes__)__',
		'__season_clothes(season=__~season_clothes__)__',

		'__@season_clothes(season=__season_clothes__)__',
		'__~season_clothes(season=__season_clothes__)__',

		'__season_clothes(season={summer|autumn|winter|spring})__',
		'__season_clothes(season=!{summer|autumn|winter|spring})__',

		'__season_clothes(season={@summer|autumn|winter|spring})__',
		'__season_clothes(season={!summer|autumn|winter|spring})__',

		'__season_clothes(season=!{@summer|autumn|winter|spring})__',
		'__season_clothes(season=!{!summer|autumn|winter|spring})__',

		'__season_clothes(season=)__',

		'__season_clothes(season=)__ ',

		' __season_clothes(season=)__ ',

		' __season_clothes(season= )__ ',

		// ---------------

		'__scope/season_clothes(season=winter)__',
		'__scope/season_clothes__',
		'__scope/season_clothes(season=__scope/season_clothes__)__',

		'__scope/season_clothes(season=!__scope/season_clothes__)__',

		'__~scope/season_clothes(season=winter)__',

		'__scope/season_clothes(season=__@scope/season_clothes__)__',
		'__scope/season_clothes(season=__~scope/season_clothes__)__',

		'__@scope/season_clothes(season=__scope/season_clothes__)__',
		'__~scope/season_clothes(season=__scope/season_clothes__)__',

		'__scope/season_clothes(season={summer|autumn|winter|spring})__',
		'__scope/season_clothes(season=!{summer|autumn|winter|spring})__',

		'__scope/season_clothes(season={@summer|autumn|winter|spring})__',
		'__scope/season_clothes(season={!summer|autumn|winter|spring})__',

		'__scope/season_clothes(season=!{@summer|autumn|winter|spring})__',
		'__scope/season_clothes(season=!{!summer|autumn|winter|spring})__',

		'__scope/season_clothes(season=)__',

		'__scope/season_clothes(season=)__ ',

		' __scope/season_clothes(season=)__ ',

		' __scope/season_clothes(season= )__ ',

	])(`%j`, (input) =>
	{

		let actual = matchDynamicPromptsWildcards(input);

		expect(actual).toMatchSnapshot();

		expect(isWildcardsName(actual.name)).toBeTruthy();

	});

})

describe(`_checkValue`, () => {

	describe(`valid`, () => {

		test.each([
			'2b_\(nier:automata\)_\(cosplay\)',
			'purple_gray',
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
		])(`%j`, (input) => {

			let actual = _checkValue(input);

			expect(actual).not.toBeUndefined();
			expect(actual).toMatchSnapshot();
		})

	})

})
