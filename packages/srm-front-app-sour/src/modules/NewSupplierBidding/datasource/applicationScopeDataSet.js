const storage = window.localStorage;

const TableDS = (sourceAppScopeId) => ({
  primaryKey: "dataId",
  pageSize: 20,
  selection: false,
  fields: [
    {
      fieldCode: "dataName",
      fieldType: "TEXT",
    },
    {
      fieldCode: "dataCode",
      fieldType: "TEXT",
    },
  ],
  transport: {
    read: {
      url: `/ssrc/v1/${storage.getItem("organizationId")}/source-app-scope-lines/${sourceAppScopeId}/exists/line`,
      method: "get",
    },
  },
});

export default TableDS;
