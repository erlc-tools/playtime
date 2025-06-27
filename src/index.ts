import * as erlc from "erlc";
import * as dotenv from "dotenv";
dotenv.config()
let players: number[]
const token = process.env.tkn as string


const client = new erlc.Client({
	globalToken: process.env.tkn as string
})
client.config() // save options


const getPlayers = async () => {
	const atlast = () => {
		console.log("sigma")
	}
	const res = await erlc.getPlayers(token).catch(console.log)
	return res
}

