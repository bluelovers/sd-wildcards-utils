//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import {
	parseWildcardsYaml,
	mergeFindSingleRoots,
	stringifyWildcardsYamlData,
	IParseWildcardsYamlInputSource,
} from '../src/index';

beforeAll(async () =>
{

});

describe(`merge`, () =>
{

	test.skip(`dummy`, () => {});

	const source = `
# comment source
root:
  # comment source
  root2:
    sub1:
      - 123
    sub1-1:
      # comment source
      - 123
    sub2:
      sub2-1:
        - 456
      # comment source
      sub2-2:
        - 789
`;

	test(`mergeFindSingleRoots`, () =>
	{
		let source2 = `
# comment root
root:
  # comment root2
  root2:
    sub1:
      - 123
    sub4:
      sub2-1:
        - 456
      # comment source
      sub2-2:
        - 789
`

		_mergeFindSingleRoots(source, source2);

	});

	test(`mergeFindSingleRoots: Single Seq`, () =>
	{
		let source2 = `
root:
  root2:
    sub1:
      - 123
`

		_mergeFindSingleRoots(source, source2);

		source2 = `
root:
  root2:
    sub1:
      - 123456
`

		_mergeFindSingleRoots(source, source2);

	});

	test(`mergeFindSingleRoots: multi merge`, () =>
	{
		let source2 = `
root:
  root2:
    sub1:
      - 123456
    sub1-1:
      - 123456
    sub4:
      sub2-1:
        - 456
      sub2-2:
        - 789
`

		_mergeFindSingleRoots(source, source2)

	});

	test(`mergeFindSingleRoots: deep merge: level 2`, () =>
	{
		let source2 = `
root:
  root2:
    sub1:
      - 123456
    sub2:
      sub2-1:
        - 456789
`

		_mergeFindSingleRoots(source, source2)

	});

	test(`mergeFindSingleRoots: throw`, () =>
	{
		let source2 = `
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

		_mergeFindSingleRoots(source, source2, true);

	});

})

function _mergeFindSingleRoots(souce: IParseWildcardsYamlInputSource, source2: IParseWildcardsYamlInputSource, shouldThrow?: boolean)
{
	let doc = parseWildcardsYaml(souce, {
		allowEmptyDocument: true,
		keepSourceTokens: false,
	});

	let doc2 = parseWildcardsYaml(source2, {
		allowEmptyDocument: true,
		keepSourceTokens: false,
	});

	if (shouldThrow)
	{
		expect(() => mergeFindSingleRoots(doc, doc2)).toThrowErrorMatchingSnapshot();
	}
	else
	{
		let actual = mergeFindSingleRoots(doc, doc2);
		let actualString = stringifyWildcardsYamlData(actual);

		expect(actual).toMatchSnapshot();
		expect(actualString).toMatchSnapshot();

		return {
			doc,
			doc2,
			actual,
			actualString,
		} as const
	}
}
