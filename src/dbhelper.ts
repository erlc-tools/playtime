import { promises as fs } from "fs";
import * as fss from "fs";
import { Logger } from "tslog"; 
import * as dotenv from "dotenv";
import * as path from "path";
import Datastore from 'nedb-promises'; 

dotenv.config();
const debug_pre = process.env.debug as string;
var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { const debug = true } else { const debug = false };


const log = new Logger();
export const dbpath = process.env.dbpath as string;
export let db = undefined as undefined | Datastore<PlaytimeDB>; // undefined until dbfiles are checked

if (process.env.interval) {
    const interval = parseInt(process.env.interval);
} else {
    log.fatal("parsing int of interval failed");
    process.exit(1);
}

type Userlog = {
    id: number,
    times: number
};

type Intervallog = {
    interval: number
};

type PlaytimeDB = {
    t: "u" | "i", // type
    u: Userlog | undefined,
    i: Intervallog | undefined
};

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
    fss.openSync(dbpath, "w");
    return;
};

export async function checkdbfile(): Promise<void> {
    if (debug === true) { log.debug("hello from checkdbfile!") };
    let res = await fileExists(dbpath);
    if ( res === false ) {
        createdbfile();
    };
    db = Datastore.create(dbpath)
    return;
};

export function createIntervalLog(): Intervallog {
    return {"interval": 1}; // placeholder (not finished)
}

export async function dblog(uid: number, interval: number) {
    if(!db) {
        log.fatal("db isnt defined yet");
        process.exit(1);
    }
    //check if interval var matches
    let ilog = db.findOne({t: "i"})
    if (!ilog) {
        createIntervalLog(); // sync
    }
}