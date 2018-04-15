import * as R from "ramda";

export default {
  namespace: "picshow",
  state: {
    nowid: 0,
    nowidx: 0,
    nowalbum: 0,
    houseinfo: {},
    houselike: []
  },
  reducers: {
    //改变houseinfo
    changeId(state, action) {
      return R.set(R.lensProp("nowid"), action.nowid, state);
    },
    //改变album
    changeNowalbum(state, action) {
      return R.set(R.lensProp("nowalbum"), action.nowalbum, state);
    },
    //改变nowidx
    changeNowidx(state, action) {
      return R.set(R.lensProp("nowidx"), action.nowidx, state);
    },
    //改变houseinfo
    changeHouseinfo(state, action) {
      return R.set(R.lensProp("houseinfo"), action.houseinfo, state);
    },
    //改变houselike
    changeHouselike(state, action) {
      return R.set(R.lensProp("houselike"), action.houselike, state);
    }
  },
  effects: {
    //初始化
    * init(action, { put, call, select }) {
      //先得到idx,得到nowalbum
      const { nowidx, nowalbum } = yield select(state => state.picshow);
      //发出请求，请求房子信息
      const { result } = yield fetch("/houseinfo/" + action.nowid).then(response => response.json());
      //发出请求，请求相似房子
      const { houselike } = yield fetch("/houselike/" + action.nowid).then(response => response.json());
      //改变nowid，根据acation携带的载荷改变nowid
      console.log(action.nowid);
      yield put({ "type": "changeId", "nowid": action.nowid });
      if (nowalbum != 0) {
        //改变nowalbum
        yield put({ "type": "changeNowalbum", "nowalbum": 0 });
      }
      if (nowidx != 0) {
        //改变nowidx
        yield put({ "type": "changeNowidx", "nowidx": 0 });
      }  
      //houseinfo
      yield put({ "type": "changeHouseinfo", "houseinfo": result });
      //改变houselike
      yield put({ "type": "changeHouselike", houselike });

    },
    //改变相册
    * changealbum(action, { put, call, select }) {
      //先得到idx,得到nowalbum
      const { nowidx, nowalbum } = yield select(state => state.picshow);
      if (nowalbum != action.nowalbum) {
        //改变相册
        yield put({ "type": "changeNowalbum", "nowalbum": action.nowalbum });
        //将序号归0
        yield put({ "type": "changeNowidx", "nowidx": action.nowidx || 0 });
      }else{
        //只设置序号
        yield put({ "type": "changeNowidx", "nowidx": action.nowidx || 0 });
      }
    },
    //下一张
    * goNext(action, { put, call, select }) {
      //先得到idx,得到nowalbum,houseinfo
      const { nowidx, nowalbum, houseinfo } = yield select(state => state.picshow);
      if (Number(nowalbum) >= 0) {
        //判断是不是到这个图集的头了
        if (nowidx < houseinfo.rooms[nowalbum].images.length - 1) {
          //没有到头，加1
          yield put({ "type": "changeNowidx", "nowidx": nowidx + 1 });
        } else if (nowalbum < houseinfo.rooms.length - 1) {
          //图集加1,改变相册
          yield put({ "type": "changeNowalbum", "nowalbum": nowalbum + 1 });
          //将序号归0
          yield put({ "type": "changeNowidx", "nowidx": 0 });
        } else if (nowalbum == houseinfo.rooms.length - 1) {
          //改变相册为otherviews
          yield put({ "type": "changeNowalbum", "nowalbum": "otherviews" });
          //将序号归0
          yield put({ "type": "changeNowidx", "nowidx": 0 });
        }
      } else if (nowalbum === "otherviews") {
        //判断是不是到这个图集的头了
        if (nowidx < houseinfo.otherviews.length - 1) {
          //没有到头，加1
          yield put({ "type": "changeNowidx", "nowidx": nowidx + 1 });
        } else {
          //改变相册为room1
          yield put({ "type": "changeNowalbum", "nowalbum": 0 });
          //将序号归0
          yield put({ "type": "changeNowidx", "nowidx": 0 });
        }
      }
    },
    //上一张
    * goPrev(action, { put, call, select }) {
      //先得到idx,得到nowalbum,houseinfo
      const { nowidx, nowalbum, houseinfo } = yield select(state => state.picshow);
      if (Number(nowalbum) >= 0) {
        //判断是不是到这个图集的头了
        if (nowidx > 0) {
          //没有到头，减1
          yield put({ "type": "changeNowidx", "nowidx": nowidx - 1 });
        } else if (nowalbum > 0) {
          let _nowalbum = nowalbum - 1;
          //图集减1,改变相册
          yield put({ "type": "changeNowalbum", "nowalbum": _nowalbum });
          //将序号归为最后一张图
          yield put({ "type": "changeNowidx", "nowidx": houseinfo.rooms[_nowalbum].images.length - 1 });
        } else if (nowalbum == 0) {
          //改变相册为otherviews
          yield put({ "type": "changeNowalbum", "nowalbum": "otherviews" });
          //将序号归为最后一张图
          yield put({ "type": "changeNowidx", "nowidx": houseinfo.otherviews.length - 1 });
        }
      } else if (nowalbum === "otherviews") {
        //判断是不是到这个图集的头了
        if (nowidx > 0) {
          //没有到头，减1
          yield put({ "type": "changeNowidx", "nowidx": nowidx - 1 });
        } else {
          let _nowalbum = houseinfo.rooms.length - 1;
          //改变相册为最后一个卧室
          yield put({ "type": "changeNowalbum", "nowalbum": _nowalbum });
          //将序号归0
          yield put({ "type": "changeNowidx", "nowidx": houseinfo.rooms[_nowalbum].images.length - 1 });
        }
      }
    }
  }
};