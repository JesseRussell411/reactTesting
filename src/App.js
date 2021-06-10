import logo from './logo.svg';
import './App.css';
import Tdiv from "./Tdiv";
import Tgrid from "./Tgrid";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Tdiv>
          <Tgrid columns={3} columnWise={true}>
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
        </Tdiv>
      </header>
    </div>
  );
}

export default App;
