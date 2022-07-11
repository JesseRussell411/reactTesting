import { abs, lt, mul, sign, trunc } from "../utils/betterNumbers";

export type ObjectKey = number | string | symbol;

export type EntryLike<K, V> =
    | [K, V, ...any]
    | { 0: K; 1: V; [key: ObjectKey]: any };

export type EntryLikeKeyOnly<K> = [K, ...any] | { 0: K; [key: ObjectKey]: any };

export type EntryLikeValueOnly<V> =
    | [any, V, ...any]
    | { 1: V; [key: ObjectKey]: any };

export function iter<T>(
    generatorGetter: () => Generator<T> = function* () {}
): Iterable<T> {
    return {
        [Symbol.iterator]: generatorGetter,
    };
}

export function protectIterable(iterable: Iterable<T>): Iterable<T> {
    return iter(function* () {
        for (const value of iterable) yield value;
    });
}

export function tryGetLength(collection: Iterable<any>): number | undefined {
    if (isArray(collection)) return collection.length;
    if (isSet(collection)) return collection.size;
    if (isMap(collection)) return collection.size;
    return undefined;
}

export function count(collection: Iterable<any>): number {
    return (
        tryGetLength(collection) ?? reduce(collection, (length) => length++, 0)
    );
}

export function isIterable(value: any): value is Iterable<any> {
    return typeof (value as any)?.[Symbol.iterator] === "function";
}

export function isArray<T>(collection?: Iterable<T>): collection is T[] {
    return Array.isArray(collection);
}

export function isSet<T>(collection?: Iterable<T>): collection is Set<T> {
    return collection instanceof Set;
}

export function isMap<K, V>(
    collection?: Iterable<[K, V]>
): collection is Map<K, V> {
    return collection instanceof Map;
}

export function asArray<T>(collection?: Iterable<T>): T[] {
    if (isArray(collection)) return collection;
    return [...(collection ?? [])];
}

export function asSet<T>(collection?: Iterable<T>): Set<T> {
    if (isSet(collection)) return collection;
    return new Set(collection);
}

export function asMap<K, V>(collection?: Iterable<[K, V]>): Map<K, V> {
    if (isMap(collection)) return collection;
    return new Map(collection);
}

export function toArray<T>(collection?: Iterable<T>): T[] {
    return [...(collection ?? [])];
}

export function toSet<T>(collection?: Iterable<T>): Set<T> {
    return new Set(collection);
}

export function toMap<T, K, V>(
    collection: Iterable<T>,
    keySelector: (value: T, index: number, collection: Iterable<T>) => K,
    valueSelector: (value: T, index: number, collection: Iterable<T>) => V
): Map<K, V>;

export function toMap<K, V>(collection: Iterable<EntryLike<K, V>>): Map<K, V>;

export function toMap<T extends EntryLikeValueOnly<V>, K, V>(
    collection: Iterable<T & EntryLikeValueOnly<V>>,
    keySelector: (value: T, index: number, collection: Iterable<T>) => K,
    valueSelector?: undefined
): Map<K, V>;

export function toMap<T extends EntryLikeKeyOnly<K>, K, V>(
    collection: Iterable<T & EntryLikeKeyOnly<K>>,
    keySelector: undefined,
    valueSelector: (value: T, index: number, collection: Iterable<T>) => V
): Map<K, V>;

export function toMap<T, K, V>(
    collection: Iterable<T>,
    keySelector: (
        value: T,
        index: number,
        collection: Iterable<T>
    ) => K = defaultKeySelector,
    valueSelector: (
        value: T,
        index: number,
        collection: Iterable<T>
    ) => V = defaultValueSelector
): Map<K, V> {
    const result = new Map<K, V>();
    let index = 0;
    for (const value of collection) {
        result.set(
            keySelector(value, index, collection),
            valueSelector(value, index, collection)
        );
        index++;
    }

    return result;
}

function defaultKeySelector<K>(value: any): K {
    return value?.[0];
}

