
export class Linqable<T> implements Iterable<T>{
    constructor(iterable: Iterable<T>) {
        this.iterable = iterable;
    }

    public readonly iterable: Iterable<T>;

    public [Symbol.iterator](){
        return this.iterable[Symbol.iterator]();
    }

    public map<R>(callback: (item: T, index: number) => R): Linqable<R> {
        const self = this;
        const iterable = {
            [Symbol.iterator]: function* () {
                let index = 0;
                for (const item of self.iterable) {
                    yield callback(item, index++);
                }
            }
        }

        return new Linqable<R>(iterable);
    }

    public forEach(callback: (item: T, index: number) => void): Linqable<T> {
        const self = this;
        let index = 0;
        for(const item of self.iterable){
            callback(item, index++);
        }

        return this;
    }

    public reduce<R>(callback: (previousResult: R, currentItem: T, index: number) => R, initialValue?: R): R{
        let result = initialValue;
        let index = 0;
        for(const item of this.iterable){
            result = callback(result, item, index++);
        }
        return result;
    }

    public filter(callback: (item: T, index: number) => boolean): Linqable<T>{
        const self = this;
        const iterable = {
            [Symbol.iterator]: function* () {
                let index = 0;
                for (const item of self.iterable) {
                    if (callback(item, index++)){
                        yield item;
                    }
                }
            }
        }

        return new Linqable<T>(iterable);
    }

    public sort(comparator: (a: T, b: T) => number): Linqable<T>{
        // TODO there's probably some efficient algorithm for this
        const array = [...this];
        array.sort(comparator);
        return new Linqable<T>(array);
    }
}






