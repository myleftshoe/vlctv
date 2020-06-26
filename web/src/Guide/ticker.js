import { readable } from 'svelte/store';

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(Date.now());
	}, 30000);

	return function stop() {
		clearInterval(interval);
	};
});

