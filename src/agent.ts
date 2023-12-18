import AcControl from "./ac-control/ac-control.ts";
import AcRequest from "./ac-control/ac-request.ts";
import ParseSettings from "./ac-control/parse-settings.ts";

const DEFAULT_HTTP_FILE = 'request.http';
export async function createAcAgent(httpFile = DEFAULT_HTTP_FILE){
    const settings = await ParseSettings.parseRawRequestFromFile(httpFile);
    return new AcControl(
        new AcRequest(settings)
    );
}