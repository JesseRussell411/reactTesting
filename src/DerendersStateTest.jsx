import React, { useState, useEffect } from "react";
import { useInterval, useTimeout } from "./timing";

export default function DerendersStateTest(props) {
    const [test, setTest] = useState(42);
    const setTimeout = useTimeout();
    const setInterval = useInterval();

    function useRunTest() {
        setInterval(() => {setTest(test+1); console.log(test)}, 1000);
        (props.onTest ?? (() => { }))();
    }


    return (
        <button onClick={useRunTest}>test derenders state</button>
    );
}