function defaultValueSelector<V>(value: any): V {
    return value?.[1];
}

export function map<T, R>(
    collection: Iterable<T>,
    mapping: (value: T, index: number, collection: Iterable<T>) => R
) {
    return iter(function* () {
        let index = 0;
        for (const value of collection)
            yield mapping(value, index++, collection);
    });
}

export function forEach<T>(
    collection: Iterable<T>,
    callback: (value: T, index: number, collection: Iterable<T>) => void
) {
    let index = 0;
    for (const value of collection) callback(value, index++, collection);
}

export function reduce<T, R>(
    collection: Iterable<T>,
    reduction: (
        previousResult: R,
        current: T,
        index: number,
        collection: Iterable<T>
    ) => R,
    initialValue: R
): R;

export function reduce<T>(
    collection: Iterable<T>,
    reduction: (
        previousResult: T | undefined,
        current: T,
        index: number,
        collection: Iterable<T>
    ) => T
): T | undefined;

export function reduce<T, R>(
    collection: Iterable<T>,
    reduction: (
        previousResult: R | undefined,
        current: T,
        index: number,
        collection: Iterable<T>
    ) => R,
    initialValue?: R | undefined
): R | undefined {
    let index = 0;
    let result = initialValue;
    for (const value of collection)
        result = reduction(result, value, index++, collection);

    return result;
}

export function combine<T>(
    collection: Iterable<T>,
    combination: (
        previousResult: T,
        current: T,
        index: number,
        collection: Iterable<T>
    ) => T
) {
    const generator = collection[Symbol.iterator]();
    let next = generator.next();
    if (next.done) return;
    let result = next.value;
    let index = 1;

    while (!(next = generator.next()).done) {
        result = combination(result, next.value, index++, collection);
    }
    return result;
}

export function filter<T>(
    collection: Iterable<T>,
    filter: (value: T, index: number, collection: Iterable<T>) => boolean
) {
    return iter(function* () {
        let index = 0;
        for (const value of collection) {
            if (filter(value, index++, collection)) yield value;
        }
    });
}

export function sorted<T>(
    collection: Iterable<T>,
    comparator?: (a: T, b: T) => number
) {
    const result = [...collection];
    result.sort(comparator);
    return result;
}

export function concat<A, B>(a: Iterable<A>, b: Iterable<B>): Iterable<A | B> {
    return iter(function* () {
        for (const value of a) yield value;
        for (const value of b) yield value;
    });
}

export function reversed<T>(collection: Iterable<T>) {
    return iter(function* () {
        const reversible = asArray(collection);
        for (let i = reversible.length - 1; i >= 0; i--) {
            yield reversible[i];
        }
    });
}

export function repeat<T>(
    collection: Iterable<T>,
    times: number | bigint
): Iterable<T> {
    const times_whole = BigInt(times);
    if (times_whole < 0n) return repeat(collection, times_whole * -1n);

    return iter(function* () {
        for (let i = 0n; i < times_whole; i++) {
            for (const value of collection) yield value;
        }
    });
}

export function head<T>(collection: Iterable<T>, size: number | bigint) {
    const size_whole = abs(BigInt(size));

    return iter(function* () {
        let i = 0n;
        for (const value of collection) {
            if (i >= size_whole) break;
            yield value;
        }
    });
}

export function tail<T>(collection: Iterable<T>, size: number | bigint) {
    const size_whole = abs(Number(trunc(size)));

    return iter(function* () {
        const array = asArray(collection);

        for (
            let i = Math.max(0, array.length - size_whole);
            i < array.length;
            i++
        ) {
            yield array[i];
        }
    });
}

export function first<T>(collection: Iterable<T>): T | undefined {
    for (const value of collection) return value;
    return undefined;
}

export function last<T>(collection: Iterable<T>): T | undefined {
    let last: T | undefined = undefined;
    for (const value of collection) last = value;
    return last;
}

