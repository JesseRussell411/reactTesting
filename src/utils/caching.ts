/**
 * Useful for lazy execution. Hence the name. Will run the given supplier function once when needed and then cache the
 * result forever. This includes errors. If an error is thrown, the same error will be thrown every time.
 * @param supplier Called once to get output.
 * @return A function which returns the output of the supplier.
 */
export function lazy<T>(supplier: () => T) {
    let resolved: boolean = false;
    let rejected: boolean = false;
    let result: T | any;

    return () => {
        if (resolved) {
            return result as T;
        } else if (rejected) {
            throw result as any;
        } else {
            try {
                result = supplier();
                resolved = true;
                return result as T;
            } catch (e: any) {
                result = e;
                rejected = true;
                throw e;
            }
        }
    };
}

/**
 * The same as lazy except, the returned function has an extra property called "invalidate" which clears the cache,
 * causing the supplier to be called again the next time its output is needed.
 * @param supplier
 */
export function cache<T>(supplier: () => T) {
    let lazySupplier = lazy(supplier);

    const memoized = () => lazySupplier();

    memoized.invalidate = () => lazySupplier = lazy(supplier);

    return memoized;
}

// so I could have given "lazy" the invalidate field, which would be SLIGHTLY better for performance and memory
// usage than this. There'd be one less layer of abstraction. but this is just more FuNcTiOnAl so I couldn't help
// myself. "lazy" can't be touched. No matter who I give it too. It can't be invalidated, it can't be broken, it's
// __IMMUTABLE__, which is the corner-stone/key-stone of functional programmer (and modern programming in my opinion).
// --jesse
