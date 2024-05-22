//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { isWildcardsName, matchDynamicPromptsWildcards } from '../src/util';

beforeAll(async () =>
{

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

	])(`%s`, (input) =>
	{

		let actual = matchDynamicPromptsWildcards(input);

		expect(actual).toMatchSnapshot();

		expect(isWildcardsName(actual.name)).toBeTruthy();

	});

})
