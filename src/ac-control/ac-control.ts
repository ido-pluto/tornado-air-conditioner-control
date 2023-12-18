import AcAbortError from "../plans/errors/ac-abort-error.ts";
import { AcValues } from "./ac-payload/types.ts";
import AcRequest from "./ac-request.ts";
import GetAc from "./easy-control/get-ac.ts";
import SetAc from "./easy-control/post-ac.ts";

export default class AcControl {
    public lastResponse: Map<AcValues, number> = new Map();
    public onResponse?: (response: Map<AcValues, number>) => void;
    public abortController?: AbortController
    public constructor(private _request: AcRequest){
        this._setLastResponse = this._setLastResponse.bind(this);
    }

    public get get(){
        return new GetAc(this._request, this.abortController?.signal, this._setLastResponse);
    }

    public get set(){
        return new SetAc(this._request, this.abortController?.signal, this._setLastResponse);
    }

    private _setLastResponse(response?: Map<AcValues, number>){
        if(this.abortController?.signal.aborted){
            throw new AcAbortError();
        }
        
        if(response == null){
            throw new Error('Response is null');
        }

        for(const [key, value] of response){
            this.lastResponse.set(key, value);
        }

        this.onResponse?.(response);
    }
}