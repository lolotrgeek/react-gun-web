import React, { createContext, useReducer, useContext } from 'react';

// SOURCE : https://itnext.io/react-global-state-management-with-hooks-74785024d24

/* Action Types */
const SET_DOGGIE = 'SET_DOGGIE';
const SET_TIMER = 'SET_TIMER';
const SET_ITEM = 'SET_ITEM';

/* Define a context and a reducer for updating the context */
const GlobalStateContext = createContext();

const initialState = {};

const globalStateReducer = (state, action) => {
  switch (action.type) {
    case SET_DOGGIE:
      return {
        ...state,
        doggie: { ...action.payload },
      };
    case SET_TIMER:
      return {
        ...state,
        timer: { ...action.payload },
      };
      case SET_ITEM:
        return {
          ...state,
          item: { ...action.payload },
        };
    default:
      return state;
  }
};

/* Export a component to provide the context to its children. This is used in our _app.js file */

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    globalStateReducer,
    initialState
  );

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

/* 
Default export is a hook that provides a simple API for updating the global state. 
This also allows us to keep all of this state logic in this one file
*/

const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setDoggie = ({ name, breed, isGood }) => {
    dispatch({
      type: SET_DOGGIE,
      payload: {
        name,
        breed,
        isGood
      }
    });
  };

  const setTimer = (payload) => {
    dispatch({
      type: SET_TIMER,
      payload: {key: payload[0], value : payload[1]}
    });
  };

  const setItem = (payload) => {
    dispatch({
      type: SET_ITEM,
      payload: payload
    });
  };

  return {
    setDoggie,
    doggie: { ...state.doggie },
    setTimer,
    timer: { ...state.timer },
    setItem,
    item: { ...state.item }
  };
};

export default useGlobalState;