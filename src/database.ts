// database module
import { readFile, writeFileSync } from 'fs'; // writefile is sync to prevent writing multiple times at once
import { Logger, ILogObj } from "tslog";

type DBinfo = {
    filepath: string,
    logger: Logger<ILogObj>,
    debug: boolean
}

export async function getFromID(i: DBinfo, uid: number): Promise<number | null> {
    return 1;
};

export async function writeToID(i: DBinfo, uid: number, newnum: number): Promise<void> {
    return;
}

export async function doesExist(i: DBinfo, uid: number): Promise<boolean> {
    return false;
}

