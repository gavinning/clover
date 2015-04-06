define(function(){
	var db, index, cache;

	cache = {};
	index = 'cloverjs';
	db = localStorage;

	return {

		get: function(type, guid, fn){
			cache = JSON.parse(db[index]);
			return guid ? cache[type][guid] : cache[type];
			// guid ? fn(cache[type][guid]) : fn(cache[type]);
		},

		set: function(type, data){
			cache = JSON.parse(db[index] || '{}');
			cache[type] ? '' : cache[type] = {};
			cache[type][data.guid] = data;
			db[index] = JSON.stringify(cache);
		}
	};
});