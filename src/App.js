import { getByPlaceholderText } from "@testing-library/react";
import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import Main from "./Main";
import ReactCompUtils from "./ReactCompUtils";

const toPrint = [
    <Main />,
    <p>Hello !!! world</p>,
    <img
        style={{ width: "900px" }}
        src="https://target.scene7.com/is/image/Target/GUEST_8cbce1ab-9e22-4e87-8828-397ec97fc2e6?wid=488&hei=488&fmt=pjpeg"
    />,
];
function makeToPrint(listOfComps) {
    return listOfComps.map((c, i) => {
        const props = ReactCompUtils.getProps(c);
        if (props !== undefined) {
            props.key = i;
        }
        const newComp = { ...c };
        return c;
    });
}

function useObject(object) {
    // stores object in array because it's reference, like object, but might be more efficient.
    const [state, setState] = useState([object]);

    /**
     * Let react know that the object has changed and that is should re-render whatever is using it.
     * @param {Function | Object | undefined} x optional function or object passed to update to modify the object and update in one go.
     * If undefined: updates the state.
     * If Object: iterates through the object's fields, modifying each one in the state, then updates the state.
     * If function: runs the function (with await incase of async), then recursively calls update again on the result.
     */
    const update = async (x) => {
        if (x instanceof Function) {
            // recursive call on result
            update(await x());
            return;
        }
        else if (x instanceof Object && x !== state[0]) {
            for (const field in x) {
                state[0][field] = x[field];
            }
        }
        setState([state[0]]);
    };

    return [state[0], update];
}

async function sleep(timeInMilliseconds){
    await new Promise((resolve, reject) => setTimeout(resolve, timeInMilliseconds));
}
const App = () => {
    const componentRef = useRef();
    const [someObject, updateSomeObject] = useObject({ foo: "1" });
    console.log(someObject);

    return (
        <div>
            <p>{someObject.foo}</p>
            <button
                onClick={() =>
                    updateSomeObject(() => someObject.foo = "peanuts")
                }
            >
                click for peanuts
            </button>
            <ReactToPrint
                trigger={() => <button>Print this out!</button>}
                content={() => componentRef.current}
            />
            <div ref={componentRef}>{toPrint}</div>
        </div>
    );
};

export default App;
