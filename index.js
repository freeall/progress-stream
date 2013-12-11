var through = require('through2');

module.exports = function(options, onprogress) {
	if (typeof options === 'function') return module.exports(null, options);
	options = options || {};

	var length = options.length || 0;
	var time = options.time || 0;
	var drain = options.drain || false;
	var read = 0;
	var nextUpdate = Date.now()+time;
	var delta = 0;

	var update = {
		percentage: 0,
		read: read,
		length: length
	};

	var emit = function(ended) {
		update.delta = delta;
		update.read = read;
		update.length = length;
		update.percentage = ended ? 100 : (length ? read/length*100 : 0);
		nextUpdate += time;
		delta = 0;

		tr.emit('progress', update);
	};
	var write = function(chunk, enc, callback) {
		read += chunk.length;
		delta += chunk.length;

		if (Date.now() >= nextUpdate) emit(false);
		callback(null, chunk);
	};
	var end = function(callback) {
		emit(true);
		callback();
	};

	var tr = through(options.objectMode ? {objectMode:true, highWaterMark:16} : {}, write, end);
	var onlength = function(newLength) {
		length = newLength;
		tr.emit('length', length);
	};
	tr.on('pipe', function(stream) {
		// Support http module
		if (stream.readable && !stream.writable && stream.headers) {
			return onlength(parseInt(stream.headers['content-length'] || 0));
		}

		// Support request module
		stream.on('response', function(res) {
			if (res && res.headers && res.headers['content-length']) {
				return onlength(parseInt(res.headers['content-length']));
			}
		});
	});

	if (drain) tr.resume();
	if (onprogress) tr.on('progress', onprogress);

	return tr;
};
