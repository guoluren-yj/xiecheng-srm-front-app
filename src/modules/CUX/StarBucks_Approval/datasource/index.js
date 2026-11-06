function approvalListDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    bodyParameter: {
      page: 0,
      size: 10
    },
    queryParameter: {
      mobFilterHideRecord: true
    },
    fields: [],
    fastQueryField: {
      fieldCode: "processDefinitionNameLike",
      fieldType: "TEXT",
      langCode: "smbl.workFlow.view.query.queryKey",
      fieldName: "流程名称/流程描述",
    },
    // 查询表单字段
    queryFields: [],
    transport: {
      read: {
        url: "/hwfp/v1/{tenantId}/activiti/task/query/new-page",
        method: "post",
      },
    },
    events: {
      beforeQuery: (ds, param, pathParams, data) => {
        data.processDefinitionNameLike = param.processDefinitionNameLike;
        data.processDescriptionLike = param.processDefinitionNameLike;
        data.page = ds.currentPage;
        data.size = ds.pageSize;
      }
    }
  };
}

export default approvalListDS;
