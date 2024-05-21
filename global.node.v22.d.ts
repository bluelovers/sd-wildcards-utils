/**
 * Created by user on 2024/5/22.
 */

interface IOptionsNodeGlob
{
	/**
	 * current working directory. **Default:** `process.cwd()`
	 */
	cwd?: string;

	/**
	 * Function to filter out files/directories. Return `true` to exclude the item, `false` to include it. **Default:** `undefined`.
	 */
	exclude?(entry: string): boolean;
}

declare module "fs/promises"
{
	/**
	 * An AsyncIterator that yields the paths of files
	 *   that match the pattern.
	 */
	function glob(pattern: string | string[], options?: IOptionsNodeGlob): AsyncIterator<string[], string>
}

declare module "fs"
{
	function globsync(pattern: string | string[], options?: IOptionsNodeGlob): string[]

	function glob(pattern: string | string[],
		callback: (err?: NodeJS.ErrnoException | null) => void
	): void
	function glob(pattern: string | string[],
		options: IOptionsNodeGlob,
		callback: (err?: NodeJS.ErrnoException | null) => void
	): void
}
