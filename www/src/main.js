import React from "react";
import dva from "dva";
import logger from "redux-logger";

import App from "./containers/App.js";
import searchhouse from "./models/searchhouse.js";
import hpricetends from "./models/hpricetends.js";
import uploadhouse from "./models/uploadhouse.js";
import updatehouse from "./models/updatehouse.js";
import picshow from "./models/picshow.js";

import router from "./router.js";

//创建app
const app = dva({
	onAction : logger
});

//路由
app.router(router);
//model
app.model(searchhouse);
app.model(hpricetends);
app.model(uploadhouse);
app.model(updatehouse);
app.model(picshow);

//挂载
app.start("#example");