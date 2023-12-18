import { AcValues } from "./types.ts";

export default class ParsePayload {
    public values: Map<AcValues, number> = new Map();
    public constructor(private _payload: any) { }

    parse(){
        for(let i = 0; i < this._payload.params.length; i++){
            const key = this._payload.params[i];
            const value = this._payload.vals[i][0].val;
            this.values.set(key, value);
        }
    }
}