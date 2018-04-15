import * as R from "ramda";
import {fetchServer} from "./utils/server.js";

export default {
  namespace: "updatehouse",
  state: {
    nowid : 1,
    houseinfo : {},
    stepCurrent : 2,
    step1: {
      owner: "",
      estate: "",
      areaanddetail: [],
      subwayandstation: [],
      roomAmount: 3,
      price: 800,
      floorspace: 40,
      floor: 1,
      heating: "",
      orientation: "",
      intelligentlock: "",
      nearsubway: "",
      updatedate: Date.parse(new Date())
    },
    step2: {
      rooms: [],
      otherviews: []
    },
    step3: {
      files: []
    }
  },
  reducers: {
    //改变changeId
		changeId(state , action){
			return R.set(R.lensProp("nowid") , action.nowid , state);
		},
		//改变houseinfo
		changeHouseinfo(state , action){
			return R.set(R.lensProp("houseinfo") , action.houseinfo , state);
    },
    //改变Step1
    changeStep1(state, {values}) {
      return R.set(R.lensProp("step1"), values, state);
    },
    //改变stepCurrent
    changeStepCurrent(state, {stepCurrent}) {
      return R.set(R.lensProp("stepCurrent"), stepCurrent, state);
    },
    //改变step2的rooms
    changeRooms(state, {roomArr}) {
      return R.set(R.lensProp("step2"), R.set(R.lensProp("rooms"),roomArr,state.step2), state);
    },
    //改变step2的otherviews
    changeOtherviews(state, {otherviewsArr}) {
      return R.set(R.lensProp("step2"), R.set(R.lensProp("otherviews"),otherviewsArr,state.step2), state);
    },
    //改变step3的files
    changeFiles(state, {files}) {
      return R.set(R.lensProp("step3"), R.set(R.lensProp("files"),files,state.step3), state);
    }
  },
  effects: {
    //初始化
		*init(action , {put , call , select}){
      //改变nowid，根据acation携带的载荷改变nowid
      let id = action.nowid
      yield put({"type":"changeId","nowid":id});
      yield put({"type":"changeStepCurrent","stepCurrent":1});
			//发出请求，请求房子信息
			const {result} = yield fetch("/houseinfo/" + id).then(response=>response.json());
			//改变houseinfo
			yield put({"type":"changeHouseinfo","houseinfo":result});
    },
    *update(action, {put, select}) {
      const {step1, step2, step3 ,nowid} = yield select(state => state.updatehouse);
      yield fetch("/updatehouse", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          nowid,
          step1,
          step2,
          step3
        })
      });
      yield put({"type":"changeStepCurrent","stepCurrent":1});
    }
  }
};