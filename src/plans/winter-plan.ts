import AcControl from "../ac-control/ac-control.ts";
import BasePlan from "./base-plan.ts";

export default class WinterProgram extends BasePlan {
    protected _HEAT_TIME = 1000 * 60 * 60 * 25;
    protected _HEAT_TEMP = 18;

    protected _AFTER_HEAT_COLD_TEMP = 22;

    protected _CHANGE_TEMP = 5;
    protected _TEMP_RANGE = [17, 21];

    /**
     * This program that will keep the temperature between 17 and 21 degrees.
     * 
     * @description
     * 1. Set AC to heat mode, 18 degrees (25 minutes)
     * 2. Set AC to cool mode, 22 degrees
     * 
     * 3. While true (45 minutes delay each iteration):
     *     1. While environment temperature is greater than 17 degrees:
     *        1. Decrease the AC 5 degrees less than current temperature
     * 
     *    2. While environment temperature is less than 21 degrees:
     *       1. Increase the AC 5 degrees more than current temperature
     */
    public constructor(acControl: AcControl, abortController?: AbortController) {
        super(acControl, abortController);
    }


    async run(): Promise<void> {
        await this._acControl.set.heatMode().temp(this._HEAT_TEMP).run();
        await this._sleep(this._HEAT_TIME);

        await this._acControl.set.coolMode().temp(this._AFTER_HEAT_COLD_TEMP).run();
        await this._sleep();

        while (!this._abortController?.signal.aborted) {
            while (await this._envTemp() >= this._TEMP_RANGE[0]) {
                this._acControl.set.coolMode().temp(this._acTemp - this._CHANGE_TEMP).run();
                await this._sleep();
            }

            while (await this._envTemp() <= this._TEMP_RANGE[1]) {
                this._acControl.set.coolMode().temp(this._acTemp + this._CHANGE_TEMP).run();
                await this._sleep();
            }
        }
    }
}


