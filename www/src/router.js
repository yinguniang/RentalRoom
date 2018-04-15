import React from "react";
import { Router, Route, hashHistory, IndexRedirect, Redirect  } from 'react-router'
import { syncHistoryWithStore, routerReducer , ConnectedRouter } from 'react-router-redux'

import App from "./containers/App.js";
import HpriceTrends from "./components/HpriceTrends/HpriceTrends.js";
import Picshow from "./components/Picshow/Picshow.js";
import SearchHouse from "./components/SearchHouse/SearchHouse.js";
import UpdateHouse from "./components/UpdateHouse/UpdateHouse.js";
import Uploadhouse from "./components/Uploadhouse/Uploadhouse.js";

export default ({ history }) => {
    return <ConnectedRouter history={history}>
        <div>
            <Route path="/" exact component={SearchHouse} />
            <Route path="/searchhouse" exact component={SearchHouse} />
            <Route path="/hot" exact component={HpriceTrends} />
            <Route path="/details/:id" exact component={Picshow} />
            <Route path="/addhouse" exact component={Uploadhouse} />
            <Route path="/updatehouse/:id" exact component={UpdateHouse} />
        </div>
    </ConnectedRouter>
}