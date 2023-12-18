import ParsePayload from "./ac-payload/parse-payload.ts";
import { AcSettings } from "./parse-settings.ts";

export default class AcRequest {
    public constructor(private _settings: AcSettings) {}

    get url() {
        return `https://${this._settings.host}/device/control/v${this._settings.interfaceVersion}/sdkcontrol?license=${this._settings.license}`;
    }

    public get headers() {
        const messageId = Date.now() / 1000;
        const timestamp = messageId.toFixed(0);

        const fullMessageId = `${this._settings.userid}-${this._settings.device.endpointId}-${messageId.toString()}`;
        return {
            language: 'en-il',
            appPlatform: 'iOS',
            'User-Agent': 'Tornado%20WIFI%203/1 CFNetwork/1490.0.4 Darwin/23.2.0',
            userid: this._settings.userid,
            appVersion: '2.1.2',
            system: 'iOS',
            loginmode: 'mutuallyexclusive',
            licenseid: this._settings.licenseId,
            'loginsession': this._settings.loginsession,
            'Connection': 'keep-alive',
            'timestamp': timestamp,
            'Accept-Language': 'en-us',
            'messageId': fullMessageId,
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': '*/*',
        }
    }

    private _createBody(headers: any, payload: any) {
        return JSON.stringify({
            "directive": {
                "payload": payload,
                "endpoint": {
                    "cookie": {},
                    "endpointId": this._settings.device.endpointId,
                    "devicePairedInfo": {
                        "cookie": Buffer.from(JSON.stringify(
                            {
                                "device":
                                {
                                    "aeskey": this._settings.device.cookieId,
                                    "did": this._settings.device.endpointId,
                                    "id": this._settings.device.id,
                                    "mac": this._settings.device.mac,
                                    "pid": this._settings.device.pid,
                                }
                            }
                        )).toString('base64'),
                        "devicetypeflag": 0,
                        "pid": this._settings.device.pid,
                        "mac": this._settings.device.mac,
                        "did": this._settings.device.endpointId,
                    }
                },
                "header": {
                    "messageId": headers.messageId,
                    "namespace": "DNA.KeyValueControl",
                    "interfaceVersion": this._settings.interfaceVersion.toString(),
                    "name": "KeyValueControl",
                    "timstamp": (headers.timestamp / 1000).toFixed(0),
                },
            }
        });
    }

    async request(headers: any, payload: any) {
        const body = this._createBody(headers, payload);

        const options = {
            method: 'POST',
            headers: headers,
            body: body,
        }

        const response = await fetch(this.url, options);
        const responseJSON = await response.json();
        const payloadResponse = responseJSON.event?.payload?.data;

        if (payloadResponse) {
            const parse = new ParsePayload(JSON.parse(payloadResponse));
            parse.parse();
            return parse.values;
        }
    }
}