const performance = typeof window === "undefined" ? ((from) => require(from))("perf_hooks").performance : window.performance;

/**
 * Use for measuring the passage of time in milliseconds. Very similar to C#'s stopwatch (basically a ripoff).
 */
 export class Stopwatch {
    // why is this not called startTime? because of the paused state. see start()
    private earlyTime?: number = undefined;
    private stopTime?: number = undefined;

    // this class can be in 3 states:
    // reset:
    //   earlyTime == undefined
    //   stopTime === anything
    //
    // running:
    //   earlyTime != undefined
    //   stopTime == undefined
    //
    // paused:
    //   earlyTime != undefined
    //   stopTime != undefined

    /**
     * Starts the stopwatch.
     */
    readonly start = (): void => {
        if (this.earlyTime == undefined) {
            //currently reset
            this.earlyTime = performance.now();
        } else if (this.stopTime != undefined) {
            // currently paused

            // Add the time in the paused state to earlyTime so the time in the paused state is not counted later.
            // This part is why earlyTime is not called startTime, since startTime would drift forward from the actual startTime.
            this.earlyTime += this.elapsedWhilePausedInMilliseconds;
        }
        this.stopTime = undefined;
    };

    /**
     * Pauses the stopwatch
     */
    readonly stop = (): void => {
        this.stopTime = performance.now();
    };

    /**
     * Resets the stopwatch
     */
    readonly reset = (): void => {
        this.earlyTime = undefined;
        this.stopTime = undefined;
    };

    /**
     * Resets, then starts the stopwatch
     */
    readonly restart = (): void => {
        this.earlyTime = performance.now();
        this.stopTime = undefined;
    };

    /**
     * Whether the stopwatch has been reset, and therefore, no time has elapsed.
     */
    get isReset(): boolean {
        return this.earlyTime == undefined;
    }

    /**
     * Whether the stopwatch is not paused or reset. If it's running.
     */
    get isRunning(): boolean {
        return this.earlyTime != undefined && this.stopTime == undefined;
    }

    /**
     * Whether the stopwatch has been paused by the stop method. returns false if the stopwatch has been reset, as long as it hasn't been started yet.
     */
    get isPaused(): boolean {
        return this.earlyTime != undefined && this.stopTime != undefined;
    }

    /**
     * Time since the stopwatch was started or restarted minus any time in which it was paused.
     */
    get elapsedTimeInMilliseconds(): number {
        if (this.earlyTime == undefined) {
            // currently reset
            return 0;
        } else if (this.stopTime == undefined) {
            //currently running
            return performance.now() - this.earlyTime;
        } else {
            // currently paused
            return this.stopTime - this.earlyTime;
        }
    }

    /**
     * If the stopwatch is paused, returns how long it has been paused.
     */
    get elapsedWhilePausedInMilliseconds(): number {
        if (this.earlyTime != undefined && this.stopTime != undefined) {
            return performance.now() - this.stopTime;
        } else {
            return 0;
        }
    }

    // this is where get elapsedTime would be if javascript had a timeInterval class. Date could be a substitute, but that doesn't really make sense.
}
