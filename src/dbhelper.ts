import { promises as fs } from "fs";
import * as fss from "fs";
import { Logger } from "tslog"; 
import * as dotenv from "dotenv";
import * as path from "path";
import * as ptdb from './database'; 
import { Player } from "./index";

dotenv.config();
const debug_pre = process.env.debug as string;
var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { debug = true } else { debug = false };


const log = new Logger();
export const dbpath = process.env.dbpath as string;

export const dbi = {
    filepath: dbpath,
    logger: log,
    debug: debug
} as ptdb.DBinfo

if (process.env.interval) {
    const interval = parseInt(process.env.interval);
} else {
    log.fatal("parsing int of interval failed");
    process.exit(1);
}

export type PlaytimeLog = {
    number: number // id: playtime
}
export type Database = PlaytimeLog[];

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
    return;
};


export async function dblog(uid: number, interval: number) {
    if (debug === true) { log.debug("hello from dblog!") };

    // get old playtime
    var playtime = await ptdb.getFromID(dbi, uid);
    if (typeof playtime !== "number") {
        playtime = 0;
    }


    ptdb.writeToID(dbi, uid, playtime + interval);
};