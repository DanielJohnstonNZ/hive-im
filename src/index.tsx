import { App } from "./app";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, Store, applyMiddleware} from "redux"
import {Provider} from "react-redux"

import {PeerMiddleware} from "./middleware"
import {appReducer} from "./reducers"
import {State} from "./models"
import {IActions} from "./actions"

const store: Store<State> = createStore<State>(appReducer, applyMiddleware(PeerMiddleware));

ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.getElementById("app")
);