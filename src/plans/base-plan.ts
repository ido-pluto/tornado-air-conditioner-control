import AcControl from "../ac-control/ac-control.ts";
import SetPayload from "../ac-control/ac-payload/set-payload.ts";
import { AcPower, AcValues } from "../ac-control/ac-payload/types.ts";
import AcAbortError from "./errors/ac-abort-error.ts";
import AcOffError from "./errors/ac-off-error.ts";

export default abstract class BasePlan {
    protected _SLEEP_INTERVAL = 1000 * 60 * 45;

    protected get _acTemp() {
        return this._acControl.lastResponse.get(AcValues.Temperature) || 0;
    }

    protected constructor(protected _acControl: AcControl, protected _abortController: AbortController = null!){
        this._abortController = (_acControl.abortController ??= _abortController) ?? new AbortController();
        this._acControl.onResponse = this._onChange.bind(this);
    }

    /**
     * Get the environment temperature, if the request fails (or run aborted), it will return NaN
     * @returns {number} The environment temperature
     */
    protected async _envTemp() {
        if(this._abortController.signal.aborted){
            throw new AcAbortError();
        }

        const response = await this._acControl.get.onlyEnvironmentTemperature().run();
        return response?.get(AcValues.EnvironmentTemperature) || NaN;
    }

    abstract run(abortSignal: AbortSignal): Promise<void>;

    /**
     * Sleep for a certain amount of time, if the abort signal is aborted, it will return false
     * @param ms The time to sleep in milliseconds
     * @returns {Promise<boolean>} If the abort signal is aborted, it will return false
     */
    protected _sleep(ms = this._SLEEP_INTERVAL): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let abort: () => void;

            const timeout = setTimeout(() => {
                this._abortController.signal.removeEventListener('abort', abort);
                resolve(true);
            }, ms);

            abort = () => {
                clearTimeout(timeout);
                reject(new AcAbortError());
            }
            
            this._abortController.signal.addEventListener('abort', abort);
        });
    }

    protected _onChange(response: Map<AcValues, number>){
        if(response.get(AcValues.Power) === AcPower.Off){
            const error = new AcOffError();
            this._abortController.abort(error.message);
            throw error;
        }
    }
}


