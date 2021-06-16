export default class StopWatch {
    startTime?: Date;
    stopTime?: Date;

    start(): void {
        if (this.startTime === undefined) {
            this.startTime = new Date();
        }
        this.stopTime = undefined;
    }
    stop(): void {
        this.stopTime = new Date();
    }
    reset(): void {
        this.startTime = undefined;
        this.stopTime = undefined;
    }
    restart(): void {
        this.reset();
        this.start();
    }
    get isReset() {
        return this.startTime === undefined;
    }
    get isRunning() {
        return this.stopTime !== undefined && !this.isReset;
    }
    get elapsedTimeInMilliseconds(): number {
        if (this.startTime === undefined) {
            return 0;
        } else if (this.stopTime === undefined) {
            return new Date().getTime() - this.startTime.getTime();
        } else {
            return this.stopTime.getTime() - this.startTime.getTime();
        }
    }
};
