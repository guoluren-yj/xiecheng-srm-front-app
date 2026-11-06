function rfxItemsDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    fields: [],
  };
}

// 基本信息
function basicDS() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    editFlag: false,
    selection: Infinity,
    queryParameter: {},
    fields: [],
  };
}

export { rfxItemsDS, basicDS };
