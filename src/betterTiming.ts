// reactTimeout
// reactInterval
// lifespanInterval
// reactSleep


import {useEffect, useRef} from "react";
import {attempt} from "./utils/functional";

export function useLifespanInterval(action: () => void, intervalLength: number) {
    useEffect(() => {
            const id = setInterval(action, intervalLength);
            return () => clearInterval(id);
        }
        , [action, intervalLength]);
}

interface TimeoutOptions {
    onDeRender?: () => void,
    finally?: () => void,
}

export function useTimeout() {
    const timeouts = useRef(new Map<number, TimeoutOptions & { id: number }>()).current;
    const hasDeRenderedRef = useRef(false);

    useEffect(() => () => {
        hasDeRenderedRef.current = false;
        for (const timeout of timeouts.values()) {
            clearTimeout(timeout.id);
            attempt(timeout.onDeRender);
            attempt(timeout.finally);
        }
    }, [timeouts]);

    return (action?: () => void, timeoutLength?: number, options: TimeoutOptions = {}): number | undefined => {
        if (hasDeRenderedRef.current) {
            attempt(options.onDeRender);
            attempt(options.finally);
            return undefined;
        }

        const id = setTimeout(() => {
            try {
                action?.();
            } finally {
                attempt(options.finally);
                timeouts.delete(id);
            }
        }, timeoutLength);

        timeouts.set(id, {...options, id});

        return id;
    };
}

export function useInterval() {
    const intervalIDs = useRef<number[]>([]).current;
    const hasDeRenderedRef = useRef(false);

    useEffect(() => () => {
        hasDeRenderedRef.current = true;
        for (const id of intervalIDs) {
            clearInterval(id);
        }
    }, [intervalIDs])

    return (action: () => void, period?: number) => {
        if (hasDeRenderedRef.current) return undefined;

        const id = setInterval(action, period);

        intervalIDs.push(id);

        return id;
    }
}