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
    const [state, setState] = useState([object]);

    const update = async (x) => {
        if (typeof x === "function") {
            await x();
        }
        else if (x instanceof Object) {
            for (const field in x) {
                state[0][field] = x[field];
            }
        }
        setState([state[0]]);
    };

    return [state[0], update];
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
                    updateSomeObject({foo:"peanuts", bar:"stuff"})
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
