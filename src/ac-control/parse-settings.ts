export type AcSettings = {
    license: string;
    licenseId: string;
    loginsession: string;
    userid: string;
    host: string;
    device: {
        endpointId: string;
        pid: string;
        cookieId: string;
        mac: string;
        id: number;
    };
    interfaceVersion: number;

}
export default class ParseSettings {
    private _url: URL;

    public constructor(url: string, private _headers: any | object | string, private _payload: any) {
        this._parseHeadersRaw();
        this._parsePayload();
        this._url = new URL(url, "https://example.com");
    }

    private _parseHeadersRaw(){
        if(!this._headers){
            throw new Error("Headers are not defined");
        }

        if(typeof this._headers !== "string"){
            for(const key in this._headers){
                this._headers[key.toLocaleLowerCase()] = this._headers[key];
            }
            return;
        }

        const headers = this._headers as string;
        const headersArray = headers.split(/\r\n|\n/);
        const headersObject: any = {};
        for (const header of headersArray) {
            const [key, value] = header.split(":");
            headersObject[key.trim().toLocaleLowerCase()] = value.trimStart();
        }
        this._headers = headersObject;
    }

    private _parsePayload(){
        if(!this._payload){
            throw new Error("Payload is not defined");
        }

        if(typeof this._payload !== "string"){
            return
        }

        const payload = this._payload as string;
        this._payload = JSON.parse(payload);
    }

    public parseSettings(){
        const endpoint = this._payload.directive.endpoint;
        const devicePairedInfo = endpoint.devicePairedInfo;
        
        const content = Buffer.from(devicePairedInfo.cookie, 'base64').toString('utf8');
        const { device } = JSON.parse(content);

        return {
            license: this._url.searchParams.get("license") || "",
            licenseId: this._headers.licenseid,
            loginsession: this._headers.loginsession,
            userid: this._headers.userid,
            host: this._headers.host,
            device: {
                endpointId: endpoint.endpointId,
                pid: devicePairedInfo.pid,
                cookieId: device.aeskey,
                mac: devicePairedInfo.mac,
                id: device.id,
            },
            interfaceVersion: this._payload.directive.header.interfaceVersion,
        }
    }

    static parseRawRequest(content: string){
        const endRequestIndex = content.search(/\r\n|\n/);
        const request = content.slice(0, endRequestIndex);
        const [_, path] = request.split(" ");

        const headersAndPayload = content.slice(endRequestIndex);
        const [headers, payload] = headersAndPayload.split(/\r\n\r\n|\n\n/);
        
        const parser = new ParseSettings(path, headers.trimStart(), payload);
        return parser.parseSettings();
    }

    static async parseRawRequestFromFile(path: string){
        const content = await Bun.file(path).text();
        return ParseSettings.parseRawRequest(content);
    }
}