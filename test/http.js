var progress = require('../index');
var http = require('http');
var fs = require('fs');
var log = require('single-line-log');
var numeral = require('numeral');

var str = progress({
	drain: true,
	time: 100,
	speed: 20
});
str.on('progress', function(progress) {
	log(Math.round(progress.percentage)+'%', 
	    numeral(progress.speed).format('0.00 b')+'/s',
	    numeral(progress.eta).format('00:00:00')+' left',
	    numeral(progress.remaining).format('0.00 b')+' remaining');
});

var options = {
	method: 'GET',
	host: 'cachefly.cachefly.net',
	path: '/100mb.test',
	headers: {
		'user-agent': 'testy test'
	}
};
http.request(options, function(response) {
	response.pipe(str);
}).end();

console.log('progress-stream using http module - downloading 10 MB file');