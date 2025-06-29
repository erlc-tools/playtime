import { promises as fs } from "fs";
import * as fss from "fs";
import { Logger } from "tslog"; 
import * as dotenv from "dotenv";
import * as path from "path";
import Datastore from 'nedb-promises'; 
import { Player } from "./index";

dotenv.config();
const debug_pre = process.env.debug as string;
var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { debug = true } else { debug = false };


const log = new Logger();
export const dbpath = process.env.dbpath as string;
export let db = undefined as undefined | Datastore<Userlog>; // undefined until dbfiles are checked

if (process.env.interval) {
    const interval = parseInt(process.env.interval);
} else {
    log.fatal("parsing int of interval failed");
    process.exit(1);
}

type Userlog = {
    id: number,
    playtime: number
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

export async function createuserlog(uid: number): Promise<Userlog> {
    // add to db, then return data
    return {id: uid, playtime: 0} as Userlog
}

export async function dblog(uid: number, interval: number) {
    async function addtoulog(ulog: Userlog): Promise<void> {
        await db?.update({ id: uid }, { $set: { playtime: ulog.playtime + interval}})
    }
    if(!db) {
        log.fatal("db isnt defined yet");
        process.exit(1);
    };

    // check if uid already has a record
    let record: Userlog
    db.findOne({ id: uid }).then( async (res: Userlog | null) => {
        if (res !== null) {
          record = res;
          addtoulog(record);
        } else {
            record = await createuserlog(uid);
        }
      });
};

export function massPtoID(Ps: Player[]): number[] {
    let results = [] as number[]
    Ps.forEach((item: Player) => {
        results.push(item.id)
    });
    return results;
}