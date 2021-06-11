import logo from "./logo.svg";
import "./App.css";
import Tdiv from "./Tdiv";
import Tgrid from "./Tgrid";

function App() {
    return (
        <div>
            <Tgrid width="100%">
                <td align="left">
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
                <Tgrid rows={1}>
                    <td>
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
                    </td>
                    <td>
                        &nbsp;&nbsp;
                    </td>
                    <td>
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
                    </td>
                </Tgrid>
            </Tgrid>
        </div>
    );
}

export default App;
