import { Player, debug, log} from ".";
import * as erlc from "erlc";

export function massPtoID(Ps: Player[]): number[] {
    let results = [] as number[]
    Ps.forEach((item: Player) => {
        results.push(item.id)
    });
    return results;
}

export function SPtoP(SP: erlc.ServerPlayer): Player {
    if (debug) {log.info("hello from SPtoP")}
    let name = "" as string;
    let id = 0 as number;

    name = SP.Player.split(":")[0] as string
    id = parseInt(SP.Player.split(":")[1]) as number

    const playerobj = {name: name, id: id} as Player;
    return playerobj;
};

export function massSPtoP(SPs: erlc.ServerPlayer[]): Player[] {
    if (debug) {log.info("hello from massSPtoP")};

    var temp: Player[] = [];

    if (debug) {log.debug(["massSPtoP vars & args", SPs, temp])};

    SPs.forEach(item => {
        temp.push(SPtoP(item));
    });
    return temp;
};