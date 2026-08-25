// Ghost Refresh — host half.
// The plugin is browser-only: the ghost image is embedded in the client
// bundle as a data URI, so the host side contributes nothing and exists
// only because every composition row resolves a host entry.
// Cordis requires every plugin to be a function or expose an apply method,
// so this exports a valid no-op plugin rather than a bare object.
export default {
	apply() {
		// Intentionally empty: all behavior lives in the browser half.
	},
};
