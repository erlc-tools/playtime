import { Client } from "erlc";
import * as dotenv from "dotenv";
dotenv.config()

const client = new Client({
	globalToken: process.env.tkn as string
})
client.config() // save options


