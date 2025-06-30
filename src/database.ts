// database module
import { readFile, writeFile } from 'fs/promises'; // writefile is sync to prevent writing multiple times at once
import { Logger, ILogObj } from "tslog";

export type DBinfo = {
    filepath: string,
    logger: Logger<ILogObj>,
    debug: boolean
}

async function _readfile(path: string): Promise<string> {
    return await readFile(path, 'utf-8');
}

async function _writefile(path: string, content: string): Promise<void> {
    await writeFile(path, content, 'utf-8');
}

async function _writejson(path: string, content: Record<number, number>): Promise<void> {
    await _writefile(path, JSON.stringify(content));
}

async function _getjson(path: string): Promise<Record<any, any> | undefined> {
    try {
        return JSON.parse(await _readfile(path));
    } catch {
        return undefined;
    }
}

export async function getFromID(i: DBinfo, uid: number): Promise<number | null> {
    const json = await _getjson(i.filepath);// who doesnt
    if (!json) return null;                 // fucking love
    return json[uid] ?? null;               // chat gpt
};

export async function writeToID(i: DBinfo, uid: number, newnum: number): Promise<void> {
    var old = await _getjson(i.filepath);
    if (!old) {
        i.logger.fatal("_getjson returned undefined in writeToID")
        process.exit(1)
    }
    old[uid] = newnum
    await _writejson(i.filepath, old)
}

