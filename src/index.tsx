import { App } from "./app";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, Store, applyMiddleware} from "redux"
import {Provider} from "react-redux"

import {PeerMiddleware} from "./middleware"
import {appReducer} from "./reducers"
import {State} from "./models"

const store: Store<State> = createStore(appReducer, applyMiddleware(PeerMiddleware));

ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.getElementById("app")
);