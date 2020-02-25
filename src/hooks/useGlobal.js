import { createStore, createHook } from "react-global-hook";
// import actions from "../constants/Actions";

const state = {
  runningTimer: null
};

const actions = {
  add(store, timer) {
    store.setState({
      runningTimer: timer
    })
  },
  remove(store) {
    store.setState({
      runningTimer: null
    })
  }
};
export default actions

// export const Store = createStore(
//   initialState,
//   actions,
//   store => {
//     store.setState({ runningTimer:  null});
//   }
// );
export const Store = createStore(state, actions);
export const useGlobal = createHook(Store)