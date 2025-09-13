/**
 * Created by user on 2025/9/13.
 */
import JestMatchers = jest.JestMatchers;
import Matchers = jest.Matchers;

export function _expectToHavePropertyWithArrayCore<T extends any>(expectWho: JestMatchers<T> | Matchers<any, T>, propertyPath: string | readonly any[])
{
	expectWho.toHaveProperty(propertyPath, expect.arrayContaining([expect.anything()]))
}

/**
 * Checks if an object has a property that is an empty array.
 * Used as a Jest matcher function to verify that an object has a property with an empty array value.
 * Throws an error if the property contains any elements.
 *
 * @param actual - The object to check
 * @param propertyPath - The property path to check, as a string or array
 */
export function expectToHavePropertyWithEmptyArray<T extends any>(actual: T, propertyPath: string | readonly any[])
{
	_expectToHavePropertyWithArrayCore(expect(actual).not, propertyPath);

	// @ts-ignore
	expect(actual[propertyPath]).toHaveLength(0);

	//expect(actual).not.toHaveProperty(propertyPath, expect.arrayContaining([expect.anything()]))
}
