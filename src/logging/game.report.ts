
export class PlayerGameReport {
    static readonly MIN = 0;
    static readonly AVG = 1;
    static readonly MAX = 2;

    wins = 0;

    //Structure storing play stat details
    cardsNaturallyDrawn = [99, 0, 0];

    cardsForceDrawn = [99, 0 ,0]

    cardsDiscarded = [99, 0, 0];

    cardsPlayed = [99, 0 , 0]

    cardsReturnedToHand = [99, 0, 0]

    cardsAddedToDeck = [99, 0, 0]

    monstersPlayed = [99, 0, 0];

    monstersLost = [99, 0, 0];

    monsterDamageDone = [99, 0, 0];

    monsterDamageTaken = [99, 0, 0];

    heroHealing = [99, 0, 0];

    heroDamageTaken = [99, 0, 0];

    fatugueDamageTaken = [99,0,0]

    manaAvailable = [99, 0, 0];

    manaUsed = [99, 0, 0];
}

export class GameStats {
    gamesPlayed: number;
    turnsPlayed = [99, 0, 0];

    p1WinPercentage : number;
    p2WinPercentage : number;
    tiePercent : number;
}

export class GameReport {
    
    playerGameReports : {[ key :string] : PlayerGameReport}
    gameStats : GameStats;

    constructor(playerNames : Array<string>) {
        this.playerGameReports = {};
        this.gameStats = new GameStats();
        
        playerNames.forEach(name => {
            this.playerGameReports[name] = new PlayerGameReport();
        })
    }
}