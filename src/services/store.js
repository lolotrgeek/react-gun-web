import { createStore, combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';

const appInitialState = {
  heartBeat: 0,
  project: [],
  timer: [],
};

const SET_HEART_BEAT = 'SET_HEART_BEAT';
const SET_PROJECT = 'SET_PROJECT';
const SET_TIMER = 'SET_TIMER';
export const setHeartBeat = createAction(SET_HEART_BEAT);
export const setProject = createAction(SET_PROJECT);
export const setTimer = createAction(SET_TIMER);

const App = handleActions(
  {
    [SET_HEART_BEAT]: (state, { payload }) => ({
      ...state,
      heartBeat: payload,
    }),
    [SET_PROJECT]: (state, { payload }) => ({
      ...state,
      project: payload,
    }),
    [SET_TIMER]: (state, { payload }) => ({
      ...state,
      timer: payload,
    }),
  },
  appInitialState,
);

const rootReducer = combineReducers({
  App,
});

const configureStore = () => createStore(rootReducer);
export const store = configureStore();