const Curl = require('node-libcurl').Curl;
const Net = require('net');
const querystring = require('querystring');

module.exports = (function () {

    let that = this;

    this['default'] = {
        torControlHost: 'localhost',
        torControlPort: 9051,
        autoParse: true // content-type detect -> json
    };

    this.curl = new Curl();

    this.newTorIdentity = () => {
        let client = new Net.Socket();
        client.connect(this['default'].torControlPort, this['default'].torControlHost, () => {
            client.write('authenticate\nsignal newnym\nquit');
        });
    };

    this._setUrl = (url) => {
        this.curl.setOpt(Curl.option.URL, url);
        return this;
    };

    this.setMultipartBody = (fieldsArray) => {
        this.curl.setOpt(Curl.option.HTTPPOST, fieldsArray);
        return this;
    };

    this.setOpt = (opt, val) => {
        this.curl.setOpt(opt, val);
        return this;
    };

    this.getCurl = () => {
        return this.curl;
    };

    this.setCurl = (curl_replace) => {
        this.curl = curl_replace;
        return this;
    };

    this.setBody = (fieldsObj) => {

        if(typeof fieldsObj !== 'string') {
            fieldsObj = querystring.stringify(fieldsObj)
        }
        curl.setOpt(Curl.option.POSTFIELDS, fieldsObj);
        return this;
    };

    this.setVerbose = (verbose) => {
        this.curl.setOpt(Curl.option.VERBOSE, verbose);
        return this;
    };

    this.setProxy = (host, proxyType) => {
        this.curl.setOpt(Curl.option.PROXY, host);

        // SOCKS5 default
        if (typeof proxyType === 'undefined') {
            this.curl.setOpt(Curl.option.PROXYTYPE, Curl.proxy.SOCKS5_HOSTNAME);
        } else {
            this.curl.setOpt(Curl.option.PROXYTYPE, proxyType);
        }

        return this;
    };

    this.setFollowLocation = (followlocation) => {
        this.curl.setOpt(Curl.option.FOLLOWLOCATION, followlocation);
        return this;
    };

    this.setHeaders = (headers) => {
        this.curl.setOpt(Curl.option.HTTPHEADER, headers);
        return this;
    };

    this.get = (url) => {
        this._setUrl(url);
        this.curl.setOpt(Curl.option.CUSTOMREQUEST, 'GET');
        return this._submit();
    };

    this.post = (url) => {
        this._setUrl(url);
        this.curl.setOpt(Curl.option.CUSTOMREQUEST, 'POST');
        return this._submit();
    };

    this.patch = (url) => {
        this._setUrl(url);
        this.curl.setOpt(Curl.option.CUSTOMREQUEST, 'PATCH');
        return this._submit();
    };

    this['delete'] = (url) => {
        this._setUrl(url);
        this.curl.setOpt(Curl.option.CUSTOMREQUEST, 'DELETE');
        return this._submit();
    };

    this.head = (url) => {
        this._setUrl(url);
        this.curl.setOpt(Curl.option.CUSTOMREQUEST, 'HEAD');
        return this._submit();
    };

    let normalizeHeaders = (headers) => {
        // normalize headers
        let nHeaders = {};
        if (headers.length) {
            Object.keys(headers[0]).forEach((k) => {
                nHeaders[k.toString().toLocaleLowerCase()] = headers[0][k];
            });
        }
        return nHeaders;
    };

    this._reset = () => {
        this.curl = new Curl();
    };

    this._submit = () => {
        return new Promise((resolve, reject) => {

            try {
                this.curl.on('end', function (statusCode, body, headers) {

                    headers = normalizeHeaders(headers);

                    if (that.default.autoParse) {
                        if (typeof headers['content-type'] !== 'undefined' &&
                            headers['content-type'].toLocaleLowerCase() === 'application/json') {
                            try {
                                let jsonObj = JSON.parse(body);
                                body = jsonObj;
                            } catch (e) {
                            }
                        }
                    }

                    resolve({statusCode, body, headers});
                    this.close();
                    that._reset();
                });

                this.curl.on('error', function () {
                    reject(arguments);
                    this.close();
                    that._reset();
                });
                this.curl.perform();
            } catch(e) {
                reject(e);
            }
        });
    };

    return this;
})();