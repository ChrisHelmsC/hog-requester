# HSOG-requester

## 2 TIME GRAND PRIZE WINNER OF THE GOLEM GITCOIN GR9 HACKATHON (Open track, Gaming on Golem) https://gitcoin.co/hackathon/gr9/?org=golemfactory


**Associated Provider Project** https://github.com/ChrisHelmsC/HearthStoneSimulationsOnGolem

**Related Presentation** https://drive.google.com/file/d/1ValDiXT4MLZl6B-lbtOmVHOzWXfj8oWR/view?usp=sharing

**Related Video** https://www.youtube.com/watch?v=b650X3D7P1k

NOTICE: This is a hackathon project and the quality of code is not guaranteed. Please do not judge anything for being messy, gross, heinous, ridiculous, ineffecient, convoluted, of poor quality, poorly designed, noobish, hackey, or downright disgusting. Everything in this project was written in a small amount of time and with little to no planning.

### Table of Contents
* Introduction
* Setup
* Infile Definition
* Output

### Introduction
**This project is designed to be run on the Golem Network (https://www.golem.network) as a requestor. It is intended to manage multiple instances of the HearthStoneSimulationsOnGolem provider image, located at https://github.com/ChrisHelmsC/HearthStoneSimulationsOnGolem.**

This project is designed to help the HearthStone community in the design and building of decks. Users can provide a specific deck build and strategy to the application, and HearthStoneOnGolem is designed to run a large number of simulated games using that data. The results of each simulation will collected and combined into a single stat sheet that provides valuable information on the deck's performance and results. The deck can then be tweaked and then run again, until the desired result is produced.

Some development knowledge is required to use the application in its current state, as no front-end has been built and modifications may require code level changes.

### Setup
* Clone the project and install related dependencies using `npm install` from within the project directoy.
* Make any desired modifications to the code (if desired) and build the project using `npm run build`. Note that this will create a `dist/input` folder that is required for the application to work.
* Place an InFile in the `dist/input` folder containing the deck composition and strategy you want to use when running your simulations. The file should specifically be named `in.file.json`. An InFile example has been provided in the root folder of the project, named `example.in.file.json`. This can be used directly if you rename it and move it to the correct location.
* Once everything is in place, run the application using `node ./dist/index.js`. Note that you must have everything set up to be running as a Golem requestor, instructions for which can be found here: https://handbook.golem.network/introduction/requestor.
* The application will run and product output in the `dist/logging/output` directory. More can be read about this output in the "Output" section of this guide.

### Infile Definition
The infile is used to define the data that will be used to run the simulations. InFiles are defined based on an interface in /src/util/in.file.ts. An example infile example.in.file.json has also been included in the root directory. At the time of writing, an infile should contain:

Definitions of data for two players:
* An array of card names in order that will represent the player's deck. These card names should match the card class names defined in the provider project located at https://github.com/ChrisHelmsC/HearthStoneSimulationsOnGolem.
* The strategy class name to use when playing these cards. Strategies determine the logic that is used when running simulations with a particular deck. Strategies can be simple or extremely complex. For best results, a strategy should be catered to your chosen deck composition. Two example strategies (SimpleStrategy and DumbStrategy) are built into the project as examples. Strategy definition takes place on the provider side, check out the provider project for more info on defining your own: https://github.com/ChrisHelmsC/HearthStoneSimulationsOnGolem

### Output
The application output includes the following for each simulation run:
* An output log detailing moves made and the steps used to play each game. These located in `dist/logging/output/logs`.
* A statistical output detailing data collected from the game. These are located in `dist/logging/output/gamestats`.

Once all simulations have been run, the applications combines all of the statistical outputs into one aggregated output. This aggregated outut provides a look at overall stats and performance of the decks and strategies used within the infile. This is located at `dist/logging/output/fullreport` and should be the first thing you check when the application is finished running.

**Note:** The FullReport outputs statistics in a [min, mean, max] format, which are computed from the data points collected over all of the simulations run.
