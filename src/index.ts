require('dotenv').config()

const erlc = require('erlc')
const client = new erlc.Client({
	globalToken: process.env.tkn
})
client.config() // save options


