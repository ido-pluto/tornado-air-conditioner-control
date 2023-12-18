import GetPayload from "../ac-payload/get-payload.ts";
import { AcValues } from "../ac-payload/types.ts";
import AcRequest from "../ac-request.ts";

export default class GetAc extends GetPayload {
    public constructor(private _request: AcRequest, private _abortSignal?: AbortSignal, private _callback?: (response?: Map<AcValues, number>) => void){
        super();
    }

    async run(){
        if(this._abortSignal?.aborted){
            return;
        }

        const response = await this._request.request(this._request.headers, this._payload);
        this._callback?.(response);
        return response;
    }
}