import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createEpicMiddleware } from "redux-observable";
import { epic } from "./actions";
import Reducer from "./reducer";
import App from "./App";
import "./index.css";

function logger({ getState }) {
  return next => action => {
    console.log("will dispatch", action);
    let returnValue = next(action);
    console.log("state after dispatch", getState());
    return returnValue;
  };
}

const epicMiddleware = createEpicMiddleware(epic);

let store = createStore(
  Reducer,
  applyMiddleware(epicMiddleware),
  applyMiddleware(logger)
);

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById("root")
);
