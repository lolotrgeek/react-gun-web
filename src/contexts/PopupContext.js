import React from "react";

let PopupContext = React.createContext();

let initialState = false;

let reducer = (state, action) => {
  switch (action.type) {
    case "close":
      return initialState;
    case "open":
      return true;
    default:
      return initialState;
  }
};

function PopupContextProvider(props) {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  return <PopupContext.Provider value={value}>{props.children}</PopupContext.Provider>;
}

let PopupContextConsumer = PopupContext.Consumer;

export { PopupContext, PopupContextProvider, PopupContextConsumer };
