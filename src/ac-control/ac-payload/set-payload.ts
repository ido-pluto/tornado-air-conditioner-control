import { AcMode, AcPower, AcValues, FanSpeed } from "./types.ts";


export default class SetPayload {
    private _mapValues: { [key: string]: any } = {};

    on() {
        this._mapValues[AcValues.Power] = AcPower.On;
        return this;
    }

    off() {
        this._mapValues[AcValues.Power] = AcPower.Off;
        return this;
    }

    showDisplay(on = true) {
        this._mapValues[AcValues.Display] = Number(on);
        return this;
    }

    sleepMode(on = true) {
        this._mapValues[AcValues.SleepMode] = Number(on);
        return this;
    }

    coolMode() {
        this._mapValues[AcValues.Mode] = AcMode.Cool;
        return this;
    }

    heatMode() {
        this._mapValues[AcValues.Mode] = AcMode.Heat;
        return this;
    }

    dryMode() {
        this._mapValues[AcValues.Mode] = AcMode.Dry;
        return this;
    }

    fanMode() {
        this._mapValues[AcValues.Mode] = AcMode.Fan;
        return this;
    }

    autoMode() {
        this._mapValues[AcValues.Mode] = AcMode.Auto;
        return this;
    }
    /**
     * 0 = auto
     * 1 = low
     * 2 = medium
     * 3 = high
     * 4 = turbo
     */
    fanSpeed(level: FanSpeed, comfWind = false) {
        this._mapValues[AcValues.FanSpeed] = level;
        this._mapValues[AcValues.ComfWind] = Boolean(comfWind);
        return this;
    }

    leftRightSwing(on = true) {
        this._mapValues[AcValues.LeftRightSwing] = Number(on);
        return this;
    }

    upDownSwing(on = true) {
        this._mapValues[AcValues.UpDownSwing] = Number(on);
        return this;
    }

    ecoMode(on = true) {
        this._mapValues[AcValues.EcoMode] = Number(on);
        return this;
    }

    clean(on = false) {
        this._mapValues[AcValues.Clean] = Number(on);
        return this;
    }

    temp(temp: number) {
        this._mapValues[AcValues.Temperature] = SetPayload.convertTemperature(temp);
        this._mapValues[AcValues.TemperatureUnit] = 1;
        this._mapValues[AcValues.TemperatureDecimal] = 0;
        this._mapValues[AcValues.TemperatureConvert] = 0;
        return this;
    }

    protected get _payload() {
        return {
            "act": "set",
            "vals": Object.values(this._mapValues)
                .map((value) => [{ val: value, idx: 1 }]),
            "params": Object.keys(this._mapValues)
        }
    }

    public static convertTemperature(temp: number) {
        if (temp.toFixed(0).length == 2) {
            temp = temp * 10;
        }

        return temp;
    }
}