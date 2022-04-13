import { useEffect, useRef } from "react";

/**
 * React safe version of setTimeout.
 * @returns The id of the created timeout or undefined if the component has unmounted.
 */
export type HookSetTimeout = (
    handler: () => void,
    timeout?: number
) => number | undefined;

/**
 * Creates a react-safe version of setTimeout. All timeouts created will be cleared if the component unmounts.
 * Once that component has unmounted, no new timeouts can be made.
 */
export function useTimeout(): HookSetTimeout {
    const { current: ids } = useRef(new Set<number>());
    const isUnMountedRef = useRef(false);

    useEffect(
        () => () => {
            isUnMountedRef.current = true;

            for (const id of ids) {
                clearTimeout(id);
            }
        },
        [ids]
    );

    return (handler, timeout) => {
        // Don't set the timeout if the component has unmounted.
        if (isUnMountedRef.current) return undefined;

        // Add ids.delete to the handler so that it's id is removed from the set once it runs
        // since a timeout handler can't run more than once like an interval handler.
        const selfClearHandler = () => {
            ids.delete(id);
            handler();
        };

        const id = window.setTimeout(selfClearHandler, timeout);
        ids.add(id);

        return id;
    };
}

/**
 * React safe version of setInterval.
 * @returns The id of the created interval or undefined if the component has unmounted.
 */
export type HookSetInterval = (
    handler: () => void,
    interval?: number
) => number | undefined;

/**
 * Creates a react-safe version of setTimeout. All timeouts created will be cleared if the component unmounts.
 * Once that component has unmounted, no new timeouts can be made.
 */
export function useInterval(): HookSetInterval {
    const { current: ids } = useRef<number[]>([]);
    const isUnMountedRef = useRef(false);

    useEffect(
        () => () => {
            isUnMountedRef.current = true;

            for (const id of ids) {
                clearTimeout(id);
            }
        },
        [ids]
    );

    return (handler, interval) => {
        // Don't set the interval if the component has unmounted.
        if (isUnMountedRef.current) return undefined;

        const id = window.setInterval(handler, interval);
        ids.push(id);

        return id;
    };
}

/**
 * Runs the given handler function at the given interval for the lifespan of the component.
 */
export function useLifespanInterval(handler: () => void, interval?: number) {
    useEffect(() => {
        const id = setInterval(handler, interval);
        return () => clearInterval(id);
    });
}
