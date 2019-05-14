import * as fsm from 'fsmjs/src/fsm';

const DOOR_COUNT = 3;

export class MontyHallProblem {
    constructor(contestant, func_random) {
        this._contestant = contestant;
        this._func_random = func_random || function (n) {
            return Math.floor(Math.random() * n);
        };

        this._initial_choice_door = null;
        this._final_choice_door = null;
        this._revealed_goat_door = null;
        this._prize_door = this._func_random(DOOR_COUNT); //0-based

        this._fsm = fsm.createMachine({
            spec: {
                START: {
                    entry: () => { this._contestant.requestFirstGuess(this); },
                    transitions: {
                        guess: {
                            nextState: "HAVE_INITIAL_GUESS",
                            action: (pass, initial_choice_door) => {
                                this._initial_choice_door = initial_choice_door;
                                this._revealed_goat_door = this._findAGoatDoor();
                                this._contestant.requestSecondGuess(this, this._revealed_goat_door, this._initial_choice_door);
                            }
                        }
                    }
                },
                HAVE_INITIAL_GUESS: {
                    transitions: {
                        guess: {
                            nextState: "END",
                            action: (pass, final_choice_door) => {
                                this._final_choice_door = final_choice_door;
                            }
                        }
                    }
                },
                END: {
                    entry: () => {
                        this._isGameFinished = true;
                        this._contestant.announceGameOver(this, this.didContestantWin);
                    }
                }
            }
        });
    }

    startGame() {
        this._isGameFinished = false;
        return this._fsm.queueStart();
    }

    guess(door) {
        return this._fsm.queueEvent('guess', door);
    }

    get doorCount() {
        return DOOR_COUNT;
    }

    get doorWithPrize() {
        return this._prize_door;
    }

    get isGameFinished() {
        return this._isGameFinished;
    }

    get didContestantWin() {
        return this.isGameFinished && this._final_choice_door == this._prize_door;
    }

    _findAGoatDoor() {
        let goat_doors = [];
        for (let i = 0; i < this.doorCount; ++i) {
            if (i != this.doorWithPrize && i != this._initial_choice_door) {
                goat_doors.push(i);
            }
        }
        return goat_doors[this._func_random(goat_doors.length)];
    }
}
