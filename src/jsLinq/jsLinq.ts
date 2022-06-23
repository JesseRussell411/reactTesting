export class Linqable<T> implements Iterable<T> {
    constructor(iterable?: Iterable<T>) {
        this.iterable = iterable ?? {
            // eslint-disable-next-line require-yield
            [Symbol.iterator]: function* () {
                return;
            }
        }
    }

    public readonly iterable: Iterable<T>;

    public [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]();
    }

    public map<R>(callback: (item: T, index: number) => R): Linqable<R> {
        const self = this;
        return new Linqable<R>({
            [Symbol.iterator]: function* () {
                let index = 0;
                for (const item of self.iterable) {
                    yield callback(item, index++);
                }
            }
        });
    }

    public forEach(callback: (item: T, index: number) => void): Linqable<T> {
        const self = this;
        let index = 0;
        for (const item of self.iterable) {
            callback(item, index++);
        }

        return this;
    }

    public reduce<R>(callback: (previousResult: R, currentItem: T, index: number) => R, initialValue?: R): R {
        let result = initialValue;
        let index = 0;
        for (const item of this.iterable) {
            result = callback(result, item, index++);
        }
        return result;
    }

    public filter(callback: (item: T, index: number) => boolean): Linqable<T> {
        const self = this;
        return new Linqable<T>({
            [Symbol.iterator]: function* () {
                let index = 0;
                for (const item of self.iterable) {
                    if (callback(item, index++)) yield item;
                }
            }
        });
    }

    public sort(comparator?: (a: T, b: T) => number): Linqable<T> {
        // TODO there's probably some efficient algorithm for this
        const array = [...this];
        array.sort(comparator);
        return new Linqable<T>(array);
    }

    public concat(other: Iterable<T>): Linqable<T> {
        const self = this;
        return new Linqable<T>({
            [Symbol.iterator]: function* () {
                for (const item of self) {
                    yield item;
                }
                for (const item of other) {
                    yield item;
                }
            }
        });
    }

    public reverse(): Linqable<T> {
        const array = [...this];
        return new Linqable<T>({
            [Symbol.iterator]: function* () {
                for (let i = array.length - 1; i >= 0; i--) {
                    yield array[i];
                }
            }
        })
    }

    public repeat(times: number): Linqable<T> {
        times = Math.trunc(times);
        if (times === 0) return new Linqable<T>();
        if (times < 0) return this.reverse().repeat(-times);
        const self = this;
        return new Linqable<T>({
            [Symbol.iterator]: function* () {
                for (let i = 0; i < times; i++) {
                    for (const item of self) {
                        yield item;
                    }
                }
            }
        })
    }

    public first(numberOfItems: number = 1) {
        numberOfItems = Math.trunc(numberOfItems);
        if (numberOfItems < 0) throw new Error("Cannot return less than zero items.");
        const self = this;
        return new Linqable<T>({
            [Symbol.iterator]: function* () {
                let i = 0;
                for (const item of self) {
                    if (i++ < numberOfItems) {
                        yield item;
                    } else break;
                }
                while (i++ < numberOfItems) yield undefined;
            }
        });
    }

    public last(numberOfItems: number = 1) {
        numberOfItems = Math.trunc(numberOfItems);
        if (numberOfItems < 0) throw new Error("Cannot return less than zero items.");

        // TODO do this better with a limited-size queue
        const array = [...this];
        return new Linqable({
            [Symbol.iterator]: function* () {

                const excess = numberOfItems - array.length;
                if (excess > 0) {
                    for (let i = 0; i < excess; i++) {
                        yield undefined;
                    }
                    for (const item of array) yield item;
                }
                for (let i = array.length - numberOfItems; i < array.length; i++) {
                    yield array[i];
                }

            }
        })
    }

    public subRange(start: number, length: number) {
        start = Math.trunc(start);
        length = Math.trunc(length);

        const self = this;
        return new Linqable({
            [Symbol.iterator]: function* () {
                let resultLength = 0;
                while (start++ < 0 && resultLength++ < length) yield undefined

                for (const item of self) {
                    if (resultLength++ < length) {
                        yield item;
                    } else break;
                }

                while (resultLength++ < length) yield undefined;
            }
        })
    }

    public length(): number{
        let length = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for(const item of this) length++;
        return length;
    }
}


const ll: Linqable<Linqable<number>> = new Linqable([new Linqable([1, 2, 3]), new Linqable([4, 5]), new Linqable([6, 7, 8, 9])])

const l = ll.reduce((total, current) => total.concat(current), new Linqable<number>());
console.log("l", [...l]);

