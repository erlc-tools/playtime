import * as fs from "fs";
import { Logger } from "tslog"; 
import * as dotenv from "dotenv";
const Datastore = require("nedb-promises"); // i fucking hate require

dotenv.config();
const debug_pre = process.env.debug as string;
var debug = false as boolean; // fuck compiler errors
if (debug_pre == "true") { const debug = true } else { const debug = false };


const log = new Logger();