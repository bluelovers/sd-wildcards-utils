import { checkAllSelfLinkWildcardsExists } from "../src/check";
import { isSafeKey, parseWildcardsYaml } from '../src/index';

beforeAll(async () => {

});

describe(`valid`, () => {

	describe(`isSafeKey:false`, () => {

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
			`x._x`,
			`x.-x`,
			`x_-x`,
			`x--x`,

		])(`%j`, (input) => {

			let actual = isSafeKey(input);

			expect(actual).toBeFalsy();

		});

	});

});

describe(`checkAllSelfLinkWildcardsExists`, () => {

	test(`cmfy/eye_color_any`, () => {

		const souce = `
cmfy/eye_color_classic:
  - 1
cmfy/eye_color_stylized:
  - 2
cmfy/eye_color_fantasy:
  - 3

cmfy/eye_color_any:
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

		let yaml = parseWildcardsYaml(souce, {
			allowMultiRoot: true,
		});

		let actual = checkAllSelfLinkWildcardsExists(yaml);

		expect(actual).toMatchSnapshot();

	});

		test(`"cmfy/eye_color_any"`, () => {

		const souce = `
"cmfy/eye_color_classic":
  - 1
"cmfy/eye_color_stylized":
  - 2
"cmfy/eye_color_fantasy":
  - 3

"cmfy/eye_color_any":
  - __cmfy/eye_color_classic__
  - __cmfy/eye_color_stylized__
  - __cmfy/eye_color_fantasy__
`;

		let yaml = parseWildcardsYaml(souce, {
			allowMultiRoot: true,
		});

		let actual = checkAllSelfLinkWildcardsExists(yaml);

		expect(actual).toMatchSnapshot();

	});

});
