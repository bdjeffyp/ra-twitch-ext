import { initializeIcons } from "@fluentui/react";
import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import nonce from "./createNonce";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

// Add FabricConfig to the Window global
declare global {
  interface Window {
    FabricConfig: object;
  }
}

// Set nonce value for Fluent UI library
window.FabricConfig = {
  mergeStyles: {
    cspSettings: { nonce: nonce },
  },
};

initializeIcons();
ReactDom.render(<App nonce={"nonce"} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
