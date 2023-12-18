import AcError from "./ac-error.ts";

export default class AcOffError extends AcError {
    public constructor(message = "Air conditioner is off", public code = 500){
        super(message, code);
    }
}