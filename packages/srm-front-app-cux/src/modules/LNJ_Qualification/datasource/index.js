import { $T } from "srm-mobile-ui";

function materialQualificationList() {
  return {
    pageSize: 10,
    autoQuery: false,
    enableQuery: false,
    editable: false,
    showTotalCount: false,
    fields: [
      {
        fieldCode: "itemCode",
        fieldName: $T("scux.lngQualificationList.model.itemId").$D("物料编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.lngQualificationList.model.itemName").$D("物料名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemCategoryName",
        fieldName: $T("scux.lngQualificationList.model.itemCategoryName").$D("物料分类"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "specifications",
        fieldName: $T("scux.lngQualificationList.model.specifications").$D("规格"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "sellByDate",
        fieldName: $T("scux.lngQualificationList.model.sellByDate").$D("保质期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "reserveName",
        fieldName: $T("scux.lngQualificationList.model.reserveName").$D("生产商"),
        fieldType: "TEXT",
      },
    ],
  };
}

function manufacturerList() {
  return {
    pageSize: 10,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "reserveName",
        fieldName: $T("scux.lngQualificationList.model.reserveName").$D("生产商"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.lngQualificationList.model.supplierCompanyName").$D("一级经销商"),
        fieldType: "TEXT",
      },
    ],
  };
}

function distributorList() {
  return {
    pageSize: 10,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("scux.lngQualificationList.model.supplierCompanyName").$D("名称"),
        fieldType: "TEXT",
      },
    ],
  };
}

function materialAccessoriesData() {
  return {
    pageSize: 10,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "name",
        fieldName: $T("scux.lngQualificationList.model.name").$D("文件类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("scux.lngQualificationList.model.attachmentUuid").$D("文件查看"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "validDate",
        fieldName: $T("scux.lngQualificationList.model.validDate").$D("到期日"),
        fieldType: "TEXT",
      },
    ],
  };
}

function distributorSearch() {
  return {
    enableQuery: false,
    editable: false,
    showTotalCount: false,
    fields: [
      {
        fieldCode: "companyId",
        fieldName: $T("scux.lngQualificationList.model.companyId").$D("选择采购方"),
        fieldType: "LOV",
        lovCode: "SSLM.USER_AUTH.COMPANY",
        options: {
          singleQueryFields: true,
        },
      },
    ],
  };
}

function distributorHeader() {
  return {
    pageSize: 10,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "companyNum",
        fieldName: $T("scux.lngQualificationList.model.companyNum").$D("客户编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "processDate",
        fieldName: $T("scux.lngQualificationList.model.processDate").$D("注册时间"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "lastUpdateDate",
        fieldName: $T("scux.lngQualificationList.model.lastUpdateDate").$D("最近更新"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "companyTypeMeaning",
        fieldName: $T("scux.lngQualificationList.model.companyTypeMeaning").$D("类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "shortName",
        fieldName: $T("scux.lngQualificationList.model.shortName").$D("简称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "registeredCountryName",
        fieldName: $T("scux.lngQualificationList.model.registeredCountryName").$D("注册地址"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "buildDate",
        fieldName: $T("scux.lngQualificationList.model.buildDate").$D("成立日期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "legalRepName",
        fieldName: $T("scux.lngQualificationList.model.legalRepName").$D("法定代表人/负责人"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "longTermFlag",
        fieldName: $T("scux.lngQualificationList.model.longTermFlag").$D("营业期限"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxpayerTypeMeaning",
        fieldName: $T("scux.lngQualificationList.model.taxpayerTypeMeaning").$D("纳税人标识"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "businessScope",
        fieldName: $T("scux.lngQualificationList.model.businessScope").$D("经营范围"),
        fieldType: "TEXT",
      },
    ],
  };
}

function distributorSuppliercapcity() {
  return {
    pageSize: 10,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "itemCategoryName",
        fieldName: $T("scux.lngQualificationList.model.itemCategoryName").$D("品类名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemCategoryCode",
        fieldName: $T("scux.lngQualificationList.model.itemCategoryCode").$D("品类代码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplyFlag",
        fieldName: $T("scux.lngQualificationList.model.supplyFlag").$D("是否可供"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.lngQualificationList.model.itemName").$D("物料描述"),
        fieldType: "TEXT",
      },
    ],
  };
}

function distributorAttachment() {
  return {
    pageSize: 10,
    enableQuery: false,
    editable: false,
    showTotalCount: true,
    fields: [
      {
        fieldCode: "attachmentTypeMeaning",
        fieldName: $T("scux.lngQualificationList.model.attachmentType").$D("附件类型"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("scux.lngQualificationList.model.attachmentUuid").$D("附件信息"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "endDate",
        fieldName: $T("scux.lngQualificationList.model.endDate").$D("文件到期日"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "uploadDate",
        fieldName: $T("scux.lngQualificationList.model.uploadDate").$D("最后上传日期"),
        fieldType: "TEXT",
      },
    ],
  };
}

export {
  materialQualificationList, // 物料资质列表查询/物料信息
  materialAccessoriesData, // 物料资质 - 原料文件/生产商 - 资质证明
  manufacturerList, // 生产商
  distributorList, // 经销商
  distributorSearch, // 经销商 - 查询
  distributorHeader, // 经销商 - 登记信息
  distributorSuppliercapcity, // 经销商 - 供货能力
  distributorAttachment, // 经销商 - 附件信息(企业认证)
};