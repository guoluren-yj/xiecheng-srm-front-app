import { SrmUtil, $T } from "srm-mobile-ui";

function getFields() {
  return [
    {
      fieldName: $T("scux.subjectMappingTable.model.status").$D("状态"),
      fieldCode: "statusMeaning",
    },
    {
      fieldName: $T(
        "scux.subjectMappingTable.model.invOrganizationCode",
      ).$D("仓库编码"),
      fieldCode: "invOrganization",
    },
    {
      fieldName: $T(
        "scux.subjectMappingTable.model.invOrganizationName",
      ).$D("仓库"),
      fieldCode: "invOrganizationName",
    },
    {
      fieldName: $T("scux.subjectMappingTable.model.companyCode").$D(
        "公司主体编码",
      ),
      fieldCode: "company",
    },
    {
      fieldName: $T("scux.subjectMappingTable.model.companyName").$D(
        "公司主体",
      ),
      fieldCode: "companyName",
    },
    {
      fieldName: $T("scux.subjectMappingTable.model.updatedByName").$D(
        "最后更新人",
      ),
      fieldCode: "updatedByName",
    },
    {
      fieldName: $T("scux.subjectMappingTable.model.lastUpdateDate").$D(
        "最后更新时间",
      ),
      fieldCode: "lastUpdateDate",
    },
  ];
}

function subjectLineDataSet(approveNum) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    queryParameter: {
      approveNum,
      queryType: "page",
      page: 0,
      size: 10,
    },
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/oyJJw3YjBf4LW4w1gzcPrQ1SCNZr1PUlh9icODPpdOOo`,
        method: "get",
      },
    },
    fields: getFields(),
  };
}

function subjectLineDetailDataSet() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    fields: getFields(),
  };
}

export { subjectLineDataSet, subjectLineDetailDataSet };