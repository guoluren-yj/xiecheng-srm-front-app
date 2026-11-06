import { $T } from "srm-mobile-ui";

function approvalListDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 20,
    editable: true,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    bodyParameter: {
      page: 0,
      size: 20
    },
    queryParameter: {
      mobFilterHideRecord: true,
      processInstanceId: null
    },
    enableSelect: (record) => record.get("batchFlag") === 1,
    fields: [],
    fastQueryField: {
      fieldCode: "processDefinitionNameLike",
      fieldType: "TEXT",
      fieldName: $T("smbl.workFlow.view.query.queryKey").$D("流程名称/流程描述/流程标识"),
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
        data.processInstanceId = param.processDefinitionNameLike;
      }
    }
  };
}

export default approvalListDS;
