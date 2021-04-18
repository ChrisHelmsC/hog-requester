import path from "path";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Executor, Task, utils, vm, WorkContext } from "yajsapi";
import { InFileLayout } from "./util/in.file";
import { GameData } from "./logging/game.data";
import { fstat, readdirSync, readFileSync, writeFileSync } from "fs";
import { LogGenerator } from "./logging/log.generator";

dayjs.extend(duration);

const { asyncWith, logUtils } = utils;

//Temporary shuffle while decks are made locally
function shuffle(array: Array<string>) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Create example infile
let infileContents: InFileLayout = {
  player1: {
    deck: ["AcidicSwampOoze", "EmeraldSkytalon", "BlazingBattlemage", "VoodooDoctor", "BloodfenRaptor",
      "BluegillWarrior", "KoboldGeomancer", "MurlocRaider", "StoneTuskBoar", "Wisp",
      "GurubashiBerserker", "ChillwindYeti", "LootHoarder"],
    strategy: "DEFAULT"
  },

  player2: {
    deck: ["AcidicSwampOoze", "EmeraldSkytalon", "BlazingBattlemage", "VoodooDoctor", "BloodfenRaptor",
      "BluegillWarrior", "KoboldGeomancer", "MurlocRaider", "StoneTuskBoar", "Wisp",
      "GurubashiBerserker", "ChillwindYeti", "LootHoarder"],
    strategy: "DEFAULT"
  },
  game: 0
}

async function main() {


  const _package = await vm.repo({
    image_hash: "4f07bcedd4c5cdda86c4265ee2e316cc3062f973b59edc191f8a4ece",
    min_mem_gib: 2.0,
    min_storage_gib: 2.0,
  });

  //Array for storing successfully retrieved filed
  const gameDataArray: GameData[] = [];

  async function* worker(ctx: WorkContext, tasks: any) {
    for await (let task of tasks) {
      ctx.send_json("/golem/input/in.file.json", task.data());

      ctx.run("/bin/sh", [
        "-c",
        "node /usr/src/app/dist/index.js > /golem/output/outfile",
      ]);

      //Get Logging Output
      const outputFile = '/golem/output/outfile';
      ctx.download_file(
        outputFile,
        LogGenerator.getLogFileName(task.data().game)
      );

      //Get game stats output, add to downloaded array
      const gameStatsProviderOutput = '/golem/output/gamestats.json';
      ctx.download_file(
        gameStatsProviderOutput,
        LogGenerator.getStatsFileName(task.data().game)
      );

      yield ctx.commit({ timeout: dayjs.duration({ seconds: 500 }).asMilliseconds() });
      // TODO: Check
      // job results are valid // and reject by:
      // task.reject_task(msg = 'invalid file')
      task.accept_result(outputFile);
    }

    ctx.log("All games have completed");
    return;
  }

  //Clear out all output file folders before running
  LogGenerator.createFoldersAndClearReports();

  let games: InFileLayout[] = [];
  for (let i = 0; i < 5; i++) {
    games[i] = {
      player1: {
        deck: shuffle(infileContents.player1.deck).slice(),
        strategy: "DEFAULT"
      },

      player2: {
        deck: shuffle(infileContents.player2.deck).slice(),
        strategy: "DEFAULT"
      },
      game: i
    }
  }

  const timeout: number = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    new Executor({
      task_package: _package,
      max_workers: 20,
      timeout: timeout,
      budget: ".5",
      subnet_tag: "devnet-beta.1",
      driver: "zksync",
      network: "rinkeby",
      event_consumer: logUtils.logSummary(),
    }),
    async (executor: Executor): Promise<void> => {
      for await (let task of executor.submit(
        worker,
        games.map((game: any) => new Task(game))
      )) {
        console.log("result=", task.result());
      }
    }
  );

  //Get contents of files containing stats
  const outputDir = LogGenerator.GAME_STATS_OUTPUT;
  readdirSync(outputDir).forEach(file => {
    //Store downloaded file data in array for later reference, TODO add a try/catch here
    const gameDataContents: GameData = JSON.parse(readFileSync(outputDir + file, 'utf-8'));
    gameDataArray.push(gameDataContents)
  })

  //Create report with downloaded data
  const report = new LogGenerator(gameDataArray).writeReport();
  
}

main()