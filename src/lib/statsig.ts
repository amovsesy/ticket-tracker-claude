import { PUBLIC_STATSIG_SDK_KEY, PUBLIC_STATSIG_TIER } from '$env/static/public';
import { StatsigClient, type StatsigOptions, type StatsigUser } from '@statsig/js-client';
import { StatsigSessionReplayPlugin } from '@statsig/session-replay';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';

export let statsigClient: StatsigClient;

export const initializeStatsigForBrowser = (userID: string | undefined, customID: string) => {
	if (statsigClient) {
		return;
	}

	const statsigUser: StatsigUser = {
		userID,
		customIDs: {
			stableID: customID
		}
	};

	const options: StatsigOptions = {
		plugins: [new StatsigSessionReplayPlugin(), new StatsigAutoCapturePlugin()],
		environment: { tier: PUBLIC_STATSIG_TIER }
	};

	statsigClient = new StatsigClient(PUBLIC_STATSIG_SDK_KEY, statsigUser, options);
	statsigClient.initializeSync();
};
