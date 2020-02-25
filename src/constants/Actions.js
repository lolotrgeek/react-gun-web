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