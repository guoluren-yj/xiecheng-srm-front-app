
function commonDs (otherProps = {}) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
    ...otherProps,
    transport: {
      read: {
        url: "",
        method: "",
      },
    },
  };
}

function priceInfoDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
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
  priceInfoDs,
};