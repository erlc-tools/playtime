import { promises as fs } from "fs";
import * as fss from "fs";
import { Logger } from "tslog"; 
import * as dotenv from "dotenv";
import * as path from "path";
const Datastore = require("nedb-promises"); // i fucking hate require

dotenv.config();
const debug_pre = process.env.debug as string;
var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { const debug = true } else { const debug = false };


const log = new Logger();
export const dbpath = process.env.dbpath as string;


export async function fileExists(path: string): Promise<boolean> {
    if (debug === true) { log.debug("hello from fileExists!") };
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
}

export function createdbfile(): void { // will overwrite if exists already
    if (debug === true) { log.debug("hello from createdbfile!") };
    fss.mkdirSync(path.dirname(dbpath), { recursive: true });
    fss.openSync(dbpath, "");
    return;
};

export async function checkdbfile(): Promise<void> {
    if (debug === true) { log.debug("hello from checkdbfile!") };
    let res = await fileExists(dbpath);
    if ( res === false ) {
        createdbfile();
    };
    return;
};