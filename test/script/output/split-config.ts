import { IOptionsFind } from '../../../src/index';

export const groupSplitFiles = [
//	'cf/costumes/*.yaml',
//	'cf/creatures/*.yaml',
//	'cf/other/*.yaml',

	'cf/bundle/corn-flakes-aio-bundle-sex.yaml',
	'others/corn-flakes-*.yaml',

	'others/billions_of_all_in_one.yaml',
	'others/CharaCreatorWildcards/*.yaml',

//	'others/**/*.yaml',
	'*.yaml',

	'sub/**/*.yaml',
];

export const groupSplitConfig = [
	['color-anything', '__lazy-wildcards/utils/color-base__'],
	['color-anything', '__mix-lazy-auto/color-anything__'],

	['color-anything', '__cf-*/color__'],

	['color-anything', '__Bo/chars/haircolor__'],
	['color-anything', '__person/regular/haircolor__'],
	['color-anything', '__person/regular/haircolor-unconv__'],

	['color-anything', '__cf-model/eye-color/*__'],
	['color-anything', '__cf-model/hair-color/*__'],

	['color-anything', '__crea-*/fin-color__'],

	[
		'interior-style-anything', '__lazy-wildcards/utils/interior-style-*__', {
		ignore: [
			'lazy-wildcards/utils/interior-style-anything',
		],
	},
	],
] as const satisfies [key: string, wildcards: string, findOpts?: IOptionsFind][]
