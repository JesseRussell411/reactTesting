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
        if (this.itemsSet) return this._items;
        this._items = this.itemsGetter();
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
        return Linqable.lazyOf(() => {
            const array = this.toArray();
            array.sort(comparator);
            return array;
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
    ) {
        const self = this;
        return Linqable.lazyOf(() => {
            let groups: Map<K, T[]> = new Map<K, T[]>();
            let index = 0;

            for (const item of self) {
                const key = grouper(item, index++, self);
                const group = groups.get(key);
                if (group === undefined) {
                    groups.set(key, [item]);
                } else {
                    group.push(item);
                }
            }
            return groups;
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
        if (Array.isArray(this.items)) return this.items[index];
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
        let result = true;
        for (const item of this) {
            result = false;
            break;
        }
        return result;
    }

    public any() {
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

    public union(other: Iterable<T>) {
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

    public newItemStructure<T2, IT2 extends Iterable<T2>>(
        modifier: (self: Linqable<T, IT>) => IT2 & Iterable<T2>
    ) {
        return Linqable.lazyOf(() => modifier(this));
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

    public without(excluding: Iterable<T>){
        const self = this;
        return Linqable.from(function * () {
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

export function isSet<T>(iterable?: Iterable<T>): iterable is Set<T> {
    return iterable instanceof Set;
}

export function isArray<T>(iterable?: Iterable<T>): iterable is T[] {
    return Array.isArray(iterable);
}

export function asSet<T>(iterable?: Iterable<T>): Set<T> {
    if (isSet(iterable)) {
        return iterable;
    } else {
        return new Set(iterable);
    }
}

export function asArray<T>(iterable?: Iterable<T>): T[] {
    if (isArray(iterable)) {
        return iterable;
    } else {
        return [...(iterable ?? [])];
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
linqable
    .newItemStructure((self) => new Set(self))
    .concat([1, 2, 3])
    .with([1, 2, 20, 3]);

linqable.groupBy((n) => Math.trunc(n / 3));
