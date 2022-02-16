import { useEffect, useRef, useState } from "react";

// The hooks in this file exist to automate the safety measure of clearing intervals and timeouts in react components
// when they de-render. Something that normally requires storing the id somewhere and adding a useEffect cleanup
// function to clear it later.

/**
 * @returns a React-safe setTimeout function. Any timeouts created with it will be automatically cleared if the
 * component that called this hook de-renders. The function returned is identical to setTimeout in it's operation.
 * If the function is called after the component has de-rendered, an error will be thrown.
 * @param onCreation Called with the new timeout's ID every time one is created.
 */
export function useTimeout(onCreation: (id: number) => void = () => undefined) {
    const {
        /** Set of timeout IDs created by this hook. */
        current: IDs,
    } = useRef(new Set<number>());

    /** Where to store the components de-rendered status. */
    const closedRef = useRef(false);

    /** Whether the component has been de-rendered. If so, no new timeouts can be created. */
    const closed = closedRef.current;

    // Cleanup for clearing all timeouts.
    useEffect(
        () => () => {
            // Raise the closed status so that no new timeouts can be made.
            closedRef.current = true;

            // Clear all timeouts created with this hook.
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
        // Check if the component has de-rendered.
        if (closed) {
            throw new Error(
                "Attempt to use useTimeout's timeout function after the component has de-rendered."
            );
        }

        // Create the timeout and collect its id.
        const id = (setTimeout(
            (...args: any[]) => {
                // Remove this timeout's id from the set of created Timeouts:
                // Once the timeout's called, it won't need to be cleared anymore.
                IDs.delete(id);

                // Run the actual callback for the timeout.
                callback(...args);
            },
            ms,
            ...args
        ) as unknown) as number;

        // Run the onCreation callback.
        try {
            onCreation(id);
        } catch (e) {
            console.error(e);
        }

        // Add the id to the set.
        IDs.add(id);

        return id;
    };
}

/**
 * @returns a React-safe setInterval function. Any intervals created with it will be automatically cleared if the
 * component that called this hook de-renders. The function returned is identical to setInterval in it's operation.
 * If the function is called after the component has de-rendered, an error will be thrown.
 * @param onCreation Called with the new interval's ID every time one is created.
 */
export function useInterval(
    onCreation: (id: number) => void = () => undefined
) {
    const {
        /** List of interval IDs created by this hook. */
        current: IDs,
    } = useRef<number[]>([]);

    /** Where to store the components de-rendered status. */
    const closedRef = useRef(false);

    /** Whether the component has been de-rendered. If so, no new intervals can be created. */
    const closed = closedRef.current;

    // Cleanup for clearing all intervals.
    useEffect(
        () => () => {
            // Raise the closed status so no new intervals can be made.
            closedRef.current = true;

            // Clear all intervals created by this hook.
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
        // Check if the component has de-rendered.
        if (closed) {
            throw new Error(
                "Attempt to use useInterval's interval function after the component has de-rendered."
            );
        }

        // Create the interval and collect its id.
        const id = setInterval(callback, ms, ...args) as unknown as number;

        // Run the onCreation callback
        try {
            onCreation(id);
        } catch (e) {
            console.error(e);
        }

        // Add the id to the list.
        IDs.push(id);

        return id;
    };
}

// *The amount of duplicate code between these hooks is unfortunate but there's
// just enough difference between them that a second-order factory function
// would be too confusing in my opinion.

/**
 * Creates an interval that only runs during the lifespan of the component.
 * The parameters are identical to setInterval's parameter's except for args.
 * @param callback Same as the callback parameter to setInterval. The interval's behavior.
 * @param ms Same as the ms parameter to setInterval. How often to call the callback.
 * @param [onCreation] In place of the args parameter is an optional callback parameter. Do to the nature of useEffect,
 * the actual creation of the interval is deferred to later after the component's first render; therefore, it is
 * impossible to return the interval's id from this hook. Instead the function provided will be called with the
 * interval's id once the interval is created.
 *
 * @returns The interval's id; however, due to the nature of useEffect, this id will be undefined initially and won't be
 * updated to the interval's actual id until the interval is actually created. See param: onCreation.
 */
export function useLifespanInterval(
    callback: () => void,
    ms?: number,
    onCreation: (ID: number) => void = () => undefined
) {
    // Something to return from the hook. This will eventually contain the interval's id.
    const [returnedID, setReturnedID] = useState<number>();

    // Create and destroy the interval.
    useEffect(() => {
        // Create the interval and collect its id.
        const intervalID = setInterval(callback, ms) as unknown as number;

        // Set the returned state to the, now created, interval's id.
        setReturnedID(intervalID);

        // Call the onCreation callback.
        try {
            onCreation(intervalID);
        } catch (e) {
            console.error(e);
        }

        // return the cleanup function which will clear the interval when the component de-renders.
        return () => clearInterval(intervalID);
    }, []);

    return returnedID;
}
