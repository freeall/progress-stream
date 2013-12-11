var progress = require('../index');
var req = require('request');
var fs = require('fs');
var log = require('single-line-log');
var speedometer = require('speedometer');
var numeral = require('numeral');

var speed = speedometer();
var p = progress({drain:true, time:100});
req('http://cachefly.cachefly.net/100mb.test', {
	headers: { 'user-agent': 'test' }
}).pipe(p);

p.on('progress', function(progress) {
	log(Math.round(progress.percentage)+'%', numeral(speed(progress.delta)).format('0.00 b')+'/s');
});

console.log('progress-stream using request module - downloading 100 MB file');