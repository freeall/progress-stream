# progress-stream

Read the progress of a stream. You can either instantiate it with a specific length, or it will read the length automatically if you're using the request module or http module.

	npm install progress-stream

## Usage

This example copies a large file, and prints out the percentage every 100ms.

```js
var progress = require('progress-stream');
var fs = require('fs');

var stat = fs.statSync(filename);
var p = progress({
	length: stat.size,
	time: 100
});

p.on('progress', function(progress) {
	console.log(Math.round(progress.percentage)+'%');
});

fs.createReadStream(filename)
	.pipe(p)
	.pipe(fs.createWriteStream(output));

```

## Methods

### progress([options], [onprogress])

You can instantiate in two ways:

``` js
var p = progress({time:100});
p.on('progress', function(progress) { ... });
```

or inline the progress listener

``` js
var p = progress({time:100}, function(progress) { ... });
```

## Events

### on('progress', function(progress) { ... })
``` js
var p = progress({time:100});
p.on('progress', function(progress) { ... });
```

## Options

### time(integer)

Sets how often progress events is emitted. If omitted then defaults to emit every time a chunk is received.

### length(integer)

If you already know the length of the stream, then you can set it. Defaults to 0.

### drain(boolean)

In case you don't want to include a readstream after progress-stream, set to true to drain automatically. Defaults to false.

## Examples

### Using the request module

This example uses request to download a 100 MB file, and writes out the percentage every second.

You can also find an example in `test/request.js`.

``` js
var progress = require('progress-stream');
var req = require('request');
var fs = require('fs');

var p = progress({
	time: 1000
});

p.on('progress', function(progress) {
	console.log(Math.round(progress.percentage)+'%');
});

req('http://cachefly.cachefly.net/100mb.test', { headers: { 'user-agent': 'test' }})
	.pipe(p)
	.pipe(fs.createWriteStream('test.data'));
```

### Using the http module

In `test/http.js` it's shown how to do it with the http module.

