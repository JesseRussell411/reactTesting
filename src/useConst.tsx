import {useEffect, useMemo, useRef} from "react";

export default function useConst<T>(initalValue: () => T | T): T {
    return useMemo(() => initalValue instanceof Function ? (initalValue as Function)() : initalValue, []);
}