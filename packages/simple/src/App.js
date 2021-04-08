import logo from "./logo.svg";
import "./App.css";
import SimpleComponent from "./simple";
import { useState } from "react";
function App() {
  const [show, showSet] = useState(true);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button
          onClick={() => {
            showSet(!show);
          }}
        >
          toggle simple
        </button>
        <br />
        {show ? <SimpleComponent></SimpleComponent> : null}
      </header>
    </div>
  );
}

export default App;
