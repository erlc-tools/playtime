// imports
import * as erlc from "erlc";
import * as dotenv from "dotenv";
import { Logger } from "tslog"; 

// post-imports
dotenv.config()

// vars
let players: number[]
const token = process.env.tkn as string

const debug = process.env.debug; // DEBUG

const log = new Logger();


const client = new erlc.Client({
	globalToken: process.env.ratelimit as string
});
client.config(); // save options

if (debug) {
	log.info(["tkn passed in=", token])
}


type Player = {
	name: string,
	id: number
}

const SPtoP = (SP: erlc.ServerPlayer): Player => {
	if (debug) {log.info("hello from SPtoP")}
	let name = "" as string;
	let id = 0 as number;

	name = SP.Player.split(":")[0] as string
	id = parseInt(SP.Player.split(":")[0]) as number

	const playerobj = {name: name, id: id} as Player;
	return playerobj;
};

const massSPtoP = (SPs: erlc.ServerPlayer[]): Player[] => {
	if (debug) {log.info("hello from massSPtoP")}
	let temp: Player[] = [];
	SPs.forEach(item => {
		temp.push(SPtoP(item));
	});
	return temp;
};

const getPlayers = async (): Promise<erlc.ServerPlayer[]> => {
	if (debug) {log.info("hello from getPlayers")}
	return await erlc.getPlayers(token);
};


log.info("getting players")
getPlayers().then((res: erlc.ServerPlayer[]) => {
	console.log(massSPtoP(res));
})