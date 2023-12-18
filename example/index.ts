import {createAcAgent, WinterProgram} from "aux-air-conditioner-sdk";

const acAgent = await createAcAgent('request.http');
const winter = new WinterProgram(acAgent);


async function main(){
    // start the AC
    await acAgent.set.on().run();

    // run the winter program
    winter.run();
}

await main();