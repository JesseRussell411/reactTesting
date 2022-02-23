import {getByPlaceholderText} from "@testing-library/react";
import React, {useState, useRef, useEffect, useMemo} from "react";
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
import DerendersStateTest from "./DerendersStateTest";

import immutable from "immutable";
import Stopwatch from "./utils/Stopwatch";
import {useInterval, useLifespanInterval, useTimeout} from "./timing";
import useConst from "./useConst";
import {cache, lazy} from "./utils/caching";

const map1 = immutable.Map({a: 1, b: 2, c: 3});
const map2 = map1.set('b', 50);
console.log("m1: ", map1.get("b"))
console.log("m2: ", map2.get("b"))

const set1 = immutable.Set([1, 7, 4, 9, 11]);
console.log([...set1.add(8).keys()]);
console.log([...set1.values()]);

const toPrint = [
    <Main/>,
    <p>Hello !!! world</p>,
    <img
        style={{width: "900px"}}
        src="https://target.scene7.com/is/image/Target/GUEST_8cbce1ab-9e22-4e87-8828-397ec97fc2e6?wid=488&hei=488&fmt=pjpeg"
    />,
];

function makeToPrint(listOfComps) {
    return listOfComps.map((c, i) => {
        const props = ReactCompUtils.getProps(c);
        if (props !== undefined) {
            props.key = i;
        }
        const newComp = {...c};
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
    const [someObject, updateSomeObject] = useObject({foo: "1"});
    const [sliderValue, setSliderValue] = useState(0);
    const customers = [
        {
            CompanyName: "********",
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
            CompanyName: "*****!",
            Country: "c",
            City: "int main()",
            Address: "gcc",
            Phone: "idk",
        },
    ];

    const interval = useInterval();
    const timeout = useTimeout();


    const [showTest, setShowTest] = useState(true);

    // const {current: stopwatch} = useRef(new Stopwatch());
    //
    const stopwatch = useConst(() => new Stopwatch());
    //
    // const stopwatch = useMemo(() => new Stopwatch(), []);


    function StopwatchGui() {
        const [timeElapsed, setTimeElapsed] = useState(0);
        const [stopwatchRunning, setStopwatchRunning] = useState(stopwatch.running);
        console.log("sw:", stopwatch);

        // console.log("pre lsi");
        // console.log("ID?:", useLifespanInterval(() => {
        //     console.log("According to the lifespan interval function. The stopwatch is currently open.");
        // }, 2000));


        // const createdRef = useRef(false);
        // console.log("cr:", createdRef)
        // const intervalIDRef = useRef();
        // console.log("ii:", createdRef)
        //
        // if (!createdRef.current) {
        //     console.log("created is still false");
        //     createdRef.current = true;
        //     intervalIDRef.current = setInterval(() => {
        //         console.log(intervalIDRef.current);
        //
        //     }, 1000);
        //     console.log("created Interval:", intervalIDRef.current);
        // }

        // useEffect(() => () => {
        //     console.log("clearInterval:", intervalIDRef.current);
        //     clearInterval(intervalIDRef.current);
        // }, []);


        const {current: lifespanIntervals} = useRef([]);

        function takeInterval(id) {
            lifespanIntervals.push(id);
        }

        useLifespanInterval(() => {
            console.log(lifespanIntervals);
        }, 1000, takeInterval);

        // const interval = useInterval();
        // useEffect(() => {
        //     interval(() => console.log(8888888888888), 1000);
        // })

        // console.log("post lsi");
        useLifespanInterval(() => {
            setTimeElapsed(stopwatch.elapsedTimeInMilliseconds);
        }, 1000 / 60, takeInterval);
        return <div>
            {timeElapsed}
            <br/>
            <button
                style={{
                    width: "7em",
                    height: "2em",
                    backgroundColor: stopwatchRunning ? "pink" : "lightGreen",
                    borderRadius: "1000000000000000000000000000vh"
                }}


                onClick={() =>

                    setStopwatchRunning(stopwatch.startStop())


                }>{stopwatchRunning ? "stop" : "start"}</button>
            <br/>
            <button onClick={() => {
                stopwatch.reset();
                setStopwatchRunning(false);
            }}>reset
            </button>
            <button onClick={() => {
                stopwatch.restart();
                setStopwatchRunning(true);
            }}>restart
            </button>
            <button onClick={() => lifespanIntervals.forEach(id => clearInterval(id))}>Cancel Update Intervals</button>
        </div>
    }


    function TimingHookTest() {
        const timeout = useTimeout();
        const interval = useInterval();
        var [thingy, setThingy] = useState("");

        function stuffAndAlsoConsole(stff) {
            console.log(stff);
            setThingy(thingy + stff);
        }

        return <div>
            <button onClick={
                () =>
                    interval(() => {
                        stuffAndAlsoConsole("Laggy Hello w");
                        timeout(() => stuffAndAlsoConsole("orld!"), 500);
                    }, 2000)

            }>Timing hooks test, open console
            </button>

            {thingy}
        </div>

    }

    var [showTimingHookTest, setShowTimingHookTestSteve] = useState(false);


    const testref = useRef(false);

    useEffect(() => {
        testref.current = true;
    }, []);

    console.log("testref", testref.current);


    function toggle(current, set) {
        set(!current);
    }


    const [showStopwatch, setShowStopwatch] = useState(false);


    const [lazyRandomNumber, setLazyRandomNumber] = useState(undefined);
    const [getLazyRandomNumber] = useState(() => cache(Math.random));
    const getGetLazyRandomNumber = () => getLazyRandomNumber ?? (() => Object.assign(() => undefined, {invalidate: () => undefined}));

    // ============================================================================================================================================================================================================<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    return (
        <div style={{padding: "50px"}}>
            <h1>lazy test</h1>
            <button onClick={() => setLazyRandomNumber(getGetLazyRandomNumber()())}>lazy random number</button>
            <button onClick={() => getGetLazyRandomNumber().invalidate()}>invalidate lazy random number</button>
            {lazyRandomNumber}


            <h1>stopwatch test</h1>
            <button
                onClick={() => setShowStopwatch(!showStopwatch)}>{showStopwatch ? "Close Stopwatch" : "Open Stopwatch"}</button>
            {showStopwatch && <StopwatchGui/>}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            {/*{showTest &&*/}
            {/*<DerendersStateTest onTest={() => {*/}
            {/*    setShowTest(false);*/}
            {/*    setTimeout(() => setShowTest(true), 2000);*/}
            {/*}}/>}*/}


            <button onClick={() => toggle(showTimingHookTest, setShowTimingHookTestSteve)}
                    style={{padding: "70"}}>timing hooks test
            </button>


            {showTimingHookTest && <TimingHookTest/>}


            <DataGrid dataSource={customers}>
                <FilterRow visible={true}/>
                <HeaderFilter visible={true}/>
                <Pager
                    allowedPageSizes={[10, 25, 50, 100]}
                    showPageSizeSelector={true}
                    visible={true}
                />
                <Paging defaultPageSize={15} defaultPageIndex={0}/>
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

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <BoundedSlider
                lowerBound={110}
                upperBound={167}
                value={sliderValue}
                onChange={(newValue) => setSliderValue(newValue)}
                style={{width: "300px", margin: "20px"}}
            />
            {sliderValue}

            <br/>
            <br/>
            <br/>
            <DynamicSlider
                style={{margin: "30px", width: "50vw"}}
                defaultLowerBound={.1}
                defaultUpperBound={5}
                defaultValue={1}
                hardLowerBound={-1000}
                hardUpperBound={1000}
            />
            <br/>
            <br/>
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
