import * as util from "util";
import { isIE } from "devextreme-react/core/configuration/utils";

console.log("start");

export function iterableFrom<T>(
    generatorGenerator: () => Generator<T>
): Iterable<T> {
    return {
        [Symbol.iterator]: generatorGenerator,
    };
}

export class EmptyIterable<T> implements Iterable<T> {
    public *[Symbol.iterator]() {}
}

const emptyAnyIterable = new EmptyIterable<any>();

export class Linqable<T, IT extends Iterable<T> = Iterable<T>>
    implements Iterable<T>
{
    private constructor(iterableGetter: () => IT & Iterable<T>) {
        this.itemsGetter = iterableGetter;
    }

    // public readonly items: IT;
    private _items: IT;
    private itemsSet: boolean = false;
    private itemsGetter: () => IT & Iterable<T>;

    public get items() {
        // check if items is already set
        if (this.itemsSet) return this._items;

        // set items
        this._items = this.itemsGetter();

        // help the garbage collector
        this.itemsGetter = undefined;

        this.itemsSet = true;
        return this._items;
    }

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

    public static of<T, IT extends Iterable<T> = Iterable<T>>(
        items?: IT & Iterable<T>
    ) {
        return new Linqable<T, IT>(() => items);
    }

    public static lazyOf<T, IT extends Iterable<T> = Iterable<T>>(
        itemsGetter: () => IT & Iterable<T>
    ) {
        return new Linqable(itemsGetter);
    }

    /**
     * @returns The iterable as an array. If the iterable is already an array, the iterable itself will be returned; in which case, modifying the array will modify the iterable.
     */
    public asArray() {
        return asArray(this.items);
    }

    /**
     * @returns The iterable as a set. If the iterable is already a set, the iterable itself will be returned; in which case, modifying the set will modify the iterable.
     */
    public asSet() {
        return asSet(this.items);
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
        let index = 0;
        for (const item of this) {
            callback(item, index++);
        }

        return this;
    }

    public reduce<R>(
        callback: (
            previousResult: R,
            currentItem: T,
            index: number,
            self: Linqable<T, IT>
        ) => R,
        initialValue?: R
    ): R {
        let result = initialValue;
        let index = 0;
        for (const item of this) {
            result = callback(result, item, index++, this);
        }
        return result;
    }

    /**
     * Like reduce, but skips the first item and uses it as the initial value instead.
     * @param combination
     */
    public combine(
        combination: (
            previousResult: T,
            currentItem: T,
            index: number,
            self: Linqable<T, IT>
        ) => T
    ): T {
        const itemGenerator = this[Symbol.iterator]();
        let nextItem = itemGenerator.next();
        let result: T = nextItem.value;
        let index = 1;
        while ((nextItem = itemGenerator.next()).done === false) {
            result = combination(result, nextItem.value, index++, this);
        }
        return result;
    }

    public filter(
        callback: (item: T, index: number, self: Linqable<T, IT>) => boolean
    ) {
        const self = this;
        return Linqable.from(function* () {
            let index = 0;
            for (const item of self) {
                if (callback(item, index++, self)) yield item;
            }
        });
    }

    public sorted(comparator?: (a: T, b: T) => number) {
        const self = this;
        return Linqable.from(function* () {
            const array = self.toArray();
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
        const self = this;
        return Linqable.from(function* () {
            const array = self.asArray();
            for (let i = array.length - 1; i >= 0; i--) {
                yield array[i];
            }
        });
    }

    public repeat(times: number) {
        times = Math.trunc(times);
        if (times === 0) return Linqable.of<T>();
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
            let lastItem = undefined;
            for (const item of this) lastItem = item;
            return lastItem;
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

    public groupBy<K>(
        grouper: (item: T, index: number, self: Linqable<T, IT>) => K
    ): Linqable<[K, Linqable<T, T[]>]> {
        const self = this;
        return Linqable.from(function* () {
            for (const entry of self.indexBy(grouper)) yield entry;
        });
    }

    public indexBy<K>(
        indexer: (item: T, index: number, self: Linqable<T, IT>) => K
    ): Linqable<[K, Linqable<T, T[]>], Map<K, Linqable<T, T[]>>> {
        return Linqable.lazyOf(() => {
            const itemIndex = new Map<K, Linqable<T, T[]>>();
            let index = 0;

            for (const item of this) {
                const key = indexer(item, index++, this);
                const group = itemIndex.get(key);
                if (group === undefined) {
                    itemIndex.set(key, Linqable.of([item]));
                } else {
                    group.items.push(item);
                }
            }

            return itemIndex;
        });
    }

    public find(
        predicate: (item: T, index: number, self: Linqable<T, IT>) => boolean
    ) {
        let index = 0;
        for (const item of this) {
            if (predicate(item, index++, this)) return item;
        }
        return undefined;
    }

    public includes(item: T): boolean {
        if (this.items instanceof Set) return this.items.has(item);
        if (Array.isArray(this.items)) return this.items.includes(item);
        for (const localItem of this)
            if (Object.is(item, localItem)) return true;

        return false;
    }

    public at(index: number): T | undefined {
        index = Math.trunc(index);
        if (isArray(this.items)) return this.items[index];
        if (isLinqable(this.items)) {
            let current: Linqable<T> = this.items;
            // javascript doesn't do tail recursion optimization so I gotta do it myself.
            while (isLinqable(current.items)) current = current.items;
            return current.at(index);
        }
        let currentIndex = 0;
        for (const item of this) {
            if (currentIndex++ === index) return item;
        }
        return undefined;
    }

    public distinct(identifier: (T) => any = (t) => t) {
        const self = this;

        return Linqable.from(function* () {
            const cache = new Set<T>();
            for (const item of self) {
                const id = identifier(item);
                if (cache.has(id)) continue;
                cache.add(id);
                yield item;
            }
        });
    }

    public none() {
        return this[Symbol.iterator]().next().done;
    }

    public any() {
        return !this[Symbol.iterator]().next().done;
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

    public skipWhile(
        test: (item: T, index: number, self: Linqable<T, IT>) => boolean
    ) {
        const self = this;
        return Linqable.from(function* () {
            let skipping = true;
            let index = 0;
            for (const item of self) {
                if (!skipping) {
                    yield item;
                } else {
                    if (!test(item, index++, self)) {
                        skipping = false;
                        yield item;
                    }
                }
            }
        });
    }

    public take(count: number) {
        const self = this;
        return Linqable.from(function* () {
            for (const item of self) {
                if (count-- > 0) {
                    yield item;
                } else break;
            }
        });
    }

    public takeWhile(
        test: (item: T, index: number, self: Linqable<T, IT>) => boolean
    ) {
        const self = this;
        return Linqable.from(function* () {
            let index = 0;
            for (const item of self) {
                if (test(item, index++, self)) {
                    yield item;
                } else break;
            }
        });
    }

    public zipperMerge<E>(
        other: Iterable<E>,
        completeBoth: boolean = true
    ): Linqable<T | E> {
        const self = this;
        return Linqable.from(function* () {
            const gen = self[Symbol.iterator]();
            const otherGen = other[Symbol.iterator]();
            let next = gen.next();
            let otherNext = otherGen.next();
            while (!next.done && !otherNext.done) {
                yield next.value;
                yield otherNext.value;
                next = gen.next();
                otherNext = otherGen.next();
            }
            if (!completeBoth) return;

            while (!next.done) {
                yield next.value;
                next = gen.next();
            }
            while (!otherNext.done) {
                yield otherNext.value;
                otherNext = otherGen.next();
            }
        });
    }

    public intersection(other: Iterable<T>) {
        const self = this;
        return Linqable.from(function* () {
            const otherCache = new Set<T>();
            const returnedCache = new Set<T>();

            const otherGenerator = other[Symbol.iterator]();
            let otherNext = otherGenerator.next();

            for (const item of self) {
                if (returnedCache.has(item)) continue;

                if (otherCache.has(item)) {
                    returnedCache.add(item);
                    otherCache.delete(item);
                    yield item;
                }

                while (!otherNext.done) {
                    if (Object.is(item, otherNext.value)) {
                        returnedCache.add(item);
                        yield item;
                    } else {
                        otherCache.add(otherNext.value);
                    }

                    otherNext = otherGenerator.next();
                }
            }
        });
    }

    public with(required: Iterable<T>) {
        const self = this;
        return Linqable.from(function* () {
            // TODO can do this slightly more efficiently maybe.
            const setOfRequired = new Set(required);
            for (const item of self) {
                setOfRequired.delete(item);
                yield item;
            }
            for (const item of setOfRequired) {
                yield item;
            }
        });
    }

    public without(excluding: Iterable<T>) {
        const self = this;
        return Linqable.from(function* () {
            // TODO can do this slightly more efficiently maybe.
            const setOfExcluding = asSet(excluding);
            for (const item of self) {
                if (!setOfExcluding.has(item)) yield item;
            }
        });
    }

    public join(separator: string) {
        return this.asArray().join(separator);
    }

    public findIndex(
        predicate: (item: T, index: number, self: Linqable<T, IT>) => boolean
    ) {
        let index = 0;
        for (const item of this) {
            if (predicate(item, index++, this)) return index;
        }
        return -1;
    }
}

export function combine<T>(
    items: Iterable<T>,
    combination: (previousResult: T, currentItem: T) => T
) {
    const itemGenerator = items[Symbol.iterator]();
    let nextItem = itemGenerator.next();
    let result: T = nextItem.value;
    while ((nextItem = itemGenerator.next()).done === false) {
        result = combination(result, nextItem.value);
    }
    return result;
}

/**
 * Normally when testing whether an iterable is an Array using Array.isArray, typescript will think that it is an any[] even when it knows that the original is Iterable<T>. The type argument is lost. This function preserves the type argument.
 * @returns Whether the given iterable object is an Array.
 */
export function isArray<T>(iterable: Iterable<T>): iterable is T[] {
    return Array.isArray(iterable);
}

/**
 * Normally when testing whether an iterable is a set using instanceof, typescript will think that it is a Set<any> even when it knows that the original is Iterable<T>. The type argument is lost. This function preserves the type argument.
 * @returns Whether the given iterable object is a Set.
 * @param iterable
 */
export function isSet<T>(iterable: Iterable<T>): iterable is Set<T> {
    if (iterable instanceof Set) {
        iterable;
    }
    return iterable instanceof Set;
}

export function isMap<K, V>(iterable: Iterable<[K, V]>): iterable is Map<K, V> {
    return iterable instanceof Map;
}

export function isLinqable<T>(iterable?: Iterable<T>): iterable is Linqable<T> {
    return iterable instanceof Linqable;
}

/**
 * @returns The given collection if it is an instance of an Array, or a new Array containing the object's contents if otherwise. **The result is not safe to modify**
 */
export function asArray<T>(collection?: Iterable<T>) {
    if (isLinqable(collection)) {
        return collection.asArray();
    } else if (isArray(collection)) {
        return collection;
    } else {
        return [...(collection ?? [])];
    }
}

/**
 * @returns The given collection if it is an instance of a Set, or a new Set containing the object's contents if otherwise. **The result is not safe to modify**
 */
export function asSet<T>(collection?: Iterable<T>) {
    if (isLinqable(collection)) {
        return collection.asSet();
    } else if (isSet(collection)) {
        return collection;
    } else {
        return new Set(collection);
    }
}

export function asMap<K, V>(collection?: Iterable<[K, V]>) {
    if (isLinqable(collection)) {
        return asMap(collection.items);
    } else if (isMap(collection)) {
        return collection;
    } else {
        return new Map(collection);
    }
}

export function asLinqable<T>(iterable?: Iterable<T>): Linqable<T> {
    if (isLinqable(iterable)) {
        return iterable;
    } else {
        return Linqable.of(iterable);
    }
}

export function range(start: number, stop?: number, step?: number) {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }

    if (step === undefined) {
        step = Math.sign(stop);
    }

    return Linqable.from(function* () {
        if (start < stop) {
            for (let i = start; i < stop; i += step) {
                yield i;
            }
        } else {
            for (let i = start; i > stop; i += step) {
                yield i;
            }
        }
    });
}

/**
 * Combines two collections of values into one set by keeping only the values found in both iterables.
 * @returns A Set containing the items found in both iterable objects.
 */
export function intersection<T>(a: Iterable<T>, b: Iterable<T>) {
    // iterable will be iterated over to look for shared items in set using set's "has" method.
    let iterable: Iterable<T>, set: Set<T>;

    // select the best object to be the set (whichever one is already a set or the largest one if their size is known). The other will be Iterable.
    if (isSet(a) && isSet(b)) {
        if (a.size > b.size) {
            iterable = b;
            set = a;
        } else {
            iterable = a;
            set = b;
        }
    } else if (isSet(a)) {
        iterable = b;
        set = a;
    } else if (isSet(b)) {
        iterable = a;
        set = b;
    } else if (isArray(a) && isArray(b)) {
        if (a.length > b.length) {
            iterable = b;
            set = new Set(a);
        } else {
            iterable = a;
            set = new Set(b);
        }
    } else {
        iterable = a;
        set = new Set(b);
    }

    const result = new Set<T>();
    for (const item of iterable) {
        if (result.size >= set.size) break;
        if (set.has(item)) {
            // item is in bother iterables so include it in the output
            result.add(item);
        }
    }

    return result;
}

export function integerDivide(a: number | bigint, b: number | bigint): bigint {
    return BigInt(a) / BigInt(b);
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
console.log([...lc.map((item) => item[1] ?? item[0])]);

const linqable = Linqable.of([5, 3, 6, 8, 2, 4, 5]);
console.log("linq:", [
    ...linqable.map((n, i) => n + i).sorted((a, b) => a - b),
]);
console.log([...linqable.map((n, i) => n + i)]);
console.log([...linqable.map((n, i) => n + i).filter((n) => n % 2 === 0)]);
console.log([...linqable.groupBy((item) => item === 5)]);
console.log(3);

linqable.groupBy((n) => Math.trunc(n / 3));
console.log("--=-=-====-=----=-=-=-=--=-=-=-=====----=-----=-=-=-=---===-=-");
console.log("groupby indexby test");
const testArray = [
    { name: "greg", age: 7 },
    { name: "tom", age: 9 },
    { name: "fred", age: 7 },
    { name: "chris", age: 9 },
    { name: "sam", age: 7 },
];
const testLinq = Linqable.of(testArray);
const grouped = testLinq.groupBy((person) => person.age);
const indexed = testLinq.indexBy((person) => person.age);
console.log(
    util.inspect(
        [...grouped].map((g) => [g[0], g[1].asArray()]),
        true,
        null,
        true
    )
);
console.log(
    util.inspect(
        [...indexed].map((g) => [g[0], g[1].asArray()]),
        true,
        null,
        true
    )
);
console.log("--------------");
testArray.push({ name: "ken", age: 10 });
console.log(
    util.inspect(
        [...grouped].map((g) => [g[0], g[1].asArray()]),
        true,
        null,
        true
    )
);
console.log(
    util.inspect(
        [...indexed].map((g) => [g[0], g[1].asArray()]),
        true,
        null,
        true
    )
);
