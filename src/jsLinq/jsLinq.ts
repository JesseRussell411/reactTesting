console.log("start");

export function iterableFrom<T>(generatorGenerator: () => Generator<T>): Iterable<T>{
    return {
        [Symbol.iterator]: generatorGenerator
    }
}

export class EmptyIterable<T> implements Iterable<T> {
    public *[Symbol.iterator]() {}
}

const emptyAnyIterable = new EmptyIterable<any>();

export class Linqable<T, IT extends Iterable<T> = Iterable<T>>
    implements Iterable<T>
{
    private constructor(iterable?: IT & Iterable<T>) {
        this.items = iterable;
    }

    public readonly items: IT;

    public [Symbol.iterator]() {
        if (this.items == null) {
            return emptyAnyIterable[Symbol.iterator]();
        } else {
            return this.items[Symbol.iterator]();
        }
    }

    public static from<T>(generatorGenerator: () => Generator<T>) {
        return Linqable.of(iterableFrom(generatorGenerator));
    }

    public static fromGenerator<T>(generator: Generator<T>) {
        const items = [];
        let next = generator.next();
        while (!next.done) {
            items.push(next.value);
            next = generator.next();
        }
        return Linqable.of(items);
    }

    public static of<T, IT extends Iterable<T> = Iterable<T>>(items?: IT & Iterable<T>) {
        return new Linqable<T, IT>(items);
    }

    /**
     * @returns The iterable as an array. If the iterable is already an array, the iterable itself will be returned; in which case, modifying the array will modify the iterable.
     */
    public asArray() {
        if (Array.isArray(this.items)) {
            return this.items as T[];
        } else {
            return [...this];
        }
    }

    /**
     * @returns The iterable as a set. If the iterable is already a set, the iterable itself will be returned; in which case, modifying the set will modify the iterable.
     */
    public asSet() {
        if (this.items instanceof Set) {
            return this.items as Set<T>;
        } else {
            return new Set<T>(this);
        }
    }

    public toArray() {
        return [...this];
    }

    public toSet() {
        return new Set(this);
    }

    public toMap<K, V>(
        keySelector: (item: T) => K = (item) => item[0],
        valueSelector: (item: T) => V = (item) => item[1]
    ) {
        const result = new Map<K, V>();
        for (const item of this) {
            result.set(keySelector(item), valueSelector(item));
        }
        return result;
    }

    public map<R>(callback: (item: T, index: number) => R) {
        const self = this;
        return Linqable.from(function* () {
            let index = 0;
            for (const item of self) {
                yield callback(item, index++);
            }
        });
    }

    public forEach(callback: (item: T, index: number) => void) {
        const self = this;
        let index = 0;
        for (const item of self.items) {
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
        return Linqable.from(function* () {
            let index = 0;
            for (const item of self) {
                if (callback(item, index++)) yield item;
            }
        });
    }

    public sort(comparator?: (a: T, b: T) => number) {
        const self = this;
        return Linqable.from(function* () {
            // TODO there's probably some efficient algorithm for this, at least use a sorted set
            const array = [...self];
            array.sort(comparator);

            for (const item of array) yield item;
        });
    }

    public concat(other: Iterable<T>) {
        const self = this;
        return Linqable.from(function* () {
            for (const item of self) yield item;
            for (const item of other) yield item;
        });
    }

    public reverse() {
        const array = [...this];
        return Linqable.from(function* () {
            for (let i = array.length - 1; i >= 0; i--) {
                yield array[i];
            }
        });
    }

    public repeat(times: number) {
        times = Math.trunc(times);
        if (times === 0) return new Linqable<T>();
        if (times < 0) return this.reverse().repeat(-times);
        const self = this;
        return Linqable.from(function* () {
            for (let i = 0; i < times; i++) {
                for (const item of self) {
                    yield item;
                }
            }
        });
    }

    public head(numberOfItems: number = 1) {
        numberOfItems = Math.trunc(numberOfItems);
        if (numberOfItems < 0)
            throw new Error("Cannot return less than zero items.");
        const self = this;
        return Linqable.from(function* () {
            let i = 0;
            for (const item of self) {
                if (i++ < numberOfItems) {
                    yield item;
                } else break;
            }
            while (i++ < numberOfItems) yield undefined;
        });
    }

    public tail(numberOfItems: number = 1) {
        numberOfItems = Math.trunc(numberOfItems);
        if (numberOfItems < 0)
            throw new Error("Cannot return less than zero items.");

        // TODO do this better with a limited-size queue
        const array = [...this];
        return Linqable.from(function* () {
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
        });
    }

    public first(): T | undefined {
        for (const item of this) return item;
        return undefined;
    }

    public last(): T | undefined {
        if (Array.isArray(this.items)) {
            if (this.items.length === 0) return undefined;
            return this.items[this.items.length - 1];
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
        return Linqable.from(function* () {
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
        });
    }

    public length(): number {
        if (Array.isArray(this.items)) return this.items.length;
        if (this.items instanceof Set) return this.items.size;
        let length = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const item of this) length++;
        return length;
    }

    public chunk(size: number) {
        const self = this;
        return Linqable.from(function* () {
            let chunk: T[] = [];
            for (const item of self) {
                chunk.push(item);
                if (chunk.length >= size) {
                    yield Linqable.of(chunk);
                    chunk = [];
                }
            }

            if (chunk.length > 0) yield Linqable.of(chunk);
        });
    }

    public groupBy<K>(grouper: (item: T, index: number) => K) {
        let groups: Map<K, T[]> = new Map<K, T[]>();
        let index = 0;

        for (const item of this) {
            const key = grouper(item, index++);
            const group = groups.get(key);
            if (group === undefined) {
                groups.set(key, [item]);
            } else {
                group.push(item);
            }
        }

        return Linqable.of(groups);
    }

    public find(seeker: (item: T, index: number) => boolean) {
        let index = 0;
        for (const item of this) {
            if (seeker(item, index++)) return item;
        }
        return undefined;
    }

    public includes(item: T) {
        if (this.items instanceof Set) return this.items.has(item);
        if (Array.isArray(this.items)) return this.items.includes(item);
        for (const localItem of this)
            if (Object.is(item, localItem)) return true;

        return false;
    }

    public itemAt(index: number): T | undefined {
        index = Math.trunc(index);
        if (Array.isArray(this.items)) return this.items[index];
        let currentIndex = 0;
        for (const item of this) {
            if (currentIndex++ === index) return item;
        }
        return undefined;
    }

    public distinct() {
        const self = this;

        return Linqable.from(function* () {
            const past = new Set<T>();
            for (const item of self) {
                if (past.has(item)) continue;
                past.add(item);
                yield item;
            }
        });
    }

    public empty() {
        let result = true;
        for (const item of this) {
            result = false;
            break;
        }
        return result;
    }

    public notEmpty() {
        let result = false;
        for (const item of this) {
            result = true;
            break;
        }
        return result;
    }

    public skip(count: number) {
        const self = this;
        return Linqable.from(function* () {
            let skipped = 0;
            for (const item of self) {
                if (skipped < count) {
                    skipped++;
                    continue;
                }
                yield item;
            }
        });
    }

    public skipWhile(test: (item: T) => boolean) {
        const self = this;
        return Linqable.from(function* () {
            let skipping = true;
            for (const item of self) {
                if (!skipping) {
                    yield item;
                } else {
                    if (!test(item)) {
                        skipping = false;
                        yield item;
                    }
                }
            }
        });
    }
}

const ll = Linqable.of([
    Linqable.of([1, 2, 3]),
    Linqable.of([4, 5]),
    Linqable.of([6, 7, 8, 9]),
]);
console.log(1);

const l = ll.reduce(
    (total, current) => total.concat(current),
    Linqable.of<number, Iterable<number>>()
);

console.log(2);
const lc = l.chunk(2);
console.log("l", [...l]);
console.log([...lc.map(item => item[1] ?? item[0])]);


// for (const chunk of lc) {
//     let thing = chunk.items[1];
//     if (thing === undefined) thing = chunk.items[0];
//     console.log(thing);
// }
// console.log(3);

const linqable = Linqable.of([5,3,6,8,2,4,5]);
console.log("ling:",[...linqable.map((n, i) => n + i).sort((a, b) => a - b)]);
console.log([...linqable.map((n, i) => n + i)])
console.log([...linqable.map((n, i) => n + i).filter((n) => n % 2 === 0)])
console.log([...linqable.groupBy((item) => item === 5)])
console.log(3);