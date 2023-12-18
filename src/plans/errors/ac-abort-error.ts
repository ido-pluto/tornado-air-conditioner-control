import AcError from "./ac-error.ts";

export default class AcAbortError extends AcError {
    public constructor(message = "Program aborted by the user", public code = 400){
        super(message, code);
    }
}