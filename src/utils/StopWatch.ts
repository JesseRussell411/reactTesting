// to help address the different implementation of performance.now between browser and node.

/** @returns A timestamp measured in milliseconds. */
const now = () => window.performance.now();

/**
 * Measures the passage of time by mimicking a physical stopwatch.
 */
export default class Stopwatch {
    /** what to subtract from either now() or stopTime to get the elapsed time. Should be equal to the time the stopwatch
     * was last reset PLUS the time in which it was paused. */
    private earlyTime: number = 0;
    /** When the stopwatch was last stopped. This value can be arbitrary while in the running state. */
    private stopTime: number = 0;

    /** Whether the stopwatch is running. If it where clockwork, it'd be making a ticking noise while this was true. */
    private _running: boolean = false;

    /** Whether the stopwatch is running. */
    public get running() {
        return this._running;
    }

    /** Whether the stopwatch is not running. */
    public get stopped() {
        return !this._running;
    }

    /** Starts the stopwatch */
    public readonly start = () => {
        if (!this._running) {
            // Add time in paused state to earlyTime
            // so that it's not counted as elapsedTime.
            this.earlyTime += now() - this.stopTime;
            this._running = true;
        }
    };

    /** Stops the stopwatch */
    public readonly stop = () => {
        if (this._running) {
            this.stopTime = now();
            this._running = false;
        }
    };

    /**
     * Toggles whether the stopwatch is running.
     * @return Whether the stopwatch is running now.
     */
    public readonly startStop = (): boolean => {
        if (this._running) {
            this.stopTime = now();
            return (this._running = false);
        } else {
            this.earlyTime += now() - this.stopTime;
            return (this._running = true);
        }
    };

    /** Stops the stopwatch and resets the elapsed time. */
    public readonly reset = () => {
        this.earlyTime = now();
        this.stopTime = this.earlyTime;
        this._running = false;
    };

    /** Resets and then starts the stopwatch. */
    public readonly restart = () => {
        this.earlyTime = now();
        this._running = true;
    };

    /** How long the stopwatch has been running. */
    public get elapsedTimeInMilliseconds() {
        if (this._running) {
            return now() - this.earlyTime;
        } else {
            return this.stopTime - this.earlyTime;
        }
    }
}
