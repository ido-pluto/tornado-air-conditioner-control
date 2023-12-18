export default class AcError extends Error {
    public constructor(message: string, public code: number){
        super(message);
    }
}