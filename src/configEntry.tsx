import React from "react";
import ReactDom from "react-dom";
import { Config } from "./Config";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDom.render(<Config />, document.getElementById("config"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
