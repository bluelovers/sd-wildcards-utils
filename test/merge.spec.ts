//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import { parseWildcardsYaml, mergeFindSingleRoots, stringifyWildcardsYamlData } from '../src/index';

beforeAll(async () =>
{

});

describe(basename(__filename, extname(__filename)), () =>
{

	test.skip(`dummy`, () => {});

	test(`mergeFindSingleRoots`, () =>
	{
		let souce = `
root:
  root2:
    sub1:
      - 123
    sub2:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		let souce2 = `
root:
  root2:
    sub1:
      - 123
    sub4:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		let doc = parseWildcardsYaml(souce, {
			allowEmptyDocument: true,
			keepSourceTokens: false,
		});

		let doc2 = parseWildcardsYaml(souce2, {
			allowEmptyDocument: true,
			keepSourceTokens: false,
		});

		let actual = mergeFindSingleRoots(doc, doc2);

		expect(actual).toMatchSnapshot();

		expect(stringifyWildcardsYamlData(actual)).toMatchSnapshot();

	});

	test(`mergeFindSingleRoots`, () =>
	{
		let souce = `
root:
  root2:
    sub1:
      - 123
    sub2:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		let souce2 = `
root:
  root2:
    sub2:
      - 123
    sub4:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		let doc = parseWildcardsYaml(souce, {
			allowEmptyDocument: true,
			keepSourceTokens: false,
		});

		let doc2 = parseWildcardsYaml(souce2, {
			allowEmptyDocument: true,
			keepSourceTokens: false,
		});

		expect(() => mergeFindSingleRoots(doc, doc2)).toThrowErrorMatchingSnapshot();

	});

})
