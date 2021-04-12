import { GameData } from "./game.data";
import { GameReport, GameStats, PlayerGameReport } from "./game.report";

export class LogGenerator {
    gameDataSet : Array<GameData>
    gameReport : GameReport; 

    //User known player names from game project
    readonly playerOneName = 'PlayerOne';
    readonly playerTwoName = 'PlayerTwo';
    readonly TIE = 'TIE';

    constructor(gameDataSet : Array<GameData>) {
        this.gameDataSet = gameDataSet;
        this.gameReport = new GameReport([this.playerOneName, this.playerTwoName]);
    }

    //Create data report from gethered data
    public createReport() {
        //Access to players specific reports
        const playerOneReport = this.gameReport.playerGameReports[this.playerOneName];
        const playerTwoReport = this.gameReport.playerGameReports[this.playerTwoName];

        //Set number of games played
        this.gameReport.gameStats.gamesPlayed = this.gameDataSet.length;

        //Iterate through game datas to gather stats
        this.gameDataSet.forEach((singleSet, index) => {
            //Get handle on stats for each player
            const playerOneStats = singleSet.playerStats[this.playerOneName];
            const playerTwoStats = singleSet.playerStats[this.playerTwoName]

            //Calculate turns
            this.calcStats(singleSet.turnsPlayed, this.gameReport.gameStats.turnsPlayed ,index)

            //Calculate win percentages
            if(singleSet.winningPlayer != this.TIE) {
                this.gameReport.playerGameReports[singleSet.winningPlayer].wins++;
            }

            this.calcStats(playerOneStats.cardsNaturallyDrawn, playerOneReport.cardsNaturallyDrawn, index);
            this.calcStats(playerTwoStats.cardsNaturallyDrawn, playerTwoReport.cardsNaturallyDrawn, index);

            this.calcStats(playerOneStats.cardsForceDrawn, playerOneReport.cardsForceDrawn, index);
            this.calcStats(playerTwoStats.cardsForceDrawn, playerTwoReport.cardsForceDrawn, index);

            this.calcStats(playerOneStats.cardsDiscarded, playerOneReport.cardsDiscarded, index);
            this.calcStats(playerTwoStats.cardsDiscarded, playerTwoReport.cardsDiscarded, index);

            this.calcStats(playerOneStats.cardsPlayed, playerOneReport.cardsPlayed, index);
            this.calcStats(playerTwoStats.cardsPlayed, playerTwoReport.cardsPlayed, index);

            this.calcStats(playerOneStats.monstersPlayed, playerOneReport.monstersPlayed, index);
            this.calcStats(playerTwoStats.monstersPlayed, playerTwoReport.monstersPlayed, index);

            this.calcStats(playerOneStats.monstersLost, playerOneReport.monstersLost, index);
            this.calcStats(playerTwoStats.monstersLost, playerTwoReport.monstersLost, index);

            this.calcStats(playerOneStats.monsterDamageDone, playerOneReport.monsterDamageDone, index);
            this.calcStats(playerTwoStats.monsterDamageDone, playerTwoReport.monsterDamageDone, index);

            this.calcStats(playerOneStats.monsterDamageTaken, playerOneReport.monsterDamageTaken, index);
            this.calcStats(playerTwoStats.monsterDamageTaken, playerTwoReport.monsterDamageTaken, index);

            this.calcStats(playerOneStats.heroHealing, playerOneReport.heroHealing, index);
            this.calcStats(playerTwoStats.heroHealing, playerTwoReport.heroHealing, index);
            
            this.calcStats(playerOneStats.heroDamageTaken, playerOneReport.heroDamageTaken, index);
            this.calcStats(playerTwoStats.heroDamageTaken, playerTwoReport.heroDamageTaken, index);

            this.calcStats(playerOneStats.fatigueDamageTaken, playerOneReport.fatugueDamageTaken, index);
            this.calcStats(playerTwoStats.fatigueDamageTaken, playerTwoReport.fatugueDamageTaken, index);

            this.calcStats(playerOneStats.manaAvailable, playerOneReport.manaAvailable, index);
            this.calcStats(playerTwoStats.manaAvailable, playerTwoReport.manaAvailable, index);

            this.calcStats(playerOneStats.manaUsed, playerOneReport.manaUsed, index);
            this.calcStats(playerTwoStats.manaUsed, playerTwoReport.manaUsed, index);
        })

        //Calculate win percentages
        this.gameReport.gameStats.p1WinPercentage = this.gameReport.playerGameReports[this.playerOneName].wins / this.gameReport.gameStats.gamesPlayed;
        this.gameReport.gameStats.p2WinPercentage = this.gameReport.playerGameReports[this.playerTwoName].wins / this.gameReport.gameStats.gamesPlayed;
        this.gameReport.gameStats.tiePercent = 1 - this.gameReport.gameStats.p1WinPercentage - this.gameReport.gameStats.p2WinPercentage;

        return this.gameReport;
    }

    //Create stats for a specific player
    private calcStats(setValue : number, gameReportStat : Array<number>, position : number) {
        //Calc min
        gameReportStat[PlayerGameReport.MIN] = Math.min(gameReportStat[PlayerGameReport.MIN], setValue);

        //Calc avg
        const total = gameReportStat[PlayerGameReport.AVG] * position + setValue;
        const divisor = position + 1;
        gameReportStat[PlayerGameReport.AVG] = total / divisor;

        //Calc max
        gameReportStat[PlayerGameReport.MAX] = Math.max(gameReportStat[PlayerGameReport.MAX], setValue);
    }
}