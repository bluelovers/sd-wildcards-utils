
export default Promise.all([
	import('./output/copy'),
	import('./output/build'),
	import('./split'),
])
