function indexDs(vm) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: true,
    data: [],
    fields: vm.getColumns(),
    fastQueryField: {
      fieldCode: "docSubject",
      fieldType: "TEXT",
      langCode: "",
      fieldName: "流程名称",
    },
    // 查询表单字段
    queryFields: [

      {
        fieldCode: "modelId",
        fieldType: "SELECT",
        langCode: "",
        fieldName: "流程分类",
        lovCode: "SCUX.AUX_PROCESS_MODE_ID",
        options: {
          callback: (val) => {
            console.log(val);
          },
        },
      },
      {
        fieldCode: "id",
        fieldType: "TEXT",
        fieldName: "流程ID",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${localStorage.getItem("organizationId")}/aux-group/list`,
        method: "get",
      },
      create: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "post",
      },
      update: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "put",
      },
      destroy: {
        url: "smbl/v1/0/msg-url-mapping",
        method: "delete",
      },
    },
    setData(data) {
      this.data = data;
    },
    clear() {
      this.setData([]);
    },
  };
}

export default indexDs;
