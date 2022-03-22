/**
 * The same as lazy except the returned function has an extra property called "invalidate" which clears the cache,
 * causing the supplier to be called again the next time its output is needed.
 * @param supplier
 */
export function cachedExpression<T>(supplier: () => T) {
    let cache: (() => T) | null = null;

    const memoized = () => {
        if (cache != null) return cache();

        try {
            const result = supplier();
            cache = () => result;
            return result;
        } catch (error) {
            cache = () => {
                throw error;
            }
            throw error;
        }
    };

    memoized.invalidate = () => {
        cache = null;
    }

    return memoized;
}

/**
 * Useful for lazy execution. Hence the name. Will run the given supplier function once when needed and then cache the
 * result forever. This includes errors. If an error is thrown, the same error will be thrown every time.
 * @param original Called once to get output.
 * @return A function which returns the output of the supplier.
 */
export function lazy<T>(original: () => T) {
    let getResult = () => {
        try {
            const result = original();
            getResult = () => result;
            return result;
        } catch (e) {
            getResult = () => {
                throw e;
            }
            throw e;
        }
    }

    return () => getResult();
}


