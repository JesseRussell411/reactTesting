import { getByPlaceholderText } from "@testing-library/react";
import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";

import Main from "./Main";
import ReactCompUtils from "./ReactCompUtils";
import BoundedSlider from "./BoundedSlider";
import DynamicSlider from "./DynamicSlider";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import DataGrid, {
    Column,
    FilterRow,
    HeaderFilter,
    Pager,
    Paging,
} from "devextreme-react/data-grid";

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
/**
 * @callback Update
 * Let react know that the object has changed and that it should re-render whatever is using it.
 * @param {Function | Object | undefined} x optional function or object passed to update to modify the object and update in one go.
 * If undefined: updates the state.
 * If Object: iterates through the object's fields, modifying each one in the state, then updates the state.
 * If function: runs the function (with await incase of async), then recursively calls update again on the result.
 */
/**
 * Useful for efficiently storing and updating a reference type like an Object or an Array in a state hook.
 * @param {Object} obj The object to store.
 * @returns {[Object, Update]} An array with 2 fields:
 * 0: The object that is stored (same instance as the object given to the hook)
 * 1: the update function. Call this after modifying the value to update it in the eyes of react.
 */
function useObject(obj) {
    // stores object in array as a reference.
    const [state, setState] = useState([obj]);

    const update = async (x) => {
        if (x instanceof Function) {
            // recursive call on result
            update(await x());
            return;
        } else if (x instanceof Object && x !== state[0]) {
            for (const field in x) {
                state[0][field] = x[field];
            }
        }
        setState([state[0]]);
    };

    return [state[0], update];
}

async function sleep(timeInMilliseconds) {
    await new Promise((resolve, reject) =>
        setTimeout(resolve, timeInMilliseconds)
    );
}
const App = () => {
    const componentRef = useRef();
    const [someObject, updateSomeObject] = useObject({ foo: "1" });
    const [sliderValue, setSliderValue] = useState(0);
    const customers = [
        {
            CompanyName: "asshole",
            Country: "butlandia",
            City: "assville",
            Address: "1234 asshole dr.",
            Phone: "420-420-6969",
        },
        {
            CompanyName: "didn't",
            Country: "chairland",
            City: "sitville",
            Address: "876 seat dr.",
            Phone: "9999999999",
        },
        {
            CompanyName: "include",
            Country: "stuff-land",
            City: "whatever-town",
            Address: "0000-idk",
            Phone: "0000000000",
        },
        {
            CompanyName: "a",
            Country: "apple?",
            City: "iphone",
            Address: "18 no headphone jack rd.",
            Phone: "na",
        },
        {
            CompanyName: "download",
            Country: "russia",
            City: "russia",
            Address: "123 russia dv.",
            Phone: "934252-3425-6345-234-23423-facc3",
        },
        {
            CompanyName: "for",
            Country: "planet earth",
            City: "usa",
            Address: "texas",
            Phone: "934243234",
        },
        {
            CompanyName: "the",
            Country: "japan",
            City: "china",
            Address: "korea",
            Phone: "999999999999",
        },
        {
            CompanyName: "customers.js",
            Country: "javascript",
            City: "node",
            Address: "342523 idk-streat",
            Phone: "45235235235",
        },
        {
            CompanyName: "file!",
            Country: "c#",
            City: "public static void Main(string[] args)",
            Address: ".net",
            Phone: "5",
        },
        {
            CompanyName: "What",
            Country: "java",
            City: "public static void main(String[] args)",
            Address: "java",
            Phone: "??????",
        },
        {
            CompanyName: "a",
            Country: "c++",
            City: "int main()",
            Address: "gcc",
            Phone: "cpp20",
        },
        {
            CompanyName: "prick!",
            Country: "c",
            City: "int main()",
            Address: "gcc",
            Phone: "idk",
        },
    ];

    return (
        <div style={{ padding: "50px" }}>
            <DataGrid dataSource={customers}>
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <Pager
                    allowedPageSizes={[10, 25, 50, 100]}
                    showPageSizeSelector={true}
                    visible={true}
                />
                <Paging defaultPageSize={15} defaultPageIndex={0} />
                <Column
                    dataField="CompanyName"
                    caption="company name"
                    dataType="string"
                    alignment="left"
                />
                <Column
                    dataField="Country"
                    caption="county"
                    dataType="string"
                    alignment="left"
                />
                <Column
                    dataField="City"
                    caption="city"
                    dataType="string"
                    alignment="left"
                />
                <Column
                    dataField="Address"
                    caption="address"
                    dataType="string"
                    alignment="left"
                />
                <Column
                    dataField="Phone"
                    caption="phone"
                    dataType="string"
                    alignment="left"
                />
            </DataGrid>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <BoundedSlider
                lowerBound={110}
                upperBound={167}
                value={sliderValue}
                onChange={(newValue) => setSliderValue(newValue)}
                style={{ width: "300px", margin: "20px" }}
            />
            {sliderValue}

            <br />
            <br />
            <br />
            <DynamicSlider
                style={{ margin: "30px", width:"50vw"}}
                defaultLowerBound={.1}
                defaultUpperBound={5}
                defaultValue={1}
                hardLowerBound={-1000}
                hardUpperBound={1000}
            />
            <br />
            <br />
            <p>{someObject.foo}</p>
            <button
                onClick={() =>
                    updateSomeObject(() => (someObject.foo = "peanuts"))
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
