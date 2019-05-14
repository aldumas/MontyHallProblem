import * as fsm from 'fsmjs/src/fsm';

const DOOR_COUNT = 3;

export class MontyHallProblem {
    constructor(contestant, fnRandom) {
        this._contestant = contestant;
        this._fnRandom = fnRandom || function (n) {
            return Math.floor(Math.random() * n);
        };

        this._initialChoiceDoor = null;
        this._finalChoiceDoor = null;
        this._revealedGoatDoor = null;
        this._prizeDoor = this._fnRandom(DOOR_COUNT); //0-based

        this._fsm = fsm.createMachine({
            spec: {
                START: {
                    entry: () => { this._contestant.requestFirstGuess(this); },
                    transitions: {
                        guess: {
                            nextState: "HAVE_INITIAL_GUESS",
                            action: (pass, initialChoiceDoor) => {
                                this._initialChoiceDoor = initialChoiceDoor;
                                this._revealedGoatDoor = this._findAGoatDoor();
                                this._contestant.requestSecondGuess(this, this._revealedGoatDoor, this._initialChoiceDoor);
                            }
                        }
                    }
                },
                HAVE_INITIAL_GUESS: {
                    transitions: {
                        guess: {
                            nextState: "END",
                            action: (pass, finalChoiceDoor) => {
                                this._finalChoiceDoor = finalChoiceDoor;
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
        return this._prizeDoor;
    }

    get isGameFinished() {
        return this._isGameFinished;
    }

    get didContestantWin() {
        return this.isGameFinished && this._finalChoiceDoor == this._prizeDoor;
    }

    _findAGoatDoor() {
        let goatDoors = [];
        for (let i = 0; i < this.doorCount; ++i) {
            if (i != this.doorWithPrize && i != this._initialChoiceDoor) {
                goatDoors.push(i);
            }
        }
        return goatDoors[this._fnRandom(goatDoors.length)];
    }
}
