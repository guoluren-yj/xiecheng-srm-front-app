import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.material.model.itemCode").$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("scux.material.model.itemCodeMeaning").$D("物料名称"),
        fieldCode: "itemCodeMeaning",
      },
      {
        fieldName: $T("scux.material.model.fileNum").$D("文件编号"),
        fieldCode: "fileNum",
      },
      {
        fieldName: $T("scux.material.model.gzjFlag").$D("关重件标识"),
        fieldCode: "gzjFlag",
      },
      {
        fieldName:$T("scux.material.model.itemProp").$D("物料属性"),
        fieldCode: "itemProp",
      },
      {
        fieldName: $T("scux.material.model.uomCodeMeaning").$D("单位"),
        fieldCode: "uomCodeMeaning",
      },
      {
        fieldName: $T("scux.material.model.itemWeight").$D("物料重量"),
        fieldCode: "itemWeight",
      },
      {
        fieldName: $T("scux.material.model.guding").$D("固定"),
        fieldCode: "guding",
      },
      {
        fieldName: $T("scux.material.model.hjg").$D("后加工"),
        fieldCode: "hjg",
      },
      {
        fieldName: $T("scux.material.model.yjg").$D("预加工"),
        fieldCode: "yjg",
      },
      {
        fieldName: $T("scux.material.model.gdgyts").$D("固定供应天数"),
        fieldCode: "gdgyts",
      },
      {
        fieldName: $T("scux.material.model.zxdhl").$D("最小订货量"),
        fieldCode: "zxdhl",
      },
      {
        fieldName: $T("scux.material.model.zddhl").$D("最大订货量"),
        fieldCode: "zddhl",
      },
      {
        fieldName: $T("scux.material.model.gddhl").$D("固定订货量"),
        fieldCode: "gddhl",
      },
      {
        fieldName: $T("scux.material.model.itemType").$D("物料类型"),
        fieldCode: "itemType",
      },
      {
        fieldName: $T("scux.material.model.agentCodeMeaning").$D("采购员"),
        fieldCode: "agentCodeMeaning",
      },
      {
        fieldName: $T("scux.material.model.supplier").$D("供应商信息"),
        fieldCode: "supplier",
      },
      {
        fieldName: $T("scux.material.model.jszk").$D("接收子库"),
        fieldCode: "jszk",
      },
      {
        fieldName: $T("scux.material.model.kgxx").$D("库管信息"),
        fieldCode: "kgxx",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/w1XqIfhaepGR3ic8LtCkfibFicibeMypQSXNgXJImU7HndA`,
        method: "post",
        // body:{
        //   id: "1",
        //   type:'itemLineQuery'
        // }
      },
    },
  };
}

function supplierLineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.material.model.supplierNum").$D("供应商编码"),
        fieldCode: "supplierNum",
      },
      {
        fieldName: $T("scux.material.model.supplierName").$D("供应商名称"),
        fieldCode: "supplierName",
      },
      {
        fieldName: $T("scux.material.model.stageCodeMeaning").$D("供应商生命周期"),
        fieldCode: "stageCodeMeaning",
      },
      {
        fieldName:$T("scux.material.model.supplyRatio").$D("供货比例"),
        fieldCode: "supplyRatio",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/w1XqIfhaepGR3ic8LtCkfibFicibeMypQSXNgXJImU7HndA`,
        method: "post",
        // body:{
        //   id: "1",
        //   type:'itemLineQuery'
        // }
      },
    },
  };
}

function headerDs() {
  return {
    autoQuery: false,
    editable: true,
    editFlag:true,
    autoCreate: true,
    forceValidate:true,
    fields: [
      {
        fieldName: $T("scux.material.model.paramNum").$D("参数单号"),
        fieldCode: "paramNum",
      },
      // {
      //   fieldName: this.$T("scux.material.model.companyName").$D("流程名称"),
      //   fieldCode: "companyName",
      //   formRow: 2,
      // },
      {
        fieldName: $T("scux.material.model.businessTypeMeaning").$D("业务类型"),
        fieldCode: "businessTypeMeaning",
        formRow: 2,
        // fieldType:"LOV",
        //editor:true,
        // required: true,
      },
      {
        fieldName: $T("scux.material.model.invOrganizationCodeMeaning").$D("库存组织编码"),
        fieldCode: "invOrganizationCodeMeaning",
        formRow: 3,
      },
      {
        fieldName: $T("scux.material.model.statusMeaning").$D("状态"),
        fieldCode: "statusMeaning",
        formRow: 4,
      },
      {
        fieldName: $T("scux.material.model.approveFlag").$D("是否质量/研究院审批"),
        fieldCode: "approveFlag",
        formRow: 5,
        lovCode: "SPUC.PO_ITEM_APPROVAL",
        fieldType:"SELECT",
      },
      {
        fieldName: $T("scux.material.model.createdByMeaning").$D("创建人"),
        fieldCode: "createdByMeaning",
        formRow: 6,
      },
      {
        fieldName: $T("scux.material.model.createdDate").$D("创建时间"),
        fieldCode: "createdDate",
        formRow: 7,
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/XGVEiaWUVE8VbIvc3ovW3w20KmdNsJeyFR0bGmaxEyJ0`,
        method: "get",
      },
    },
  };
}
export { headerDs, lineInfoDs, supplierLineInfoDs };
