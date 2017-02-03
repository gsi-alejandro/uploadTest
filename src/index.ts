import * as Q from 'q';
import Promise = Q.Promise;

export class XHRequest{
    private baseUrl: string;
    private accessToken: string;

    constructor(baseUrl: string, accessToken?: string){
        this.baseUrl = baseUrl || '';
        this.accessToken = accessToken || '';
    }

    exampleRequest(): Promise<any>{
        let requestData: IRequestData = {type: 'GET', uri: '/examples/4'};
        return this.request(requestData)
    }

    protected setAccessToken(accessToken: string){
        this.accessToken = accessToken || '';
    }

    protected setBaseUrl(baseUrl: string){
        this.baseUrl = baseUrl || '';
    }

    protected request(requestData: IRequestData) {
        let req = new XMLHttpRequest();

        let type = requestData.type || 'GET';
        req.open(type, this.buildUrl(requestData.uri, requestData.queryString));
        if (this.accessToken) {
            req.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
        }
        let defer = Q.defer();

        req.onreadystatechange = function() {
            if (req.readyState === 4) {

                let data = null;
                try {
                    data = req.responseText ? JSON.parse(req.responseText) : '';
                } catch (e) {
                    defer.reject({data: e, status: req.status});
                }

                if (req.status >= 200 && req.status < 300) {
                    defer.resolve({data: data, status: req.status});
                } else {
                    defer.reject({data: '', status: req.status});
                }
            }
        };

        if (type === 'GET') {
            req.send(null);
        } else {
            req.send(requestData.payload ? JSON.stringify(requestData.payload) : null);
        }

        return defer.promise;
    }

    protected buildUrl(uri: string, parameters: any) {
        let qs = '';
        for (let key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                let value = parameters[key];
                qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
            }
        }
        if (qs.length > 0) {
            qs = qs.substring(0, qs.length - 1);
            uri = uri + '?' + qs;
        }
        return this.baseUrl + uri;
    }
}

export interface IRequestData{
    uri: string,
    type: string,
    queryString?: any,
    payload?: any
}