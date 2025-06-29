import { promises as fs } from "fs";
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
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
}

export async function createdbfile(): Promise<void> { // will overwrite if exists already
    return fs.writeFile(dbpath, "");
};

export function checkdbfile(): void {
    fileExists(dbpath).then((res: boolean) => {
        if ( res === false ) {
            createdbfile().then(() => {return;})
        };
        return;
    });
};