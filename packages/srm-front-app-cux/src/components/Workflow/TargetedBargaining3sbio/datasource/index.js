import { $T } from "srm-mobile-ui";

export function headerDs() {
  return {
    autoQuery: false,
    fields: [
      {
        fieldCode: "documentNum",
        fieldName: $T("scux.TargetedBargaining3sbio.model.documentNum").$D("单据编号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "title",
        fieldName: $T("scux.TargetedBargaining3sbio.model.title").$D("标题"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "createByName",
        fieldName: $T("scux.TargetedBargaining3sbio.model.createByName").$D("创建人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("scux.TargetedBargaining3sbio.model.creationDate").$D("创建时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyIdMeaning",
        fieldName: $T("scux.TargetedBargaining3sbio.model.companyIdMeaning").$D("公司"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "categoryMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.TargetedBargaining3sbio.model.category").$D("定向议价申请类别"),
      },
      {
        fieldCode: "supplierCompanyIdMeaning",
        fieldName: $T("scux.TargetedBargaining3sbio.model.supplierCompanyIdMeaning").$D("供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierContacts",
        fieldName: $T("scux.TargetedBargaining3sbio.model.supplierContacts").$D("供应商联系人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierContactPhoneNum",
        fieldName: $T("scux.TargetedBargaining3sbio.model.supplierContactPhoneNum").$D("供应商联系人手机号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "validDateTo",
        fieldName: $T("scux.TargetedBargaining3sbio.model.validDateTo").$D("定向议价供应商审批有效期至"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "annualTotalAmount",
        fieldName: $T("scux.TargetedBargaining3sbio.model.annualTotalAmount").$D("年度预估总额"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "currencyMeaning",
        fieldName: $T("scux.TargetedBargaining3sbio.model.currencyMeaning").$D("币种"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "materialCategoryMeaning",
        fieldName: $T("scux.TargetedBargaining3sbio.model.materialCategory").$D("物料品类"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "reason",
        fieldName: $T("scux.TargetedBargaining3sbio.model.reason").$D("申请原因"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "notes",
        fieldName: $T("scux.TargetedBargaining3sbio.model.notes").$D("备注"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("scux.TargetedBargaining3sbio.model.attachmentUuid").$D("附件"),
        fieldType: "UPLOAD",
        bucketName: "private-bucket",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/pXXLibHEa2wrrcwsRJdClExV70QoiaYfXbjGFft4WFiaxia4ias5QYlY7zLjOeYp3uK3j`,
        method: "get",
      },
    },
  };
}

