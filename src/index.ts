// imports
import * as erlc from "erlc";
import * as dotenv from "dotenv";
import { Logger } from "tslog"; 
const dbhelper = require("./dbhelper");

// post-imports
dotenv.config()

// vars
let players: number[]
const token = process.env.tkn as string

const debug_pre = process.env.debug as string;
var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { const debug = true } else { const debug = false };


const log = new Logger();

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

const SPtoP = (SP: erlc.ServerPlayer): Player => {
	if (debug) {log.info("hello from SPtoP")}
	let name = "" as string;
	let id = 0 as number;

	name = SP.Player.split(":")[0] as string
	id = parseInt(SP.Player.split(":")[1]) as number

	const playerobj = {name: name, id: id} as Player;
	return playerobj;
};

const massSPtoP = (SPs: erlc.ServerPlayer[]): Player[] => {
	if (debug) {log.info("hello from massSPtoP")};

	var temp: Player[] = [];

	if (debug) {log.debug(["massSPtoP vars & args", SPs, temp])};

	SPs.forEach(item => {
		temp.push(SPtoP(item));
	});
	return temp;
};

const getPlayers = async (): Promise<erlc.ServerPlayer[]> => {
	if (debug) {log.info("hello from getPlayers")};
	return await erlc.getPlayers(token);
};

log.info("checking db file");
dbhelper.checkdbfile();

log.info("creating task")
async function playerchecktask(): Promise<void> {
	// get players in game

	// log them
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

playerchecktask()
setInterval(() => {
  playerchecktask().catch(console.error);
}, interval * 60 * 1000);