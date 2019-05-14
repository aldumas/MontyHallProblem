import { MontyHallProblem } from './MontyHallProblem.js';

let contestant = {
    requestFirstGuess: function (game) {
        let door = 2;
        console.log("First guess requested");
        console.log("X".repeat(game.doorCount));
        console.log("Guessing " + door);

        // in reality, this callback would set up the DOM to show we are ready for the first guess
        // and would set up a callback to listen for the guess. That callback would call game.guess().
        setTimeout(() => {
            game.guess(door);
        }, 0);
    },
    requestSecondGuess: function (game, goat_door) {
        let door = 2;
        console.log("Second guess requested");
        let doors = [];
        for (let i = 0; i < game.doorCount; ++i) {
            if (i == door) {
                doors.push("?");
            } else if (i == goat_door) {
                doors.push("G");
            } else {
                doors.push("X");
            }
        }
        console.log(doors.join(''));
        console.log("Guessing " + door);
        // same note as above

        setTimeout(() => {
            game.guess(door);
        }, 0);
    },
    announceGameOver: function (game, didContestantWin) {
        if (didContestantWin) {
            console.log('You won!');
        } else {
            console.log('You lost!');
            console.log('Prize door: ' + game.doorWithPrize);
        }
    }
};

var game = new MontyHallProblem(contestant);
console.log("--- STARTING GAME ---");
game.startGame();