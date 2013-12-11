var progress = require('../index');
var http = require('http');
var fs = require('fs');
var log = require('single-line-log');
var speedometer = require('speedometer');
var numeral = require('numeral');

var speed = speedometer();
var p = progress({drain:true, time:100});
p.on('progress', function(progress) {
	log(Math.round(progress.percentage)+'%', numeral(speed(progress.delta)).format('0.00 b')+'/s');
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
	response.pipe(p);
}).end();

console.log('progress-stream using http module - downloading 100 MB file');