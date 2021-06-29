/**
 * Use for measuring the passage of time in milliseconds. Very similar to C#'s stopwatch (basically a ripoff).
 */
 export default class Stopwatch {
    // why is this not called startTime?: because of the paused state. see start()
    private earlyTime: Date = null;
    private stopTime: Date = null;

    // this class can be in 3 states:
    // reset:
    //   earlyTime === null
    //   stopTime === anything
    //
    // running:
    //   earlyTime !== null
    //   stopTime === null
    //
    // paused:
    //   earlyTime !== null
    //   stopTime !== null

    /**
     * Starts the stopwatch.
     */
    readonly start = (): void => {
        if (this.earlyTime === null) {
            //currently reset
            this.earlyTime = new Date();
        } else if (this.stopTime !== null) {
            // currently paused

            // Add the time in the paused state to earlyTime so the time in the paused state is not counted later.
            // This part is why earlyTime is not called startTime, since the startTime would drift forward from the actual startTime.
            this.earlyTime = new Date(
                this.earlyTime.getTime() + this.elapsedWhilePausedInMilliseconds
            );
        }
        this.stopTime = null;
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
        this.earlyTime = null;
        this.stopTime = null;
    }

    /**
     * Resets, then starts the stopwatch
     */
    readonly restart = (): void => {
        this.earlyTime = new Date();
        this.stopTime = null;
    }

    /**
     * Whether the stopwatch has been reset, and therefore, no time has elapsed.
     */
    get isReset(): boolean {
        return this.earlyTime === null;
    }

    /**
     * Whether the stopwatch is not paused or reset. If it's running.
     */
    get isRunning(): boolean {
        return this.stopTime !== null && !this.isReset;
    }

    /**
     * Whether the stopwatch has been paused by the stop method. returns false if the stopwatch has been reset, as long as it hasn't been started yet.
     */
    get isPaused(): boolean {
        return this.earlyTime !== null && this.stopTime !== null;
    }

    /**
     * Time since the stopwatch was started or restarted minus any time in which it was paused.
     */
    get elapsedTimeInMilliseconds(): number {
        if (this.earlyTime === null) {
            // currently reset
            return 0;
        } else if (this.stopTime === null) {
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
        if (this.earlyTime !== null && this.stopTime !== null) {
            return new Date().getTime() - this.stopTime.getTime();
        } else {
            return 0;
        }
    }

    // this is where get elapsedTime would be if javascript had a timeInterval class. Date could be a substitute, but that doesn't really make sense.
};
