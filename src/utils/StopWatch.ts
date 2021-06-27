/**
 * Use for measuring passage of time in milliseconds. Very similar to C#'s stopwatch (basically a ripoff).
 */
 export default class Stopwatch {
    private earlyTime?: Date = undefined;
    private stopTime?: Date = undefined;

    // this class can be in 3 states:
    // reset:
    //   earlyTime === undefined
    //   stopTime === anything
    //
    // running:
    //   earlyTime !== undefined
    //   stopTime === undefined
    //
    // paused:
    //   earlyTime !== undefined
    //   stopTime !== undefined

    /**
     * Starts the stopwatch.
     */
    readonly start = (): void => {
        if (this.earlyTime === undefined) {
            //currently reset
            this.earlyTime = new Date();
        } else if (this.stopTime !== undefined) {
            // currently paused

            // Add the time in the paused state to earlyTime so the time in the paused state is not counted later.
            // This part is why earlyTime is not called startTime
            this.earlyTime = new Date(
                this.earlyTime.getTime() + this.elapsedWhilePausedInMilliseconds
            );
        }
        this.stopTime = undefined;
    }

    /**
     * Pauses the stopwatch
     */
    readonly stop = (): void => {
        this.stopTime = new Date();
    }

    /**
     * Resets the stopwatch
     */
    readonly reset = (): void => {
        this.earlyTime = undefined;
        this.stopTime = undefined;
    }

    /**
     * Resets, then starts the stopwatch
     */
    readonly restart = (): void => {
        this.earlyTime = new Date();
        this.stopTime = undefined;
    }

    /**
     * Whether the stopwatch has been reset, and therefore, no time has elapsed.
     */
    get isReset(): boolean {
        return this.earlyTime === undefined;
    }

    /**
     * Whether the stopwatch is not paused or reset. If it's running.
     */
    get isRunning(): boolean {
        return this.stopTime !== undefined && !this.isReset;
    }

    /**
     * Whether the stopwatch has been paused by the stop method. returns false if the stopwatch has been reset, as long as it hasn't been started yet.
     */
    get isPaused(): boolean {
        return this.earlyTime !== undefined && this.stopTime !== undefined;
    }

    /**
     * Time since the stopwatch was started or restarted minus any time in which it was paused.
     */
    get elapsedTimeInMilliseconds(): number {
        if (this.earlyTime === undefined) {
            // currently reset
            return 0;
        } else if (this.stopTime === undefined) {
            //currently running
            return new Date().getTime() - this.earlyTime.getTime();
        } else {
            // currently paused
            return this.stopTime.getTime() - this.earlyTime.getTime();
        }
    }

    /**
     * If the stopwatch is paused, returns how long it has been paused.
     */
    get elapsedWhilePausedInMilliseconds(): number {
        if (this.earlyTime !== undefined && this.stopTime !== undefined) {
            return new Date().getTime() - this.stopTime.getTime();
        } else {
            return 0;
        }
    }

    // this is where get elapsedTime would be if javascript had a timeInterval class. Date could be a substitute, but that doesn't really make sense.
};
