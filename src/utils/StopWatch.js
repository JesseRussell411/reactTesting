"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StopWatch = /** @class */ (function () {
    function StopWatch() {
    }
    StopWatch.prototype.start = function () {
        if (this.startTime === undefined) {
            this.startTime = new Date();
        }
        this.stopTime = undefined;
    };
    StopWatch.prototype.stop = function () {
        this.stopTime = new Date();
    };
    StopWatch.prototype.reset = function () {
        this.startTime = undefined;
        this.stopTime = undefined;
    };
    StopWatch.prototype.restart = function () {
        this.reset();
        this.start();
    };
    Object.defineProperty(StopWatch.prototype, "isReset", {
        get: function () {
            return this.startTime === undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StopWatch.prototype, "isRunning", {
        get: function () {
            return this.stopTime !== undefined && !this.isReset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StopWatch.prototype, "elapsedTimeInMilliseconds", {
        get: function () {
            if (this.startTime === undefined) {
                return 0;
            }
            else if (this.stopTime === undefined) {
                return new Date().getTime() - this.startTime.getTime();
            }
            else {
                return this.stopTime.getTime() - this.startTime.getTime();
            }
        },
        enumerable: false,
        configurable: true
    });
    return StopWatch;
}());
exports.default = StopWatch;
;
