const performance = typeof window === "undefined" ? ((from) => require(from))("perf_hooks").performance : window.performance;
/**
 * Use for measuring the passage of time in milliseconds. Very similar to C#'s stopwatch (basically a ripoff).
 */
export class Stopwatch {
    constructor() {
        // why is this not called startTime? because of the paused state. see start()
        this.earlyTime = undefined;
        this.stopTime = undefined;
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
        this.start = () => {
            if (this.earlyTime == undefined) {
                //currently reset
                this.earlyTime = performance.now();
            }
            else if (this.stopTimed != undefined) {
                // currently paused
                // Add the time in the paused state to earlyTime so the time in the paused state is not counted later.
                // This part is why earlyTime is not called startTime, since startTime would drift forward from the actual startTime.
                this.earlyTime += this.elapsedWhilePausedInMilliseconds;
            }
            this.stopTimed = undefined;
        };
        /**
         * Pauses the stopwatch
         */
        this.stop = () => {
            this.stopTimed = performance.now();
        };
        /**
         * Resets the stopwatch
         */
        this.reset = () => {
            this.earlyTime = undefined;
            this.stopTimed = undefined;
        };
        /**
         * Resets, then starts the stopwatch
         */
        this.restart = () => {
            this.earlyTime = performance.now();
            this.stopTimed = undefined;
        };
        // this is where get elapsedTime would be if javascript had a timeInterval class. Date could be a substitute, but that doesn't really make sense.
    }
    /**
     * Whether the stopwatch has been reset, and therefore, no time has elapsed.
     */
    get isReset() {
        return this.earlyTime == undefined;
    }
    /**
     * Whether the stopwatch is not paused or reset. If it's running.
     */
    get isRunning() {
        return this.earlyTime != undefined && this.stopTimed == undefined;
    }
    /**
     * Whether the stopwatch has been paused by the stop method. returns false if the stopwatch has been reset, as long as it hasn't been started yet.
     */
    get isPaused() {
        return this.earlyTime != undefined && this.stopTimed != undefined;
    }
    /**
     * Time since the stopwatch was started or restarted minus any time in which it was paused.
     */
    get elapsedTimeInMilliseconds() {
        if (this.earlyTime == undefined) {
            // currently reset
            return 0;
        }
        else if (this.stopTimed == undefined) {
            //currently running
            return performance.now() - this.earlyTime;
        }
        else {
            // currently paused
            return this.stopTimed - this.earlyTime;
        }
    }
    /**
     * If the stopwatch is paused, returns how long it has been paused.
     */
    get elapsedWhilePausedInMilliseconds() {
        if (this.earlyTime != undefined && this.stopTimed != undefined) {
            return performance.now() - this.stopTimed;
        }
        else {
            return 0;
        }
    }
}
