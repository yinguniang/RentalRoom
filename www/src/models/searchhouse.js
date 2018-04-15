import * as R from "ramda";
import {searchResults} from "./utils/server.js";

export default {
	namespace : "searchhouse" ,
	state : {
		"filters" : {
			"area" : "",
			"areadetail" : "",
			"subway" : "",
			"station" : "",
			"roomAmount" : [],
			"price" : [800 , 12000],
			"floorspace" : [40 , 160],
			"floor" :[1,12],
			"heating" : [],
			"orientation" : [],
			"intelligentlock" : "",
			"nearsubway" : "",
			"updatedate" : []
		},
		"search" : "",
		"pageinfo": {
			"page": 1,
			"pagesize": 10
		},
		"sortinfo": {
			"sortby" : "id",
			"sortdirection" : 1		//1升序，-1倒序
		},
		"houses" : [],
		"total" : 0
	},
	reducers : {
		clearFilter_sync(state){
			const filters = {
				"area" : "",
				"areadetail" : "",
				"subway" : "",
				"station" : "",
				"roomAmount" : [],
				"price" : [800 , 12000],
				"floorspace" : [40 , 160],
				"floor" :[1,12],
				"heating" : [],
				"orientation" : [],
				"intelligentlock" : "",
				"nearsubway" : "",
				"updatedate" : []
			};
			return R.set(R.lensProp("filters") , filters, state);
		},
		changeFilter_sync(state , {propsname , value}){
			return R.set(R.lensProp("filters") , R.set(R.lensProp(propsname),value,state.filters) , state);
		},
		changeSearch_sync(state, {search}){
            return R.set(R.lensProp("search") , search, state);
        },
		changePage_sync(state, { page = state.pageinfo.page }) {
			return R.set(R.lensProp("pageinfo"), R.set(R.lensProp("page"), page, state.pageinfo), state);
		},
		changePagesize_sync(state , {pagesize = state.pageinfo.pagesize}){
			return R.set(R.lensProp("pageinfo"), R.set(R.lensProp("pagesize"), pagesize, state.pageinfo), state);
		},
		changeSortby_sync(state, { sortby = state.sortinfo.sortby }) {
			return R.set(R.lensProp("sortinfo"), R.set(R.lensProp("sortby"), sortby, state.sortinfo), state);
		},
		changeSortdirection_sync(state, { sortdirection = state.sortinfo.sortdirection }) {
			return R.set(R.lensProp("sortinfo"), R.set(R.lensProp("sortdirection"), sortdirection, state.sortinfo), state);
		},
		changeHouses(state , {houses}){
			return R.set(R.lensProp("houses") , houses , state);
		},
		changeTotal(state, { total }) {
			return R.set(R.lensProp("total"), total, state);
		}
	},
	effects : {
		*clearFilter(state,{put , select , call}){
			yield put({"type" : "clearFilter_sync" });
			yield put({"type" : "changeSearch_sync" ,"search" : ""});
			yield put({"type" : "changePage_sync", "page" : 1 });
			//得到当前的过滤情况,分页情况,排序情况
			var {filters,search,pageinfo,sortinfo} = yield select(state => state.searchhouse);
			//请求服务器提供houses
			var { results, total } = yield call(searchResults, filters,search, pageinfo, sortinfo);			 
			//调用同步
			yield put({"type" : "changeHouses" , "houses" : results});
			yield put({ "type": "changeTotal", total});
		},
		*changeFilter({propsname , value} , {put , select , call}){
			console.log("changeFilter"+propsname+value);
			//调用同步
			yield put({"type" : "changeFilter_sync" , propsname , value});
			if(propsname == "area"){
				yield put({"type" : "changeFilter_sync" , propsname :"areadetail", value : ""});
			}else if(propsname == "subway"){
				yield put({"type" : "changeFilter_sync" , propsname :"station", value : ""});
			}
			yield put({"type" : "changePage_sync", "page" : 1 });
			//得到当前的过滤情况,分页情况,排序情况
			var {filters,search,pageinfo,sortinfo} = yield select(state => state.searchhouse);
			//请求服务器提供houses
			var { results, total } = yield call(searchResults, filters,search, pageinfo, sortinfo);			 
			//调用同步
			yield put({"type" : "changeHouses" , "houses" : results});
			yield put({ "type": "changeTotal", total});
		},
		*changeSearch({search} , {put , select , call}){
			//调用同步
			yield put({"type" : "changeSearch_sync" ,search});
			yield put({"type" : "changePage_sync", "page" : 1 });
			//得到当前的过滤情况,分页情况,排序情况
			var {filters,pageinfo,sortinfo} = yield select(state => state.searchhouse);
			//请求服务器提供houses
			var { results, total } = yield call(searchResults,filters,search, pageinfo, sortinfo);			 
			//调用同步
			yield put({"type" : "changeHouses" , "houses" : results});
			yield put({ "type": "changeTotal", total});
		},
		//初始化
		*init(action , {put , select , call}){
			//得到当前的过滤情况,分页情况,排序情况
			var {filters,search,pageinfo,sortinfo} = yield select(state => state.searchhouse);
			//请求服务器提供houses
			var { results, total } = yield call(searchResults, filters,search,pageinfo, sortinfo);
			//改变
			yield put({"type" : "changeHouses" , "houses" : results});
			yield put({ "type": "changeTotal", total});
		},
		//用户改变分页或者排序
		*changePage({ page, pagesize}, { put, select, call }) {
			//得到现在的pagesize情况，看看用户是不是要更改pagesize
			var {pageinfo} = yield select(state => state.searchhouse);			 
			//根据用户传入的pagesize值和当前的值进行比较，如果用户更改了pagesize，此时就要将page变为1
			if(pagesize){
				//如果pagesize存在
				page = pagesize != pageinfo.pagesize ? 1 : page; 
			}
			 
			//调用同步，改变page和pagesize
			yield put({ "type": "changePage_sync", page});
			yield put({ "type": "changePagesize_sync", pagesize});
			 
			//得到当前的过滤情况,分页情况,排序情况
			var {filters,search,pageinfo,sortinfo} = yield select(state => state.searchhouse);			
			//请求服务器提供houses
			var { results, total } = yield call(searchResults, filters, search, pageinfo, sortinfo);
			//改变
			yield put({"type" : "changeHouses" , "houses" : results});
			yield put({ "type": "changeTotal", total});
		},
		//用户改变分页或者排序
		*changeSort({ sortby, sortdirection }, { put, select, call }) {
			//得到现在的pagesize情况，看看用户是不是要更改pagesize
			var { sortinfo } = yield select(state => state.searchhouse);	 
			//调用同步，改变page和sortby和sortdirection
			yield put({ "type": "changePage_sync", "page" : 1 });
			yield put({ "type": "changeSortby_sync", sortby });
			yield put({ "type": "changeSortdirection_sync", sortdirection });

			//得到当前的过滤情况,分页情况,排序情况
			var {filters,search,pageinfo,sortinfo} = yield select(state => state.searchhouse);			
			//请求服务器提供houses
			var { results, total } = yield call(searchResults, filters, search, pageinfo, sortinfo);
			//改变
			yield put({"type" : "changeHouses" , "houses" : results});
			yield put({ "type": "changeTotal", total});
		},
		//用户改变stars
		*changeStars({ id }, { put, select, call }) {
			//请求服务器增加star
			yield fetch("/stars",{
				"method" : "POST",
				"headers" : {
					"Content-Type" : "application/json"
				},
				"body" : JSON.stringify({id})
			});
		}
	}
}