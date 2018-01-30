# cURL Request for Node.js

[![License][npm-license]][license-url]
[![Downloads][npm-downloads]][npm-url]

cURL Request is a cURL wrapper, support all options and infos from cURL.

## Why a cURL wrapper?

* All node libaries i have tested are very buggy in case you use a proxy and https
* cURL is working for all cases since years
* The wrapper is easy to use with promises 

## Installing

To utilize for node.js install the the `npm` module:

```bash
$ npm install curl-request --save
```

After installing the `npm` package you can now start simplifying requests like so:

```js
const curl = new (require( 'curl-request' ))();
```

If you have problems installing the dependencies, use this to build it from source:

```bash
$ npm install node-libcurl --build-from-source 
```

## Usage

```js
const curl = new (require( 'curl-request' ))();

curl.setHeaders([
    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
])
.get('https://www.google.com')
.then(({statusCode, body, headers}) => {
    console.log(statusCode, body, headers)
})
.catch((e) => {
    console.log(e);
});
```

```js
curl
.setBody({
 'input-arr[0]': 'input-arr-val0',
 'input-arr[1]': 'input-arr-val1',
 'input-arr[2]': 'input-arr-val2',
 'input-name': 'input-val'
})
.post('https://www.google.com')
.then(({statusCode, body, headers}) => {
    console.log(statusCode, body, headers)
})
.catch((e) => {
    console.log(e);
});
```

```js
// File upload
curl
.setHeaders([
    'Content-Type: multipart/form-data'
])
.setMultipartBody([{
  name: 'filename',
  contents: 'yourimage.png'
}, {
  name: 'file',
  file: './yourimage.png',
  type: 'image/png'
}])
.post('https://www.google.com')
.then(({statusCode, body, headers}) => {
    console.log(statusCode, body, headers)
})
.catch((e) => {
    console.log(e);
});
```

```js
// Set tor proxy
curl.default.useProxy = true;
curl.default.proxy =  'localhost:9050';
curl.default.proxyType = curl.libcurl.proxy.SOCKS5_HOSTNAME;
curl.default.torControlHost = 'localhost';
curl.default.torControlPort = 9051;
```

```js
// New tor identity
curl.newTorIdentity();
```

```js
// Verbose output
curl.default.verbose = true;
```

##
## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


----

[license-url]: https://github.com/do-web/curl-request/blob/master/LICENSE

[npm-url]: https://www.npmjs.com/package/curl-request
[npm-license]: https://img.shields.io/npm/l/curl-request.svg?style=flat
[npm-version]: https://badge.fury.io/js/curl-request.svg
[npm-downloads]: https://img.shields.io/npm/dm/curl-request.svg?style=flat