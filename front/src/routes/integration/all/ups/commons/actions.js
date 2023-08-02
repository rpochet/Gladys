const createActions = store => {
  const actions = {
    async checkStatus(state) {
      let upsStatus = {
        configured: false,
        connected: false
      };
      try {
        upsStatus = await state.httpClient.get('/api/v1/service/ups/status');
      } finally {
        store.setState({
          ...upsStatus
        });
      }
    }
  };
  return Object.assign({}, actions);
};

export default createActions;
