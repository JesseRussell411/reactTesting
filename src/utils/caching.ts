/**
 * Useful for lazy execution. Hence the name. Will run the given supplier function once when needed and then cache the
 * result forever. This includes errors. If an error is thrown, the same error will be thrown every time.
 * @param supplier Called once to get output.
 * @return A function which returns the output of the supplier.
 */
export function lazy<T>(supplier: () => T): () => T {
    let resolved: boolean = false;
    let rejected: boolean = false;
    let result: T | any;

    const memoized = () => {
        if (resolved) {
            return result;
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

    memoized.invalidate = () => {
        resolved = false;
        rejected = false;
    };

    return memoized;
}