export function subRange<T>(
    collection: Iterable<T>,
    start: number | bigint,
    length: number | bigint
) {
    let start_whole = Number(trunc(start));
    let length_whole = Number(trunc(length));

    return iter(function* () {
        let resultLength = 0;
        while (start_whole < 0 && resultLength < length_whole) {
            start_whole++;
            resultLength++;
            yield undefined;
        }

        for (const item of collection) {
            if (start_whole > 0) {
                start_whole--;
                continue;
            }
            if (resultLength < length_whole) {
                resultLength++;
                yield item;
            } else break;
        }

        while (resultLength < length_whole) {
            resultLength++;
            yield undefined;
        }
    });
}

export function groupBy<T, K>(
    collection: Iterable<T>,
    keySelector: (value: T, index: number, collection: Iterable<T>) => K
): Map<K, T[]> {
    const groups = new Map<K, T[]>();

    let index = 0;
    for (const value of collection) {
        const key = keySelector(value, index++, collection);
        const group = groups.get(key) ?? setAndGet(groups, key, []);
        group.push(value);
    }

    return groups;
}

export function indexBy<T, K>(
    collection: Iterable<T>,
    keySelector: (value: T, index: number, collection: Iterable<T>) => K
): Map<K, T> {
    const groups = new Map<K, T>();

    let index = 0;
    for (const value of collection) {
        groups.set(keySelector(value, index++, collection), value);
    }

    return groups;
}

export function setAndGet<K, V>(map: Map<K, V>, key: K, value: V) {
    map.set(key, value);
    return value;
}

export function chunk<T>(
    collection: Iterable<T>,
    size: number | bigint
): Iterable<T[]> {
    const size_whole = BigInt(size);
    if (size_whole < 1n) throw new Error("cannot make chunks smaller than 1");

    return iter(function* () {
        let chunk = [] as T[];
        for (const value of collection) {
            chunk.push(value);

            if (chunk.length >= size_whole) {
                yield chunk;
                chunk = [];
            }
        }
        if (chunk.length > 0) {
            return chunk;
        }
    });
}

export function find<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean
): T | undefined {
    for (const value of collection) if (test(value)) return value;
    return undefined;
}

export function includes<T>(collection: Iterable<T>, value: T) {
    if (isArray(collection)) return collection.includes(value);
    if (isSet(collection)) return collection.has(value);
    for (const collectionValue of collection) {
        if (Object.is(value, collectionValue)) return true;
    }
    return false;
}

export function at<T>(collection: Iterable<T>, index: number | bigint) {
    const index_whole = BigInt(index);

    if (index_whole < 0n) {
        const array = asArray(collection);
        return array[array.length + Number(index_whole)];
    }

    if (isArray(collection)) {
        return collection[Number(index_whole)];
    }

    let i = 0n;
    for (const value of collection) {
        if (i++ >= index_whole) return value;
    }

    return undefined;
}

export function distinct<T>(collection: Iterable<T>): Iterable<T> {
    return iter(function* () {
        const returned = new Set<T>();
        for (const value of collection) {
            if (returned.has(value)) continue;
            returned.add(value);
            yield value;
        }
    });
}

/** @returns Whether the collection contains any items */
export function any<T>(collection: Iterable<T>): boolean;
/** @returns Whether the collection contains any items that pass the test */
export function any<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean
): boolean;
export function any<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean = () => true
) {
    for (const value of collection) if (test(value)) return true;
    return false;
}

/** @returns Whether the collection contains no items */
export function none<T>(collection: Iterable<T>): boolean;
/** @returns Whether the collection contains no items that pass the test */
export function none<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean
): boolean;
export function none<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean = () => true
) {
    for (const value of collection) if (test(value)) return false;
    return true;
}

export function skip<T>(collection: Iterable<T>, count: number | bigint) {
    const count_whole = abs(BigInt(count));
    return iter(function* () {
        const generator = collection[Symbol.iterator]();

        for (let i = 0n; i < count_whole; i++) {
            if (generator.next().done) break;
        }

        let next;
        while ((next = generator.next()).done === false) {
            yield next.value;
        }
    });
}

