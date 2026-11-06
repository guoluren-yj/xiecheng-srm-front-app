import { $T, SrmUtil } from "srm-mobile-ui";

function connectInfo() {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldCode: "name",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.name").$D("姓名"),
      },
      {
        fieldCode: "genderMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.gender").$D("性别"),
      },
      {
        fieldCode: "mail",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.mail").$D("邮箱"),
      },
      {
        fieldCode: "phone",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.phone").$D("手机号码"),
        render: (val, item) => <span>{item?.internationalTelCodeMeaning} | {val}</span>
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.remark").$D("备注"),
      },
      {
        fieldCode: "defaultFlag",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.defaultFlag").$D("默认"),
        render: (val) => {
          if (val) {
            return <span>{val === 1 ? $T("scux.nonCollaborativeSupplier.model.yes").$D("是") : $T("scux.nonCollaborativeSupplier.model.no").$D("否") }</span>;
          }
        }
      },
      {
        fieldCode: "enabledFlag",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.enabledFlag").$D("启用"),
        render: (val) => {
          if (val) {
            return <span>{val === 1 ? $T("scux.nonCollaborativeSupplier.model.yes").$D("是") : $T("scux.nonCollaborativeSupplier.model.no").$D("否") }</span>;
          }
        }
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-regs/contact-list/{supplierZrBasicId}`,
        method: "get",
      },
    },
  };
}
function bankInfo() {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldCode: "countryName",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.countryCode").$D("国家/地区"),
      },
      {
        fieldCode: "bankCode",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.bankCode").$D("银行代码"),
      },
      {
        fieldCode: "bankName",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.bankName").$D("银行名称"),
      },
      {
        fieldCode: "bankFirm",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.bankFirm").$D("联行行号"),
      },
      {
        fieldCode: "bankBranchName",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.bankBranchName").$D("开户行名称"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.bankAccountNum").$D("银行账号"),
      },
      {
        fieldCode: "mainBankFlag",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.mainBankFlag").$D("是否主账户"),
        render: (val) => {
          if (val) {
            return <span>{val === 1 ? $T("scux.nonCollaborativeSupplier.model.yes").$D("是") : $T("scux.nonCollaborativeSupplier.model.no").$D("否") }</span>;
          }
        }
      },
      {
        fieldCode: "enabledFlag",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.enabledFlag").$D("启用"),
        render: (val) => {
          if (val) {
            return <span>{val === 1 ? $T("scux.nonCollaborativeSupplier.model.yes").$D("是") : $T("scux.nonCollaborativeSupplier.model.no").$D("否") }</span>;
          }
        }
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-regs/bank-list/{supplierZrBasicId}`,
        method: "get",
      },
    },
  };
}

function attachmentInfo() {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldCode: "fileName",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.fileType").$D("附件类型"),
      },
      {
        fieldCode: "fileBrief",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.fileBrief").$D("附件描述"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.attachmentUuids").$D("附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}/>
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("scux.nonCollaborativeSupplier.model.remark").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-regs/file-list/{supplierZrBasicId}`,
        method: "get",
      },
    },
  };
}

function businessInfo() {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.businessNatureLists").$D("经营性质"),
        fieldCode: "businessNature",
        // fieldType: "SELECT",
        lovCode: "SPFM.BUSINESS.NATURE",
        options: {
          multiple: true,
        }
        // render: (val) => <span>{ val && val.join() }</span>
      },
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.industryType").$D("行业类型"),
        fieldCode: "industryTypeList",
        render: (val) => {
          if (val && val.length > 0) {
            const industryTypeNames = val.map((items) => items.industryName);
            return <span>{ industryTypeNames.join() }</span>;
          }
        }
      },
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.mainCategory").$D("主营品类"),
        fieldCode: "mainCategoryList",
        render: (val) => {
          if (val && val.length > 0) {
            const mainCategoryNames = val.map((items) => items.categoryName);
            return <span>{ mainCategoryNames.join() }</span>;
          }
        }
      },
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.deliveryScope").$D("送货服务范围"),
        fieldCode: "deliveryScopeMeaning",
        // render: (val) => <span>{ val && val.join() }</span>
      },
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.companyWebsite").$D("公司官网"),
        fieldCode: "companyWebsite",
      },
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.mainIdentity").$D("主要身份"),
        fieldCode: "mainIdentity",
      },
      {
        fieldName: $T("scux.nonCollaborativeSupplier.model.companyBrief").$D("公司简介"),
        fieldCode: "companyBrief",
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/hl-supplier-zr-basics/business-detail/{supplierZrBasicId}`,
        method: "get",
      },
    },
  };
}

export { connectInfo, bankInfo, attachmentInfo, businessInfo };
