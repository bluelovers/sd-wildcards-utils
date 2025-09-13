//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { isWildcardsName, matchDynamicPromptsWildcards, matchDynamicPromptsWildcardsAll } from '../src/util';
import parseWildcardsYaml, { getOptionsFromDocument } from '../src/index';
import { trimPromptsDynamic } from '../src/format';
import { _checkValue } from '../src/valid-prompts';

beforeAll(async () =>
{

});

test(`doc.options`, () => {
	let doc = parseWildcardsYaml(null as any, {
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

	test.each([
		'__lazy-wildcards/subject/env-elem-creatures/butterfly/ env-elem-creatures-main__',
	])(`%j`, (input) =>
	{

		let actual = matchDynamicPromptsWildcards(input, {
			unsafe: true,
		});

		expect(actual).toHaveProperty('name');
		expect(actual).toMatchSnapshot();

		actual = matchDynamicPromptsWildcards(input, {
			unsafe: false,
		});

		expect(actual).toBeFalsy();

	});

	test.each([
		'__lazy-wildcards/subject/env-elem-creatures/butterfly/ env-elem-creatures-main__ __person/regular/haircolor-unconv(k=)__ __lazy-wildcards/subject/env-elem-creatures/butterfly/ env-elem-creatures-*__',
	])(`%j`, (input) =>
	{

		let actual = matchDynamicPromptsWildcardsAll(input, {
			unsafe: true,
		});

		expect(actual).toHaveLength(3);
		expect(actual).toMatchSnapshot();

	});

})

describe(`utils`, () => {

	test.each([
		`\$\{c=!__lazy-wildcards/utils/color-base__\} \n__lazy-wildcards/subject/env-elem/sky_lantern/fn/sky_lantern__`,
		`\$\{v1=!\{\{very |\}small |\}\} \n __lazy-wildcards/subject/costume-ethnicity-breasts/tits-rocket/fn/rocket_tits__`,
		`\$\{person_description = { blond| redhead | brunette}, {green|blue|brown|hazel\} eyes, {tall|average|short}}
A \$\{person_description\} man and a \$\{person_description\} woman`,
	])(`%j`, (input) => {

		let actual = trimPromptsDynamic(input);

		expect(actual).toMatchSnapshot();
	})

});
