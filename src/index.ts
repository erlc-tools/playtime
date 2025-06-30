// imports
import * as erlc from "erlc";
import * as dotenv from "dotenv";
import { Logger } from "tslog"; 
import * as dbhelper from "./dbhelper";
import { massSPtoP, SPtoP, massPtoID } from "./conversion";

// post-imports
export const log = new Logger();
dotenv.config()

// vars
let players: number[]
const token = process.env.tkn as string

// debug var setup
const debug_pre = process.env.debug as string;
export var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { debug = true } else { debug = false };



log.info(`DEBUG IS ${debug}`)


const client = new erlc.Client({
	globalToken: process.env.ratelimit as string
});
client.config(); // save options

if (debug === true) {
	log.info(["tkn passed in=", token])
}


export type Player = {
	name: string,
	id: number
}


const getPlayers = async (): Promise<erlc.ServerPlayer[]> => {
	if (debug) {log.info("hello from getPlayers")};
	return await erlc.getPlayers(token);
};

log.info("checking db file");
dbhelper.checkdbfile();

log.info("creating task")
async function playerchecktask(): Promise<void> {
	// get players in game
	let players = [] as number[]
	
	var tmp = await getPlayers()
	players = massPtoID(massSPtoP(tmp))

	// log them
	if (debug) {log.debug(["these players were found in game: ", players])};
	players.forEach((uid: number) => {
		dbhelper.dblog(uid, interval)
	})
};

log.info("loading task runner")

let interval = 5 as number // fallback
if (process.env.interval) {
	try {
		interval = parseInt(process.env.interval) as number
	} catch {
		log.fatal("Could not parse interval. Make sure there is only a number in the entry.")
		process.exit(1);
	}
} else {
	interval = 5 // fallback fallback (idk)
}
log.info(`Interval is ${interval}`)

playerchecktask()
setInterval(() => {
  playerchecktask().catch(console.error);
}, interval * 60 * 1000);