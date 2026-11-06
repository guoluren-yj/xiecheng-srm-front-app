function commonDs () {
  return {
    autoQuery: false,
    // editable: false,
    enableQuery: false,
    editable: true,
    editFlag: false,
    selection: Infinity,
    showTotalCount: false,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

export {
  commonDs,
};
