
import { SrmUtil, $T } from "srm-mobile-ui";
import { yesOrNoRenderer, enabledOrNotenabledRender } from "@/utils/renderer.js";
import { mergeArrs, handleMobilephone } from "@/utils/sslmUtils.js";

/**
 * 处理带’%‘号的数据
 * @param {*} val 传入值
 * @returns
 */
function handPercentSignNum(val) {
  if (Number(val)) {
    return `${(Number(val) * 100).toFixed(2)}%`;
  }
  return "--";
}

function commonDs () {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function appealReasonDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "appealReason",
        fieldName: $T("spfm.supplierRegister.button.appealReason").$D("申诉理由"),
      },
    ],
  };
}

function certificationResultDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "certificationStatusMeaning",
        fieldName: $T("sslm.certificationApproval.view.message.certificationResult").$D("三方认证结果"),
      },
      {
        fieldCode: "errorMessage",
        fieldType:"EMPTY",
      },
    ],
  };
}

function manualReviewDs(params = {}) {
  const { changeReqId } = params;
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "proposerName",
        fieldName: $T("spfm.enterpriseCertification.model.manualCheck.proposerName").$D("申请人"),
      },
      {
        fieldCode: "reason",
        fieldName: $T("spfm.enterpriseCertification.model.manualCheck.reason").$D("申请说明"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("spfm.enterpriseCertification.model.manualCheck.applyAttachment").$D("申请附件"),
      },
    ],
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/company-attestations/purchaser/${changeReqId}`,
        method: "get",
      },
    },
  };
}

function registerDs(params = {}) {
  const { domesticForeignRelation } = params;
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "companyName",
        fieldName: Number(domesticForeignRelation) !== 2 ? $T("spfm.enterprise.model.legal.companyName").$D("企业名称") : $T("spfm.contactPerson.model.contactPerson.name").$D("姓名"),
      },
      {
        fieldCode: "companyNum",
        fieldName: $T("spfm.disposeInvite.view.message.companyNum").$D("公司编码"),
      },
      {
        fieldCode: "unifiedSocialCode",
        fieldName: $T("spfm.enterprise.model.legal.unifiedSocialCode").$D("统一社会信用代码号"),
      },
      {
        fieldCode: "dunsCode",
        fieldName: $T("spfm.enterprise.model.legal.dunsCode").$D("邓白氏编码"),
      },
      {
        fieldCode: "organizingInstitutionCode",
        fieldName: $T("spfm.enterprise.model.legal.organizingInstitutionCode").$D("组织机构代码"),
      },
      {
        fieldCode: "institutionalTypeMeaning",
        fieldName: $T("spfm.supplierRegister.model.legal.institutionalType").$D("机构类型"),
      },
      {
        fieldCode: "companyTypeMeaning",
        fieldName: $T("spfm.enterprise.model.legal.companyType").$D("企业类型"),
      },
      {
        fieldCode: "registeredCountryName",
        fieldName: $T("spfm.enterprise.view.message.registeredCountryRegion").$D("注册国家/地区"),
      },
      {
        fieldCode: "registeredRegionName",
        fieldName: $T("spfm.enterprise.view.message.registeredRegionName").$D("注册地址"),
        render:(val, record) => {
          const { registeredRegionName, addressDetail } = record;
          const regionName =
            registeredRegionName && addressDetail ?
              `${registeredRegionName}${addressDetail}` :
              registeredRegionName || addressDetail;
          return regionName;
        }
      },
      {
        fieldCode: "legalRepName",
        fieldName: Number(domesticForeignRelation) === 1 ? $T("spfm.supplierRegister.model.legal.legalRepName").$D("法定代表人/负责人") : $T("spfm.supplierRegister.model.legal.personName").$D("负责人"),
      },
      {
        fieldCode: "taxpayerTypeMeaning",
        fieldName: $T("spfm.enterprise.model.legal.taxpayerType").$D("纳税人标识"),
      },
      {
        fieldCode: "registeredCapital",
        fieldName: $T("spfm.enterprise.model.legal.registeredCapitalW").$D("注册资本(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "currencyName",
        fieldName: $T("spfm.enterprise.view.message.currencyCode").$D("注册资本币种"),
      },
      {
        fieldCode: "buildDate",
        fieldName: Number(domesticForeignRelation) !== 2 ? $T("spfm.enterprise.view.message.buildDate").$D("成立日期") : $T("spfm.supplierRegister.model.legal.effectiveDateFrom").$D("证件有效期从"),
      },
      {
        fieldCode: "effectiveDateFrom",
        fieldName: $T("spfm.supplierRegister.model.legal.effectiveDateFrom").$D("证件有效期从"),
      },
      {
        fieldCode: "licenceEndDate",
        fieldName: Number(domesticForeignRelation) !== 2 ? $T("spfm.enterprise.view.message.licenceEndDate").$D("营业期限") : $T("spfm.supplierRegister.model.legal.effectiveDateTo").$D("证件有效期至"),
        render:(val, record) => {
          const { licenceEndDate, longTermFlag } = record;
          return longTermFlag === 1 ? $T("spfm.enterprise.view.message.longTerm").$D("长期") : licenceEndDate;
        },
      },
      {
        fieldCode: "effectiveDateTo",
        fieldName: $T("spfm.supplierRegister.model.legal.effectiveDateTo").$D("证件有效期至"),
      },
      {
        fieldCode: "businessScope",
        fieldName: $T("spfm.enterprise.view.message.businessScope").$D("经营范围"),
      },
      {
        fieldCode: "licenceUrl",
        fieldName: $T("sslm.supplierEntryDetail.view.option.businessLicense").$D("营业执照"),
      },
      // 个人
      {
        fieldCode: "domesticForeignRelation",
        fieldName: $T("spfm.supplierManage.view.message.registered.address").$D("注册地址"),
      },
      {
        fieldCode: "phone",
        fieldName: $T("spfm.contactPerson.model.contactPerson.mobilephone").$D("手机号码"),
      },
      {
        fieldCode: "email",
        fieldName: $T("spfm.contactPerson.model.contactPerson.mail").$D("邮箱"),
      },
      {
        fieldCode: "addressDetail",
        fieldName: $T("spfm.address.model.address.addressDetail").$D("详细地址"),
      },
      // 境外
      {
        fieldCode: "businessRegistrationNumber",
        fieldName: $T("spfm.enterprise.model.legal.businessRegistrationNumber").$D("企业注册登记号/税号"),
      },
    ],
    // queryParameter: {
    //   ...params
    // },
    // transport: {
    //   read: {
    //     url: `spfm/v1/${SrmUtil.getTenantId()}/com-basic-req/after/${changeReqId}?changeReqId=${changeReqId}&dataSource=${dataSource}`,
    //     method: "get",
    //   },
    // },
  };
}

function businessDs(params = {}) {
  const { changeReqId } = params;
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "serviceType",
        fieldName: $T("spfm.enterprise.model.business.serviceType").$D("经营性质"),
      },
      {
        fieldCode: "industryReqList",
        fieldName: $T("spfm.enterprise.model.business.industryList").$D("行业类型"),
        render:(val, record) => mergeArrs(record.industryReqList, "industryName"),
      },
      {
        fieldCode: "industryCategoryReqList",
        fieldName: $T("spfm.enterprise.model.business.industryCategoryList").$D("主营品类"),
        render:(val, record) => mergeArrs(record.industryCategoryReqList, "categoryName"),
      },
      {
        fieldCode: "serviceAreaReqList",
        fieldName: $T("spfm.enterprise.model.business.serviceAreaList").$D("送货服务范围"),
        render:(val, record) => mergeArrs(record.serviceAreaReqList, "serviceAreaMeaning"),
      },
      {
        fieldCode: "website",
        fieldName: $T("spfm.enterprise.model.business.website").$D("公司官网"),
      },
      {
        fieldCode: "description",
        fieldName: $T("spfm.enterprise.model.business.description").$D("公司简介"),
      },
      {
        fieldCode: "logoUrl",
        fieldName: $T("sslm.supplierEntryDetail.view.title.companyLogo").$D("公司logo"),
      },
    ],
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-business-req/after/${changeReqId}`,
        method: "get",
      },
    },
  };
}

function contactDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "name",
        fieldName: $T("spfm.contactPerson.model.contactPerson.name").$D("姓名"),
      },
      {
        fieldCode: "mobilephone",
        fieldName: $T("spfm.contactPerson.model.contactPerson.mobilephone").$D("手机号码"),
        render:(val, record) => handleMobilephone(val, record)
      },
      {
        fieldCode: "mail",
        fieldName: $T("spfm.contactPerson.model.contactPerson.mail").$D("邮箱"),
      },
      {
        fieldCode: "telephone",
        fieldName: $T("spfm.contactPerson.model.contactPerson.telephone").$D("固定电话"),
      },
      {
        fieldCode: "department",
        fieldName: $T("spfm.contactPerson.model.contactPerson.department").$D("部门"),
      },
      {
        fieldCode: "position",
        fieldName: $T("spfm.contactPerson.model.contactPerson.position").$D("职位"),
      },
      {
        fieldCode: "description",
        fieldName: $T("hzero.common.remark").$D("备注"),
      },
      {
        fieldCode: "defaultFlag",
        fieldName: $T("spfm.contactPerson.model.contactPerson.default").$D("默认"),
        render: (val) => yesOrNoRenderer(val),
      },
      {
        fieldCode: "enabledFlag",
        fieldName: $T("spfm.contactPerson.model.contactPerson.enabled").$D("启用"),
        render: (val) => yesOrNoRenderer(val),
      },
    ],
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-contacts-reqs/no-basic`,
        method: "get",
      },
    },
  };
}

function addressDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "countryName",
        fieldName: $T("spfm.address.model.address.countryId").$D("国家/地区"),
      },
      {
        fieldCode: "regionPathName",
        fieldName: $T("spfm.address.model.address.regionId").$D("省/市/区"),
      },
      {
        fieldCode: "addressDetail",
        fieldName: $T("spfm.address.model.address.addressDetail").$D("详细地址"),
      },
      {
        fieldCode: "postCode",
        fieldName: $T("spfm.address.model.address.postCode").$D("邮政编码"),
      },
      {
        fieldCode: "description",
        fieldName: $T("spfm.address.model.address.description").$D("地址备注"),
      },
      {
        fieldCode: "enabledFlag",
        fieldName: $T("hzero.common.status").$D("状态"),
        render: (val) => enabledOrNotenabledRender(val),
      },
    ],
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-address-reqs/no-basic`,
        method: "get",
      },
    },
  };
}

function bankDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "bankCountryName",
        fieldName: $T("spfm.bank.model.bank.bankCountry").$D("国家/地区"),
      },
      {
        fieldCode: "bankCode",
        fieldName: $T("spfm.bank.model.bank.bankInternalCode").$D("银行（国际）代码"),
      },
      {
        fieldCode: "bankName",
        fieldName: $T("sslm.supplierEntryDetail.model.bank.bankName").$D("银行名称"),
      },
      {
        fieldCode: "bankFirm",
        fieldName: $T("spfm.bank.model.bank.bankFirm").$D("联行行号"),
      },
      {
        fieldCode: "bankBranchName",
        fieldName: $T("spfm.bank.model.bank.bankBranchName").$D("开户行名称"),
      },
      {
        fieldCode: "bankAccountName",
        fieldName: $T("spfm.bank.model.bank.bankAccountName").$D("账户名称"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldName: $T("spfm.bank.model.bank.bankAccountNum").$D("银行账号"),
      },
      {
        fieldCode: "accountNatureMeaning",
        fieldName: $T("spfm.bank.model.bank.accountNature").$D("账户性质"),
      },
      {
        fieldCode: "accountPurposeMeaning",
        fieldName: $T("spfm.bank.model.bank.accountPurpose").$D("账户用途"),
      },
      {
        fieldCode: "currencyName",
        fieldName: $T("spfm.bank.model.bank.currencyName").$D("币种"),
      },
      {
        fieldCode: "paymentTypeIdMeaning",
        fieldName: $T("spfm.bank.model.model.bank.paymentType").$D("付款方式"),
      },
      {
        fieldCode: "enabledFlag",
        fieldName: $T("hzero.common.status").$D("状态"),
        render: (val) => enabledOrNotenabledRender(val),
      },
      {
        fieldCode: "masterFlag",
        fieldName: $T("spfm.bank.model.bank.masterFlag").$D("是否主账户"),
        render: (val) => yesOrNoRenderer(val),
      },
      {
        fieldCode: "remark",
        fieldName: $T("hzero.common.remark").$D("备注"),
      },
    ],
    queryParameter: {
      ...params
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-bank-acc-reqs/no-basic`,
        method: "get",
      },
    },
  };
}

function invoiceDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "invoiceHeader",
        fieldName: $T("spfm.enterprise.model.invoice.invoiceHeader").$D("发票头"),
      },
      {
        fieldCode: "taxRegistrationNumber",
        fieldName: $T("spfm.enterprise.model.invoice.taxRegistrationNumber").$D("税务登记号"),
      },
      {
        fieldCode: "depositBank",
        fieldName: $T("spfm.enterprise.model.invoice.depositBank").$D("开户行"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldName: $T("spfm.enterprise.model.invoice.bankAccountNum").$D("开户行账号"),
      },
      {
        fieldCode: "taxRegistrationAddress",
        fieldName: $T("spfm.enterprise.model.invoice.taxRegistrationAddress").$D("税务登记地址"),
      },
      {
        fieldCode: "taxRegistrationPhone",
        fieldName: $T("spfm.enterprise.model.invoice.taxRegistrationPhone").$D("税务登记电话"),
      },
      {
        fieldCode: "receiver",
        fieldName: $T("sslm.common.model.invoice.taker").$D("收票人"),
      },
      {
        fieldCode: "receiveMail",
        fieldName: $T("spfm.enterprise.model.invoice.receiveMail").$D("收票人邮箱"),
      },
      // {
      //   name: 'internationalTelCode',
      //   lookupCode: 'HPFM.IDD',
      //   defaultValue: '+86',
      // },
      {
        fieldCode: "receivePhone",
        fieldName: $T("spfm.enterprise.model.invoice.receivePhone").$D("收票人手机号"),
        render:(val, record) => handleMobilephone(val, record)
      },
      {
        fieldCode: "receiveAddress",
        fieldName: $T("sslm.common.model.invoice.ticketAddress").$D("收票地址"),
      },
    ],
    queryParameter: {
      ...params,
      companyId: -1,
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-invoice-reqs/all`,
        method: "get",
      },
    },
  };
}

function financeDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "year",
        fieldName: $T("spfm.finance.model.financeInfo.year").$D("年份"),
      },
      {
        fieldCode: "currencyName",
        fieldName: $T("spfm.common.model.currency").$D("币种"),
      },
      {
        fieldCode: "totalAssets",
        fieldName: $T("spfm.finance.model.financeInfo.totalAssets").$D("企业总资产(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "totalLiabilities",
        fieldName: $T("spfm.finance.model.financeInfo.totalLiabilities").$D("总负债(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "currentAssets",
        fieldName: $T("spfm.finance.model.financeInfo.currentAssets").$D("流动资产(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "currentLiabilities",
        fieldName: $T("spfm.finance.model.financeInfo.currentLiabilities").$D("流动负债(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "revenue",
        fieldName: $T("spfm.finance.model.financeInfo.revenue").$D("营业收入(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "netProfit",
        fieldName: $T("spfm.finance.model.financeInfo.netProfit").$D("净利润(万)"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "assetLiabilityRatio",
        fieldName: $T("spfm.finance.model.financeInfo.assetLiabilityRatio").$D("资产负债率"),
        render:(val) => handPercentSignNum(val),
      },
      {
        fieldCode: "currentRatio",
        fieldName: $T("spfm.finance.model.financeInfo.currentRatio").$D("流动比率"),
        render:(val) => handPercentSignNum(val),
      },
      {
        fieldCode: "totalAssetsEarningsRatio",
        fieldName: $T("spfm.finance.model.financeInfo.totalAssetsEarningsRatio").$D("总资产收益率"),
        render:(val) => handPercentSignNum(val),
      },
      {
        fieldCode: "remark",
        fieldName: $T("hzero.common.remark").$D("备注"),
      },
    ],
    queryParameter: {
      ...params,
      companyId: -1,
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-finance-reqs/all`,
        method: "get",
      },
    },
  };
}

function attachmentDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "attachmentTypeMerge",
        fieldName: $T("entity.attachment.type").$D("附件类型"),
        render:(val, record) => {
          const { attachmentTypeMeaning, subAttachmentMeaning } = record;
          if (attachmentTypeMeaning && subAttachmentMeaning) {
            return `${attachmentTypeMeaning}/${subAttachmentMeaning}`;
          }
          return attachmentTypeMeaning || subAttachmentMeaning;
        }
      },
      {
        fieldCode: "description",
        fieldName: $T("entity.attachment.description").$D("附件描述"),
      },
      {
        fieldCode: "endDate",
        fieldName: $T("spfm.attachment.model.attachment.endDate").$D("文件到期日"),
        render:(val) => SrmUtil.dateFormat(val)
      },
      {
        fieldCode: "longEffectiveFlag",
        fieldName: $T("sslm.supplierInform.model.attachment.longEffective").$D("是否长期有效"),
        render: (val) => yesOrNoRenderer(val),
      },
      {
        fieldCode: "uploadDate",
        fieldName: $T("spfm.attachment.model.attachment.uploadDate").$D("最后更新时间"),
        render:(val) => SrmUtil.dateFormat(val)
      },
      {
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("entity.attachment.upload").$D("附件上传"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("hzero.common.remark").$D("备注"),
      },
    ],
    queryParameter: {
      ...params,
      companyId: -1,
    },
    transport: {
      read: {
        url: `spfm/v1/${SrmUtil.getTenantId()}/com-attachment-reqs/no-basic`,
        method: "get",
      },
    },
  };
}

function otherDs(params = {}) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[],
    queryParameter: {
      ...params,
      customizeUnitCode: "SSLM.ENT_CER_PRO.OTHER_INFO",
    },
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/sup-change-others/identify/getSupChangeOther`,
        method: "get",
      },
    },
  };
}

function inviteDs(params = {}) {
  const { changeReqId } = params;
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    selection: Infinity,
    showTotalCount: false,
    fields:[
      {
        fieldCode: "autoPartnerFlag",
        fieldName: $T("spfm.enterpriseCertification.model.invite.autoPartner").$D("是否发送邀约"),
        render: (val) => yesOrNoRenderer(val),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("spfm.enterpriseCertification.model.invite.inviteCompany").$D("邀约公司"),
        render:(val, record) => {
          const { companyList, companyName } = record;
          if (companyList) {
            if (Array.isArray(companyList)) {
              const companyStr = companyList.map((n) => n.companyName).join(",");
              return companyStr;
            }
            return companyName;
          }
          return companyName;
        }
      },
      {
        fieldCode: "remark",
        fieldName: $T("spfm.enterpriseCertification.model.invite.inviteRemark").$D("邀约说明"),
      },
    ],
    queryParameter: {
      ...params,
    },
    transport: {
      read: {
        url: `sslm/v1/${SrmUtil.getTenantId()}/firm-entering-parents/${changeReqId}`,
        method: "get",
      },
    },
  };
}

export {
  commonDs,
  appealReasonDs,
  certificationResultDs,
  manualReviewDs,
  registerDs,
  businessDs,
  contactDs,
  addressDs,
  bankDs,
  invoiceDs,
  financeDs,
  attachmentDs,
  otherDs,
  inviteDs,
};
