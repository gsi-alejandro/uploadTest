/// <reference types="q" />
import * as Q from 'q';
import Promise = Q.Promise;
export declare class XHRequest {
    private baseUrl;
    private accessToken;
    constructor(baseUrl: string, accessToken?: string);
    exampleRequest(): Promise<any>;
    protected setAccessToken(accessToken: string): void;
    protected setBaseUrl(baseUrl: string): void;
    protected request(requestData: IRequestData): Q.Promise<{}>;
    protected buildUrl(uri: string, parameters: any): string;
}
export interface IRequestData {
    uri: string;
    type: string;
    queryString?: any;
    payload?: any;
}