export function skipWhile<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean
) {
    return iter(function* () {
        const generator = collection[Symbol.iterator]();

        let next;
        while ((next = generator.next()).done === false) {
            if (!test(next.value)) {
                yield next.value;
                break;
            }
        }

        while ((next = generator.next()).done === false) {
            yield next.value;
        }
    });
}

export function take<T>(collection: Iterable<T>, count: number | bigint) {
    const count_whole = abs(BigInt(count));
    return iter(function* () {
        const generator = collection[Symbol.iterator]();
        let next;
        for (let i = 0n; i < count_whole; i++) {
            if ((next = generator.next()).done) break;
            yield next.value;
        }
    });
}

export function takeWhile<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean
) {
    return iter(function* () {
        const generator = collection[Symbol.iterator]();

        let next;
        while ((next = generator.next()).done === false) {
            if (test(next.value)) {
                yield next.value;
            } else break;
        }
    });
}

export function merge<A, B>(a: Iterable<A>, b: Iterable<B>): Iterable<A | B> {
    return iter(function* () {
        const genA = a[Symbol.iterator]();
        const genB = b[Symbol.iterator]();
        let nextA = genA.next();
        let nextB = genB.next();
        while (nextA.done === false && nextB.done === false) {
            yield nextA.value;
            yield nextB.value;
            nextA = genA.next();
            nextB = genB.next();
        }
        while (nextA.done === false) {
            yield nextA.value;
            nextA = genA.next();
        }
        while (nextB.done === false) {
            yield nextB.value;
            nextB = genB.next();
        }
    });
}

export function union<A, B>(a: Iterable<A>, b: Iterable<B>): Set<A | B> {
    return new Set(concat(a, b));
}

export function intersection<T>(a: Iterable<T>, b: Iterable<T>): Set<T> {
    let set: Set<T>, iterable: Iterable<T>;
    if (isSet(a)) {
        if (isSet(b)) {
            if (a.size < b.size) {
                set = b;
                iterable = a;
            } else {
                set = a;
                iterable = b;
            }
        } else {
            set = a;
            iterable = b;
        }
    } else if (isSet(b)) {
        set = b;
        iterable = a;
    } else {
        const sizeA = tryGetLength(a);
        const sizeB = tryGetLength(b);
        if (sizeA === undefined || sizeB === undefined) {
            set = new Set(b);
            iterable = a;
        } else if (sizeA < sizeB) {
            set = new Set(b);
            iterable = a;
        } else {
            set = new Set(a);
            iterable = b;
        }
    }

    const result = new Set<T>();
    for (const value of iterable) {
        if (set.has(value)) result.add(value);
    }

    return result;
}

export function including<T>(collection: Iterable<T>, toInclude: Iterable<T>) {
    return iter(function* () {
        const leftToInclude = new Set(toInclude);
        for (const value of collection) {
            yield value;
            leftToInclude.delete(value);
        }
        for (const value of leftToInclude) {
            yield value;
        }
    });
}

export function without<T>(collection: Iterable<T>, dontInclude: Iterable<T>) {
    return iter(function* () {
        const setOfDontInclude = asSet(dontInclude);
        for (const value of collection) {
            if (!setOfDontInclude.has(value)) yield value;
        }
    });
}

export function join<T>(
    collection: Iterable<T>,
    separator: string,
    toString: (value: T) => string = (value) => `${value}`
) {
    let stringBuilder = [] as string[];
    const gen = collection[Symbol.iterator]();
    let next = gen.next();
    if (next.done) return "";
    stringBuilder.push(toString(next.value));
    while ((next = gen.next()).done === false) {
        stringBuilder.push(separator);
        stringBuilder.push(toString(next.value));
    }
    return stringBuilder.join();
}

export function findIndex<T>(
    collection: Iterable<T>,
    test: (value: T) => boolean
) {
    let index = 0;
    for (const value of collection) {
        if (test(value)) return index;
        index++;
    }
    return -1;
}
