import logo from "./logo.svg";
import "./App.css";
import Tdiv from "./Tdiv";
import Tgrid from "./Tgrid";
import Table from "./Table";
import Tr from "./Tr";
import Sflex from "./Sflex";
import Dbox from "./Dbox";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const containerWidth = 700;
const columnSpacing = 20;

function App() {
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                    <tr>
                        <td>a thing</td>
                    </tr>
                </tbody>
            </table>

            <Tgrid rows={10}>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
                <>another thing</>
            </Tgrid>
            <Tgrid
                rows={3}
                tdProps={{
                    style: {
                        display: "inline-block",
                        width: "200px",
                        padding: "2px",
                        border: "1px dashed black",
                    },
                }}
            >
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
                <span>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    This is an image
                </span>
            </Tgrid>

            <table>
                <tbody>
                    <tr>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                        <td
                            style={{
                                display: "inline-block",
                                width: "200px",
                                padding: "2px",
                                border: "1px solid black",
                            }}
                        >
                            <img
                                src="https://picsum.photos/600/100?image=14"
                                alt="picsum"
                                width="100%"
                            />
                            This is an image
                        </td>
                    </tr>
                </tbody>
            </table>

            <Tgrid
                columns={95}
                columnWise={true}
                tdProps={{
                    style: {
                        height: "20px",
                        width: "20px",
                        textAlign: "center",
                    },
                }}
                injectTdProps={true}
            >
                {(() => {
                    let result = [];
                    for (let i = 0; i < 100; ++i) {
                        
                            result.push(<td>a</td>);
                            result.push(<td>b</td>);
                            result.push(<td>c</td>);
                            result.push(<td>d</td>);
                            result.push(<td>e</td>);
                            result.push(<td>f</td>);
                            result.push(<td>g</td>);
                            result.push(<td>h</td>);
                            result.push(<td>i</td>);
                            result.push(<td>j</td>);
                            result.push(<td>k</td>);
                            result.push(<td>l</td>);
                            result.push(<td>m</td>);
                            result.push(<td>n</td>);
                            result.push(<td>o</td>);
                            result.push(<td>p</td>);
                            result.push(<td>q</td>);
                            result.push(<td>r</td>);
                            result.push(<td>s</td>);
                            result.push(<td>t</td>);
                            result.push(<td>u</td>);
                            result.push(<td>v</td>);
                            result.push(<td>w</td>);
                            result.push(<td>x</td>);
                            result.push(<td>y</td>);
                            result.push(<td>z</td>);
                        
                    }
                    return result;
                })()}
            </Tgrid>
            <Table tdProps={{ style: { border: "1px solid black" } }}>
                <thead>
                    <Tr>
                        <td>bob</td>
                        <th>was</th>
                    </Tr>
                    <Tr>
                        <td>here!</td>
                    </Tr>
                </thead>
                <Tr>HelloWorld!</Tr>
                <Tr>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    LOOK!<td>It's a picture!</td>
                </Tr>
            </Table>

            <Tgrid columns={3} style={{ width: "90%", margin: "auto" }}>
                <td></td>
                <td align="left" width={"800px"}>
                    <img
                        src="https://picsum.photos/600/100?image=14"
                        alt="picsum"
                        width="100%"
                    />
                    <h2>Header</h2>
                    <p style={{ textAlign: "justify" }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquipex ea
                        commodo consequat.
                    </p>
                    <p style={{ textAlign: "justify" }}>
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id estlaborum. Ut
                        enim ad minim veniam.
                    </p>
                </td>
                <td></td>
                <td></td>
                <Tgrid
                    tdProps={{
                        style: { display: "inline-block", width: "400px" },
                    }}
                >
                    <span>
                        <img
                            src="https://picsum.photos/300/100?image=15"
                            alt="picsum"
                            width="300"
                        />
                        <h2>Left column</h2>
                        <p style={{ textAlign: "justify" }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea consequat.
                        </p>
                    </span>
                    <span>
                        <img
                            src="https://picsum.photos/300/100?image=10"
                            alt="picsum"
                            width="300"
                        />
                        <h2>Right column</h2>
                        <p style={{ textAlign: "justify" }}>
                            Duis aute irure dolor in reprehenderit in voluptate
                            velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt mollit anim id est
                            laborum. Ut enim ad minim veniam.
                        </p>
                    </span>
                </Tgrid>
                <td></td>
            </Tgrid>
        </div>
    );
}

export default App;
