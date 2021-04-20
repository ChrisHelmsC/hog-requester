import { PlayerStats } from "./player.stats";

export class GameData {
    static readonly TIE = "TIE";

    playerStats : {[ key :string] : PlayerStats};
    turnsPlayed : number;
    winningPlayer : string;

    constructor() {
        this.playerStats = {};
        this.turnsPlayed = 0;
    }
}