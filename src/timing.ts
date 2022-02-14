import {useEffect, useRef} from "react";


/**
 * @returns a React-safe setTimeout function. Any timeouts created with it will be automatically cleared if the
 * component that called this hook de-renders. The function returned is identical to setTimeout in it's operation.
 * If the function is called after the component has de-rendered, an error will be thrown.
 * @param onCreation Called with the new timeout's ID every time one is created.
 */
export function useTimeout(onCreation: (id: number) => void = () => undefined) {
    const {
        /** Set of timeout IDs to clear.*/
        current: IDs
    } = useRef(new Set<number>());
    const closedRef = useRef(false);

    /** Whether the component has been de-rendered. If so, no new timeouts can be created. */
    const closed = closedRef.current;

    // cleanup
    //     clears all timeouts
    useEffect(
        () => () => {
            closedRef.current = true;
            for (const id of IDs) {
                clearTimeout(id);
            }
        },
        []
    );

    return function timeout(
        callback: (...args: any[]) => void,
        ms?: number,
        ...args: any[]
    ) {
        if (closed) throw new Error("Attempt to create react-safe timeout after the component has de-rendered.");
        const id = setTimeout(
            (...args: any[]) => {
                // Once the timeout's called, it won't need to be cleared anymore.
                // Remove its ID from the Set.
                IDs.delete(id as unknown as number);

                callback(...args);
            },
            ms,
            ...args
        );

        try {
            onCreation(id as unknown as number);
        } finally {
            IDs.add(id as unknown as number);
            return id;
        }
    };
}

/**
 * @returns a React-safe setInterval function. Any intervals created with it will be automatically cleared if the
 * component that called this hook de-renders. The function returned is identical to setInterval in it's operation.
 * If the function is called after the component has de-rendered, an error will be thrown.
 * @param onCreation Called with the new interval's ID every time one is created.
 */
export function useInterval(onCreation: (id: number) => void = () => undefined) {
    const {
        /** List of interval IDs to clear.*/
        current: IDs
    } = useRef<number[]>([]);
    const closedRef = useRef(false);

    /** Whether the component has been de-rendered. If so, no new intervals can be created. */
    const closed = closedRef.current;

    // cleanup
    //     clears all intervals
    useEffect(
        () => () => {
            closedRef.current = true;
            for (const id of IDs) {
                clearInterval(id);
            }
        },
        []
    );

    return function interval(
        callback: (...args: any[]) => void,
        ms?: number,
        ...args: any[]
    ) {
        if (closed) throw new Error("Attempt to create react-safe interval after the component has de-rendered.");
        const id = setInterval(callback, ms, ...args);

        try {
            onCreation(id as unknown as number);
        } finally {
            IDs.push(id as unknown as number);
            return id;
        }
    };
}

/**
 * Creates an interval that runs while the component is rendered.
 * The parameters are identical to setInterval's parameter's except of args.
 * @param callback: Same as the callback parameter to setInterval. The interval's behavior.
 * @param ms: Same as the ms parameter to setInterval. How often to call the callback.
 * @param onCreation In place of the args parameter is an optional callback parameter. Do to the nature of useEffect,
 * the actual creation of the interval is deferred to later after the component's first render; therefore, it is
 * impossible to return the interval's id from this hook. Instead the function provided will be called with the
 * interval's id once the interval is created.
 */
export function useLifespanInterval(
    callback: () => void,
    ms?: number,
    onCreation: (ID: number) => void = () => undefined
) {
    useEffect(() => {
        const intervalID = setInterval(callback, ms);

        try {
            onCreation(intervalID as unknown as number);
        } finally {
            return () => clearInterval(intervalID);
        }
    }, []);
}