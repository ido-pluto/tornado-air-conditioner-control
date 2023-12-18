enum GetPayloadKeys {
    EnvironmentTemperature = "mode",
}

export default class GetPayload {
    private _keys: string[] = [];

    onlyEnvironmentTemperature(){
        this._keys.push(GetPayloadKeys.EnvironmentTemperature);
        return this;
    }

    protected get _payload() {
        return {
            "vals": [this._keys.map(() => [{ val: 0, idx: 1 }])],
            "act": "get",
            "params": this._keys,
        }
    }
}