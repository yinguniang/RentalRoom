import * as R from "ramda";

export default {
  namespace: "uploadhouse",
  state: {
    step1: {
      owner: {value: "", errors: []},
      estate: {value: "", errors: []},
      areaanddetail: {value: [], errors: []},
      subwayandstation: {value: [], errors: []},
      roomAmount: {value: "", errors: []},
      price: {value: [], errors: []},
      floorspace: {value: [], errors: []},
      floor: {value: [], errors: []},
      heating: {value: [], errors: []},
      orientation: {value: [], errors: []},
      intelligentlock: {value: "", errors: []},
      nearsubway: {value: "", errors: []},
      updatedate: ""
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
    changeStep1(state, {propname, value}) {
      return R.set(R.lensProp("step1"), R.set(R.lensProp(propname), value, state.step1), state);
    },
    changeStep2(state, {roomArr}) {
      return R.set(R.lensProp("step2"), R.set(R.lensProp("rooms"), roomArr, state.step2), state);
    },
    changeStep2_otherviews(state, {otherviewsArr}) {
      return R.set(R.lensProp("step2"), R.set(R.lensProp("otherviews"), otherviewsArr, state.step2), state);
    },
    changeStep3(state, {arr}) {
      //深克隆
      let files = R.clone(state.step3.files);
      files = files.concat(arr);
      return R.set(R.lensProp("step3"), R.set(R.lensProp("files"), files, state.step3), state);
    },
    changeStep3OneFileName(state, {filename, changedfilename}) {
      return R.set(R.lensProp("step3"), R.set(R.lensProp("files"), state.step3.files.map(item => {
        if (item.filename == filename) {
          return {
            ...item,
            changedfilename
          };
        }
        return item;
      }), state.step3), state);
    }
  },
  effects: {
    * addhouse(action, {put, select}) {
      const {step1, step2, step3} = yield select(state => state.uploadhouse);
      yield fetch("/addhouse", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          step1,
          step2,
          step3
        })
      });
    }
  }
};