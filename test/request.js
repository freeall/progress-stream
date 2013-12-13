var progress = require('../index');
var req = require('request');
var fs = require('fs');
var log = require('single-line-log');
var numeral = require('numeral');

var str = progress({
	drain: true,
	time: 100
}, function(progress) {
	log(Math.round(progress.percentage)+'%', 
	    numeral(progress.speed).format('0.00 b')+'/s',
	    numeral(progress.eta).format('00:00:00')+' left',
	    numeral(progress.remaining).format('0.00 b')+' remaining');
});

req('http://cachefly.cachefly.net/10mb.test', {
	headers: { 'user-agent': 'test' }
}).pipe(str);

console.log('progress-stream using request module - downloading 10 MB file');