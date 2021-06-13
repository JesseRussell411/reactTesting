import logo from "./logo.svg";
import "./App.css";
import Tdiv from "./Tdiv";
import Tgrid from "./Tgrid";
import Table from "./Table";
import Tr from "./Tr";
import Sflex from "./Sflex";
import Dbox from "./Dbox";

function App() {
    return (
        <div>
            <Tgrid rows={5} columnWise={true} cellPadding={0} cellSpacing={0} tdProps={{style:{border:"1px solid black", margin:"-1px"}}} >
              <span>a</span>
              <span>b</span>
              <span>c</span>
              <span>d</span>
              <span>e</span>
              <span>f</span>
              <span>g</span>
              <span>h</span>
              <span>i</span>
              <span>j</span>
              <span>k</span>
              <span>l</span>
              <span>m</span>
              <span>n</span>
              <span>o</span>
              <span>p</span>
              <span>q</span>
              <span>r</span>
              <span>s</span>
              <span>t</span>
              <span>u</span>
              <span>v</span>
              <span>w</span>
              <span>x</span>
              <span>y</span>
              <span>z</span>
            </Tgrid>
            <Table tdProps={{style:{border:"1px solid black"}}}>
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
                <Sflex style={{width:"100%"}}>
                    <Dbox width="40%" >
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
                    </Dbox>
                    <Dbox width="40%">
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
                    </Dbox>
                </Sflex>
            </Tgrid>
        </div>
    );
}

export default App;
