import {
    isArray,
    isSet,
    asSet,
    iter,
    setAndGet,
    at,
    last,
    count,
    isIterable,
} from "./Utils";
import { and } from "../utils/betterLogic";

export class Stream<T, Enclosed extends Iterable<T> = Iterable<T>>
    implements Iterable<T>
{
    public readonly getEnclosed: () => Enclosed;

    /** In the case of Streams enclosing Streams enclosing Streams... This returns the bottom most enclosed iterable. */
    public getDeepEnclosed() {
        let current: Iterable<T> = this.getEnclosed();
        while (Stream.isStream(current)) current = current.getEnclosed();
        return current;
    }

    public constructor(getEnclosed: () => Enclosed & Iterable<T>) {
        this.getEnclosed = getEnclosed;
    }

    [Symbol.iterator](): Iterator<T> {
        return this.getEnclosed()[Symbol.iterator]();
    }

    public static empty<T>() {
        return new Stream<T>(() => iter());
    }

    public static of<T, Enclosed extends Iterable<T>>(
        collection: Enclosed & Iterable<T>
    ) {
        return new Stream(() => collection);
    }

    public static lazyOf<T, Enclosed extends Iterable<T>>(
        getCollection: () => Enclosed & Iterable<T>
    ) {
        return new Stream(getCollection);
    }

    public static iter<T>(getGenerator: () => Generator<T>) {
        return new Stream(() => iter(getGenerator));
    }

    public static isStream<T>(iterable: Iterable<T>): iterable is Stream<T> {
        return iterable instanceof Stream;
    }

    public static asStream<T>(iterable: Iterable<T>): Stream<T> {
        if (this.isStream(iterable)) return iterable;
        return this.of(iterable);
    }

    public asSet(): Set<T> {
        const enclosed = this.getDeepEnclosed();
        if (isSet(enclosed)) return enclosed;
        return new Set(enclosed);
    }

    public asArray(): T[] {
        const enclosed = this.getDeepEnclosed();
        if (isArray(enclosed)) return enclosed;
        return [...enclosed];
    }

    public toSet(): Set<T> {
        return new Set(this);
    }

    public toArray(): T[] {
        return [...this];
    }

    public toMap<K, V>(
        keySelector: (value: T, index: number, stream: this) => K,
        valueSelector: (value: T, index: number, stream: this) => V
    ) {
        const result = new Map<K, V>();
        let index = 0;
        for (const value of this) {
            result.set(
                keySelector(value, index, this),
                valueSelector(value, index, this)
            );
            index++;
        }
        return result;
    }

    public forEach(
        callback: (value: T, index: number, stream: this) => void
    ): this {
        let index = 0;
        for (const value of this) callback(value, index++, this);
        return this;
    }

    public map<R>(
        mapping: (value: T, index: number, stream: this) => R
    ): Stream<R> {
        const self = this;
        return Stream.iter(function* () {
            let index = 0;
            for (const value of self) yield mapping(value, index++, self);
        });
    }

    public filter(
        test: (value: T, index: number, stream: this) => boolean
    ): Stream<T> {
        const self = this;
        return Stream.iter(function* () {
            let index = 0;
            for (const value of self)
                if (test(value, index++, self)) yield value;
        });
    }

    public concat<O>(other: Iterable<O>): Stream<T | O> {
        const self = this;
        return Stream.iter(function* () {
            for (const value of self) yield value;
            for (const value of other) yield value;
        });
    }

    public unShift<O>(other: Iterable<O>): Stream<T | O> {
        const self = this;
        return Stream.iter(function* () {
            for (const value of other) yield value;
            for (const value of self) yield value;
        });
    }

    public groupBy<K>(
        keySelector: (value: T, index: number, stream: this) => K
    ): Stream<[K, Stream<T, T[]>], Map<K, Stream<T, T[]>>> {
        const self = this;
        return Stream.lazyOf(() => {
            const groups = new Map<K, Stream<T, T[]>>();
            let index = 0;
            for (const value of self) {
                const key = keySelector(value, index++, self);
                const group =
                    groups.get(key) ?? setAndGet(groups, key, Stream.of([]));
                group.getEnclosed().push(value);
            }

            return groups;
        });
    }

    public reverse(): Stream<T> {
        const self = this;
        return Stream.iter(function* () {
            const array = self.asArray();
            for (let i = array.length - 1; i >= 0; i--) yield array[i];
        });
    }

    public repeat(times: number | bigint): Stream<T> {
        const usableTimes = BigInt(times);
        if (usableTimes < 0n) return this.reverse().repeat(-usableTimes);

        const self = this;
        return Stream.iter(function* () {
            for (let i = 0n; i < usableTimes; i++)
                for (const value of self) yield value;
        });
    }

    public chunk(size: number | bigint): Stream<Stream<T, T[]>> {
        const usableSize = Math.trunc(Number(size));
        if (usableSize < 1)
            throw new Error(`minimum size is 1 but given size was ${size}`);

        const self = this;
        return Stream.iter(function* () {
            let chunk: T[] = [];
            for (const value of self) {
                chunk.push(value);
                if (chunk.length >= usableSize) {
                    yield Stream.of(chunk);
                    chunk = [];
                }
            }
            if (chunk.length > 0) yield Stream.of(chunk);
        });
    }

    public distinct(): Stream<T> {
        const self = this;
        return Stream.iter(function* () {
            const returned = new Set<T>();
            for (const value of self) {
                if (!returned.has(value)) {
                    yield value;
                    returned.add(value);
                }
            }
        });
    }

    public with(other: Iterable<T>): Stream<T> {
        const self = this;
        return Stream.iter(function* () {
            const remaining = new Set<T>(other);
            for (const value of self) {
                remaining.delete(value);
                yield value;
            }

            for (const value of remaining) yield value;
        });
    }

    public without(other: Iterable<T>): Stream<T> {
        const self = this;
        return Stream.iter(function* () {
            const setOfExcluded = asSet(other);
            for (const value of self) {
                if (!setOfExcluded.has(value)) yield value;
            }
        });
    }

    public sorted(comparator?: (a: T, b: T) => number): Stream<T, T[]> {
        const self = this;
        return Stream.lazyOf(() => {
            const sorted = self.toArray();
            sorted.sort(comparator);
            return sorted;
        });
    }

    public takeWhile(test: (value: T, index: number, stream: this) => boolean) {
        const self = this;
        return Stream.iter(function* () {
            let index = 0;
            for (const value of self) {
                if (!test(value, index++, self)) break;
                yield value;
            }
        });
    }

    public take(count: number | bigint) {
        const usableCount = Math.trunc(Number(count));
        if (usableCount < 0)
            throw new Error(`minimum count is 0 but given count was ${count}`);

        return this.takeWhile((_, index) => index < usableCount);
    }

    public skipWhile(test: (value: T, index: number, stream: this) => boolean) {
        const self = this;
        return Stream.iter(function* () {
            const iterator = self[Symbol.iterator]();
            let next;

            let index = 0;
            while (!(next = iterator.next()).done)
                if (!test(next.value, index++, self)) break;

            while (!(next = iterator.next()).done) yield next.value;
        });
    }

    public skip(count: number | bigint) {
        const usableCount = Math.trunc(Number(count));
        if (usableCount < 0)
            throw new Error(`minimum count is 0 but given count was ${count}`);

        return this.skipWhile((_, index) => index < usableCount);
    }

    public merge<O>(other: Iterable<O>): Stream<T | O> {
        const self = this;
        return Stream.iter(function* () {
            const iterT = self[Symbol.iterator]();
            const iterO = other[Symbol.iterator]();
            let nextT;
            let nextO;

            while (
                and(!(nextT = iterT.next()).done, !(nextO = iterO.next()).done)
            ) {
                yield nextT.value;
                yield nextO.value;
            }

            if (!nextT.done) {
                do {
                    yield nextT.value;
                    nextT = iterT.next();
                } while (!nextT.done);
            } else if (!nextO.done) {
                do {
                    yield nextO.value;
                    nextO = iterO.next();
                } while (!nextO.done);
            }
        });
    }

    public findIndex(
        test: (value: T, index: number, stream: this) => boolean
    ): number | undefined {
        let index = 0;
        for (const value of this) {
            if (test(value, index, this)) return index;
            index++;
        }
        return undefined;
    }

    public at(index: number | bigint): T | undefined {
        return at(this.getDeepEnclosed(), index);
    }

    public reduce<R>(
        reduction: (
            previousResult: R | undefined,
            current: T,
            index: number,
            stream: this
        ) => R,
        initialValue: R
    ): R;

    public reduce(
        reduction: (
            previousResult: T | undefined,
            current: T,
            index: number,
            stream: this
        ) => T
    ): T | undefined;

    public reduce<R>(
        reduction: (
            previousResult: R | undefined,
            current: T,
            index: number,
            stream: this
        ) => R,
        initialValue?: R
    ): R | undefined {
        let result = initialValue;
        let index = 0;
        for (const value of this) {
            result = reduction(result, value, index++, this);
        }
        return result;
    }

    public combine(
        combination: (
            previousResult: T,
            current: T,
            index: number,
            stream: this
        ) => T
    ): T | undefined {
        const iterator = this[Symbol.iterator]();
        let next = iterator.next();
        if (next.done) return undefined;
        let result = next.value;
        let index = 1;
        while (!(next = iterator.next()).done)
            result = combination(result, next.value, index++, this);

        return result;
    }

    public join(
        separator: string,
        toString: (value: T) => string = (value) => `${value}`
    ): string {
        return (
            this.map(toString).combine(
                (result, value) => `${result}${separator}${value}`
            ) ?? ""
        );
    }

    public any(
        test: (value: T, index: number, stream: this) => boolean = () => true
    ): boolean {
        let index = 0;
        for (const value of this) if (test(value, index++, this)) return true;
        return false;
    }

    public none(
        test?: (value: T, index: number, stream: this) => boolean
    ): boolean {
        return !this.any(test);
    }

    public includes(value: T): boolean {
        const enclosed = this.getDeepEnclosed();
        if (isArray(enclosed)) return enclosed.includes(value);
        if (isSet(enclosed)) return enclosed.has(value);

        for (const enclosedValue of enclosed)
            if (Object.is(value, enclosedValue)) return true;
        return false;
    }

    public find(
        test: (value: T, index: number, stream: this) => boolean
    ): T | undefined {
        let index = 0;
        for (const value of this) if (test(value, index++, this)) return value;
        return undefined;
    }

    public first(): T | undefined {
        for (const value of this) return value;
        return undefined;
    }

    public last(): T | undefined {
        return last(this.getDeepEnclosed());
    }

    public count(): number {
        return count(this.getDeepEnclosed());
    }

    public flat(): T extends Iterable<infer SubT> ? Stream<SubT> : Stream<any> {
        const self = this;
        return Stream.iter(function* () {
            for (const value of self) {
                if (isIterable(value)) {
                    for (const subValue of value) yield subValue;
                } else {
                    yield value;
                }
            }
        }) as any;
    }
}
