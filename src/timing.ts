import {useEffect, useRef} from "react";


/**
 * @callback HookTimeout
 * @param handler
 * @param timeout
 * @param args
 * @returns The id of the created timeout or undefined if the component has unmounted.
 */

/**
 * Creates a react-safe version of setTimeout. All timeouts created will be cleared if the component unmounts.
 * @returns {HookTimeout}
 */
export function useTimeout() {
    const {current: ids} = useRef(new Set<number>());
    const closedRef = useRef(false);

    useEffect(() => () => {
        closedRef.current = true;

        for (const id of ids) {
            clearTimeout(id);
        }
    }, [ids]);

    return (handler: (...args:any) => void, timeout?:number, ...args:any[]) => {
        if (closedRef.current) return undefined;

        const modifiedHandler = (...args:any[]) => {
            clearTimeout(id);
            handler(...args);
        }

        const id = window.setTimeout(modifiedHandler, timeout, ...args);

        ids.add(id);

        return id;
    }
}

/**
 * @callback HookInterval
 * @param handler
 * @param timeout
 * @param args
 * @returns The id of the created interval or undefined if the component has unmounted.
 */

/**
 * Creates a react-safe version of setInterval. All intervals created will be cleared if the component unmounts.
 * @returns {HookInterval}
 */

export function useInterval() {
    const {current: ids} = useRef<number[]>([]);
    const closedRef = useRef(false);

    useEffect(() => () => {
        closedRef.current = true;

        for (const id of ids) {
            clearTimeout(id);
        }
    }, [ids]);

    return (handler: (...args:any) => void, timeout?:number, ...args:any[]) => {
        if (closedRef.current) return undefined;

        const id = window.setInterval(handler, timeout, ...args);

        ids.push(id);

        return id;
    }
}

export function useLifespanInterval(handler: () => void, timeout?:number){
    useEffect(() => {
        const id = setInterval(handler, timeout);
        return () => clearInterval(id);
    })
}

