import _initializeClerkClient, { DEFAULT_OPTIONS } from './initializeClerkClient';

type Params = Parameters<typeof _initializeClerkClient>;

export async function initializeClerkClient(
	key: Params[0],
	options: Params[1] = DEFAULT_OPTIONS
): Promise<void> {
	return _initializeClerkClient(key, options);
}
