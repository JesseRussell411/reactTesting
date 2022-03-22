import {useRef} from "react";

export default function useConst<T>(value: T | (() => T)): T {
        return useRef(value instanceof Function ? value() : value).current;
}