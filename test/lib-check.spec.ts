import { checkAllSelfLinkWildcardsExists } from "../src/check";
import { isSafeKey, parseWildcardsYaml, stringifyWildcardsYamlData } from '../src/index';
import { expectToHavePropertyWithEmptyArray } from './script/lib/util-jest';

beforeAll(async () =>
{

});

describe(`valid`, () =>
{

	describe(`isSafeKey:true`, () =>
	{
		test.each([
			`dr._slump`,
		])(`%j`, (input) =>
		{
			let actual = isSafeKey(input);

			expect(actual).toBeTruthy();
		});
	})

	describe(`isSafeKey:false`, () =>
	{

		test.each([
			`_xxx`,
			`xxx_`,

			`-xxx`,
			`xxx-`,

			`+xxx`,
			`xxx+`,

			`@xxx`,
			`xxx@`,

			` xxx`,
			`xxx `,

			`!xxx`,
			`xxx!`,

			`~xxx`,
			`xxx~`,

			`:xxx`,
			`xxx:`,

			`/xxx`,
			`xxx/`,

			`\/xxx`,
			`xxx\/`,

			`\\xxx`,
			`xxx\\`,

			`x*x`,
			`xx__x`,

			`x#x`,
			`x x`,

			`.xxx`,
			`xxx.`,

			`'xxx`,
			`xxx'`,

			`"xxx`,
			`xxx"`,

			`x/x\\xx`,

			`x./x`,
			`x/.x`,

			`x-/x`,
			`x/-x`,

			`x_/x`,
			`x/_x`,

			`x..x`,
			//`x._x`,
			`x.-x`,
			`x_-x`,
			`x--x`,

		])(`%j`, (input) =>
		{

			let actual = isSafeKey(input);

			expect(actual).toBeFalsy();

		});

	});

});

describe(`checkAllSelfLinkWildcardsExists`, () =>
{

	/**
	 * @fixme support forward slashes `/` in keys, make `cmfy/eye_color_any` same as `cmfy:eye_color_any`
	 */
	describe(`forward slashes / in keys`, () =>
	{

		test(`cmfy/eye_color_any`, () =>
		{

			const source = `
cmfy/eye_color_classic:
  - 11
cmfy/eye_color_stylized:
  - 2
cmfy/eye_color_fantasy:
  - 3

cmfy/eye_color_any:
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

			_checkAllSelfLinkWildcardsExists(source);

		});

		test(`"cmfy/eye_color_any"`, () =>
		{

			const source = `
"cmfy/eye_color_classic":
  - 1
"cmfy/eye_color_stylized":
  - 2
cmfy/eye_color_fantasy:
  - 3

"cmfy/eye_color_any":
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

			_checkAllSelfLinkWildcardsExists(source);

		});

		test(`cmfy:eye_color_any`, () =>
		{

			const source = `
"cmfy/eye_color_classic":
  - 1
cmfy/eye_color_stylized:
  - 2
cmfy:
  eye_color_fantasy:
    - 3

"cmfy/eye_color_any":
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

			_checkAllSelfLinkWildcardsExists(source);

		});

	})

});

describe(`jest`, () =>
{
	test(`expectToHavePropertyWithEmptyArray`, () =>
	{

		let actual = {
			errors: [],
		};

		expectToHavePropertyWithEmptyArray(actual, 'errors');

		expect(() =>
		{

			actual.errors = [''];

			expectToHavePropertyWithEmptyArray(actual, 'errors');

		}).toThrow();

	})
})

function _checkAllSelfLinkWildcardsExists(source: string)
{
	let yaml = parseWildcardsYaml(source, {
		allowMultiRoot: true,
	});

	let actual = checkAllSelfLinkWildcardsExists(yaml, {
		report: true,
	});

	let output = stringifyWildcardsYamlData(yaml);

	expect(actual).toMatchSnapshot();
	expect(output).toMatchSnapshot();

	/**
	 * @fixme actual.errors should be as empty array
	 * @fixme actual.listHasExists shoulf have length 3
	 */
	if (true)
	{
		expectToHavePropertyWithEmptyArray(actual, 'errors');

		expect(actual).toHaveProperty('listHasExists', expect.arrayContaining([
			"cmfy/eye_color_classic",
			"cmfy/eye_color_stylized",
			"cmfy/eye_color_fantasy",
		]));
	}

	 yaml = parseWildcardsYaml(source, {
		allowMultiRoot: true,
		 expandForwardSlashKeys: false,
	});

	actual = checkAllSelfLinkWildcardsExists(yaml, {
		report: true,
	});

	expect(actual).toHaveProperty('errors', expect.arrayContaining([expect.anything()]));

}

