import * as R from "ramda";

export default {
	namespace : "hpricetends" ,
	state : {		
		"pie" : [],
		"hot" : []
	},
	reducers : {
		changePie_sync(state , {pie}){
			return R.set(R.lensProp("pie") , pie , state);
		},
		changeHot_sync(state , {hot}){
			return R.set(R.lensProp("hot") , hot , state);
		}
	},
	effects : {
		//初始化
		*init(action , {put }){
            //请求服务器提供折线图的数据
			var {results} = yield fetch("/pie").then(response=>response.json());
			var {hot} = yield fetch("/stars").then(response=>response.json());
            //改变
			yield put({"type" : "changePie_sync" , "pie" : results});
			yield put({"type" : "changeHot_sync" , hot});
		}
	}
}