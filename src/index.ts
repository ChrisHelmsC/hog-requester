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

async function main() {
  const _package = await vm.repo({
    image_hash: "e4530a3ff5ee4f6a2a841ec9194be5264e59d9a6666879290efa6aa6",
    min_mem_gib: 1.0,
    min_storage_gib: 1.0,
  });

  //Read in the input file, validate
  let infile : InFileLayout;
  try {
    infile = JSON.parse(readFileSync(__dirname + '/input/in.file.json', 'utf-8')) as InFileLayout;
  } catch(exception) {
    console.log("Unable to read the infile.");
    return;
  }

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
      
      // Ensure response is JSON TODO validate it correctly parses into infile (an interface)
      try {
        const contents: GameData = JSON.parse(readFileSync(LogGenerator.getStatsFileName(task.data().game), 'utf-8'));
        task.accept_result(outputFile);
      } catch (exception) {
        console.log(task.data().game + " was not valid JSON.");
      }
    }

    ctx.log("Game has completed.");
    return;
  }

  //Clear out all output file folders before running
  LogGenerator.createFoldersAndClearReports();


  //For each game to create, shuffle infile deck contents
  let games: InFileLayout[] = [];
  console.log('Number of simulations to run: ' + infile.numberOfGames);
  for (let i = 0; i < infile.numberOfGames; i++) {
    //Copy infile contents
    const infileVariation = JSON.parse(readFileSync(__dirname + '/input/in.file.json', 'utf-8')) as InFileLayout;

    //Shuffle decks
    infileVariation.player1.deck = shuffle(infileVariation.player1.deck).slice();
    infileVariation.player2.deck = shuffle(shuffle(infileVariation.player2.deck).slice())

    //Add game number to infile
    infileVariation.game = i;

    //Set game data to variation
    games[i] = infileVariation;
  }

  const timeout: number = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    new Executor({
      task_package: _package,
      max_workers: 30,
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
    try {
      const gameDataContents: GameData = JSON.parse(readFileSync(outputDir + file, 'utf-8'));
      gameDataArray.push(gameDataContents)
    } catch (exception) {
      console.log("JSON for file stats failed to parse for " + file);
      //TODO this should include golem file validation
    }
  })

  //Create report with downloaded data
  new LogGenerator(gameDataArray).writeReport();
}

main()