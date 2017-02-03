"use strict";
var Q = require("q");
var XHRequest = (function () {
    function XHRequest(baseUrl, accessToken) {
        this.baseUrl = baseUrl || '';
        this.accessToken = accessToken || '';
    }
    XHRequest.prototype.exampleRequest = function () {
        var requestData = { type: 'GET', uri: '/examples/4' };
        return this.request(requestData);
    };
    XHRequest.prototype.setAccessToken = function (accessToken) {
        this.accessToken = accessToken || '';
    };
    XHRequest.prototype.setBaseUrl = function (baseUrl) {
        this.baseUrl = baseUrl || '';
    };
    XHRequest.prototype.request = function (requestData) {
        var req = new XMLHttpRequest();
        var type = requestData.type || 'GET';
        req.open(type, this.buildUrl(requestData.uri, requestData.queryString));
        if (this.accessToken) {
            req.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
        }
        var defer = Q.defer();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                var data = null;
                try {
                    data = req.responseText ? JSON.parse(req.responseText) : '';
                }
                catch (e) {
                    defer.reject({ data: e, status: req.status });
                }
                if (req.status >= 200 && req.status < 300) {
                    defer.resolve({ data: data, status: req.status });
                }
                else {
                    defer.reject({ data: '', status: req.status });
                }
            }
        };
        if (type === 'GET') {
            req.send(null);
        }
        else {
            req.send(requestData.payload ? JSON.stringify(requestData.payload) : null);
        }
        return defer.promise;
    };
    XHRequest.prototype.buildUrl = function (uri, parameters) {
        var qs = '';
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                var value = parameters[key];
                qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
            }
        }
        if (qs.length > 0) {
            qs = qs.substring(0, qs.length - 1);
            uri = uri + '?' + qs;
        }
        return this.baseUrl + uri;
    };
    return XHRequest;
}());
exports.XHRequest = XHRequest;
//# sourceMappingURL=index.js.map