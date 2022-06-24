console.log("start");

export class Iter<T> implements Iterable<T> {
    constructor(generatorGenerator: () => Generator<T>) {
        this.generatorGenerator = generatorGenerator;
    }
    private readonly generatorGenerator: () => Generator<T>;
    public [Symbol.iterator]() {
        return this.generatorGenerator();
    }
}

export class EmptyIterable<T> implements Iterable<T> {
    public *[Symbol.iterator]() {}
}

export class Linqable<T, IT extends Iterable<T> = Iterable<T>>
    implements Iterable<T>
{
    constructor(iterable?: IT & Iterable<T>) {
        this.iterable = iterable;
    }

    public readonly iterable: IT | undefined | null;

    public [Symbol.iterator]() {
        if (this.iterable == null) {
            return new EmptyIterable<T>()[Symbol.iterator]();
        } else {
            return this.iterable[Symbol.iterator]();
        }
    }

    /**
     * @returns The iterable as an array. If the iterable is already an array, the iterable itself will be returned; in which case, modifying the array will modify the iterable.
     */
    public asArray() {
        if (Array.isArray(this.iterable)) {
            return this.iterable as T[];
        } else {
            return [...this];
        }
    }

    public map<R>(callback: (item: T, index: number) => R) {
        const self = this;
        return new Linqable(
            new Iter(function* () {
                let index = 0;
                for (const item of self) {
                    yield callback(item, index++);
                }
            })
        );
    }

    public forEach(callback: (item: T, index: number) => void) {
        const self = this;
        let index = 0;
        for (const item of self.iterable) {
            callback(item, index++);
        }

        return this;
    }

    public reduce<R>(
        callback: (previousResult: R, currentItem: T, index: number) => R,
        initialValue?: R
    ): R {
        let result = initialValue;
        let index = 0;
        for (const item of this) {
            result = callback(result, item, index++);
        }
        return result;
    }

    public filter(callback: (item: T, index: number) => boolean) {
        const self = this;
        return new Linqable(
            new Iter(function* () {
                let index = 0;
                for (const item of self) {
                    if (callback(item, index++)) yield item;
                }
            })
        );
    }

    public sort(comparator?: (a: T, b: T) => number) {
        const self = this;
        return new Linqable(
            new Iter(function* () {
                // TODO there's probably some efficient algorithm for this, at least use a sorted set
                const array = [...self];
                array.sort(comparator);

                for (const item of array) yield item;
            })
        );
    }

    public concat(other: Iterable<T>) {
        const self = this;
        return new Linqable(
            new Iter(function* () {
                for (const item of self) yield item;
                for (const item of other) yield item;
            })
        );
    }

    public reverse() {
        const array = [...this];
        return new Linqable(
            new Iter(function* () {
                for (let i = array.length - 1; i >= 0; i--) {
                    yield array[i];
                }
            })
        );
    }

    public repeat(times: number) {
        times = Math.trunc(times);
        if (times === 0) return new Linqable<T>();
        if (times < 0) return this.reverse().repeat(-times);
        const self = this;
        return new Linqable(
            new Iter(function* () {
                for (let i = 0; i < times; i++) {
                    for (const item of self) {
                        yield item;
                    }
                }
            })
        );
    }

    public head(numberOfItems: number = 1) {
        numberOfItems = Math.trunc(numberOfItems);
        if (numberOfItems < 0)
            throw new Error("Cannot return less than zero items.");
        const self = this;
        return new Linqable(
            new Iter(function* () {
                let i = 0;
                for (const item of self) {
                    if (i++ < numberOfItems) {
                        yield item;
                    } else break;
                }
                while (i++ < numberOfItems) yield undefined;
            })
        );
    }

    public tail(numberOfItems: number = 1) {
        numberOfItems = Math.trunc(numberOfItems);
        if (numberOfItems < 0)
            throw new Error("Cannot return less than zero items.");

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
                for (
                    let i = array.length - numberOfItems;
                    i < array.length;
                    i++
                ) {
                    yield array[i];
                }
            },
        });
    }

    public first(): T | undefined {
        for (const item of this) return item;
        return undefined;
    }

    public last(): T | undefined {
        if (Array.isArray(this.iterable)) {
            if (this.iterable.length === 0) return undefined;
            return this.iterable[this.iterable.length - 1];
        } else {
            const array = [...this];
            if (array.length === 0) return undefined;
            return array[array.length - 1];
        }
    }

    public subRange(start: number, length: number) {
        start = Math.trunc(start);
        length = Math.trunc(length);

        const self = this;
        return new Linqable(
            new Iter(function* () {
                let resultLength = 0;
                while (start < 0 && resultLength < length) {
                    start++;
                    resultLength++;
                    yield undefined;
                }

                for (const item of self) {
                    if (start > 0) {
                        start--;
                        continue;
                    }
                    if (resultLength < length) {
                        resultLength++;
                        yield item;
                    } else break;
                }

                while (resultLength < length) {
                    resultLength++;
                    yield undefined;
                }
            })
        );
    }

    public length(): number {
        if (Array.isArray(this.iterable)) return this.iterable.length;
        if (this.iterable instanceof Set) return this.iterable.size;
        let length = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const item of this) length++;
        return length;
    }

    public chunk(size: number) {
        const self = this;
        return new Linqable(
            new Iter(function* () {
                const iterator = self[Symbol.iterator]();
                let next = iterator.next();
                while (!next.done) {
                    const chunk = [];
                    for (let i = 0; i < size; i++) {
                        chunk.push(next.value);
                        next = iterator.next();
                        if (next.done) break;
                    }
                    yield new Linqable<T, T[]>(chunk);
                }
            })
        );
    }
}

const ll = new Linqable([
    new Linqable([1, 2, 3]),
    new Linqable([4, 5]),
    new Linqable([6, 7, 8, 9]),
]);


const l = ll.reduce(
    (total, current) => total.concat(current),
    new Linqable<number>()
);

const lc = l.chunk(2);
console.log("l", [...l]);
for (const chunk of lc) {
    let thing = chunk.iterable[1];
    if (thing === undefined) thing = chunk.iterable[0];
    console.log(thing);
}
