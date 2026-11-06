/*
 * @Date: 2024-03-05 10:31:02
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { serviceTypeList, businessTypeList } from "./utils";
import { getRedFlag, renderRedNode, renderUpdateTag } from "./utils";
import { yesOrNoRenderer } from "@/utils/renderer";

// 基础信息columns
export const getBasicsColumns = () => [
  {
    fieldCode: "changeReqNumber",
    fieldName: $T("sslm.supplierInform.model.supplierInform.applicationNum").$D("申请单号"),
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:400 }}>{item ? item.changeReqNumber || "-" : "-"}</span>
      <span slot="right" >
        {item.reqStatusMeaning ?
          <SrmTag
            type="success"
          >
            {item.reqStatusMeaning}
          </SrmTag> :
          ""
        }
      </span>
    </SrmListHeader>,
  },
  {
    fieldCode: "changeLevelMeaning",
    fieldName: $T("sslm.enterpriseInform.model.application.latitudeChange").$D("变更维度"),
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.companyNum").$D("企业编码"),
    fieldCode: "companyNum",
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.companyName").$D("企业名称"),
    fieldCode: "companyName",
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.creator").$D("创建人"),
    fieldCode: "createUserRealName",
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.submitDate").$D("提交日期"),
    fieldCode: "submitDate",
    render: (val) => val && String(val).substring(0, 10),
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.creationDate").$D("创建日期"),
    fieldCode: "creationDate",
    render: (val) => val && String(val).substring(0, 10),
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.changeRemark").$D("变更备注"),
    fieldCode: "remark",
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.partnerCompanyNum").$D("采购方公司编码"),
    fieldCode: "partnerCompanyNum",
    visible: (val, item) => item.changeLevel === "COMPANY",
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.partnerCompanyName").$D("采购方公司名称"),
    fieldCode: "partnerCompanyName",
    visible: (val, item) => item.changeLevel !== "PLATFORM",
  },
  {
    fieldCode: "attachmentUuid",
    fieldType: "UPLOAD",
    fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
  },
  {
    fieldName: $T("sslm.enterpriseInform.model.application.approvalOpinion").$D("审批意见"),
    fieldCode: "oldApprovalOpinion",
    code: "approvalOpinion",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code:col.code }), ...col, }));

// 登记信息
export const getRegisterColums = (domesticForeignRelation, handlePreview, viewChange = false, isAllPlatform) => [
  {
    fieldCode: "domesticForeignRelation",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.address").$D("认证地区"),
    code:"domesticForeignRelationMeaning",
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:400 }}>{renderRedNode({ name: "domesticForeignRelation", record:item, code:"domesticForeignRelationMeaning" })}</span>
      {!viewChange && <span slot="right" >{renderUpdateTag(item)}</span>}
    </SrmListHeader>,
  },
  {
    fieldCode: "companyName",
    fieldName: domesticForeignRelation === 2 ?
      $T("sslm.enterpriseInform.model.personal.name").$D("姓名") :
      $T("sslm.enterpriseInform.view.model.companyInfo.companyName").$D("企业名称"),
  },
  {
    fieldCode: "shortName",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.shortName").$D("企业简称"),
    visible: isAllPlatform,
  },
  {
    fieldCode: "unifiedSocialCode",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.socialCode")
      .$D("统一社会信用代码"),
    visible: domesticForeignRelation === 1,
  },
  {
    fieldCode: "businessRegistrationNumber",
    fieldName: $T("sslm.enterpriseInform.model.companyInfo.registrationNumber")
      .$D("企业注册登记号/税号"),
    visible: domesticForeignRelation === 0,
  },
  {
    fieldCode: "dunsCode",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.dunsCode").$D("邓白氏编码"),
    visible: domesticForeignRelation !== 2,
  },
  {
    fieldCode: "legalRepName",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.legalRepName")
      .$D("法定代表人/负责人"),
    visible: domesticForeignRelation !== 2,
  },
  {
    fieldCode: "organizingInstitutionCode",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.organizingCode")
      .$D("组织机构代码"),
    visible: domesticForeignRelation === 1,
  },
  {
    fieldCode: "institutionalType",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.institutionalType")
      .$D("机构类型"),
    visible: domesticForeignRelation === 1,
    code:"institutionalTypeMeaning",
  },
  {
    fieldCode: "companyType",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.companyType").$D("企业类型"),
    visible: domesticForeignRelation === 1,
    code:"companyTypeMeaning",
  },
  {
    fieldCode: "registeredCountryId",
    fieldName: $T("spfm.enterprise.view.message.registeredCountryRegion").$D("注册国家/地区"),
    code:"registeredCountryName",
  },
  {
    fieldCode: "regionPathName",
    fieldName: domesticForeignRelation === 2 ?
      $T("sslm.enterpriseInform.model.personal.registeredId").$D("省市") :
      $T("sslm.enterpriseInform.view.model.companyInfo.ProvincialAndUrbanAreas")
        .$D("省/市/区"),
  },
  {
    fieldCode: "addressDetail",
    fieldName: domesticForeignRelation === 2 ?
      $T("sslm.enterpriseInform.model.personal.addressDetail").$D("联系地址") :
      $T("sslm.enterpriseInform.view.model.companyInfo.registeredAddress")
        .$D("注册地址"),
  },
  {
    fieldCode: "registeredCapital",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.regCapital").$D("注册资本(万)"),
    visible: domesticForeignRelation !== 2,
  },
  {
    fieldCode: "currencyCode",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.currencyCode")
      .$D("注册资本币种"),
    visible: domesticForeignRelation !== 2,
    code:"currencyName",
  },
  {
    fieldCode: "taxpayerType",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.taxpayerType").$D("纳税人标识"),
    visible: domesticForeignRelation === 1,
    code:"taxpayerTypeMeaning",
  },
  {
    fieldCode: "licenceEndDate",
    fieldName: $T("sslm.enterpriseInform.view.registInform.businessTerm").$D("营业期限"),
    visible: domesticForeignRelation === 1,
  },
  {
    fieldCode: "buildDate",
    fieldName: $T("sslm.enterpriseInform.view.model.companyInfo.buildDate").$D("成立日期"),
    visible: domesticForeignRelation !== 2,
  },
  {
    fieldCode: "longTermFlag",
    fieldName: $T("sslm.enterpriseInform.view.message.longTerm").$D("长期"),
    visible: domesticForeignRelation === 1,
    render:(val, item, field) => {
      const redFlag = getRedFlag({ name: field.fieldCode, record:item });
      return <span style={{ color: redFlag && "red" }}>
        {item.longTermFlag ?
          $T("hzero.common.status.yes").$D("是") :
          $T("hzero.common.status.no").$D("否")}
      </span>;
    },
  },
  {
    fieldCode: "businessScope",
    fieldName: $T("sslm.enterpriseInform.view.registInform.businessScope").$D("经营范围"),
    visible: domesticForeignRelation !== 2,
  },
  {
    fieldCode: "licenceUrl",
    fieldName: domesticForeignRelation === 1 ?
      $T("spfm.enterprise.view.message.businessLicense").$D("营业执照") :
      $T("spfm.enterprise.view.message.registrationCertificate").$D("企业登记证件"),
    visible: domesticForeignRelation !== 2,
    render:(val) => val ? <srm-button style="font-size: 12px;font-weight:400" plain onClick={() => handlePreview(val)}>{$T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")}</srm-button> : "-"
  },
  {
    fieldCode: "phone",
    fieldName: $T("sslm.enterpriseInform.model.personal.mobilePhone").$D("手机号"),
    visible: domesticForeignRelation === 2,
  },
  {
    fieldCode: "email",
    fieldName: $T("sslm.enterpriseInform.model.personal.email").$D("邮箱"),
    visible: domesticForeignRelation === 2,
  },
].map((col) => {
  const { visible = true, ...others } = col;
  return {
    render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code:col.code }),
    visible: (val, item, field) => {
      if (visible && viewChange) {
        return getRedFlag({ name: field.fieldCode, record:item, code:col.code });
      }
      return visible;
    },
    ...others,
  };
});

// 业务信息
export const getBusinessColums = (handlePreview, viewChange = false, isAllPlatform, domesticForeignRelation) => [
  {
    fieldCode: "businessType",
    fieldName: $T("sslm.enterpriseInform.view.model.business.businessType").$D("主要身份"),
    render: (val, item) => {
      if (item) {
        const { saleFlag, purchaseFlag, businessCheckTypeFlag } = item;
        const list = [
          saleFlag ? "sale" : null,
          purchaseFlag ? "purchase" : null,
        ].filter(Boolean);
        const displayList = [];
        list.forEach((n) => {
          displayList.push(businessTypeList()[n]);
        });
        const renderText = displayList.join("、");
        const renderDom = <div
          style={{ color: businessCheckTypeFlag === "UPDATE" && "red" }}
        >{renderText}</div>;
        if (isAllPlatform) {
          return <SrmListHeader showOpenTag={false} >
            <SrmTooltip placement="top" title={renderText} >
              {renderDom}
            </SrmTooltip>
            {!viewChange && <span slot="right" >{renderUpdateTag(item)}</span>}
          </SrmListHeader>;
        }
        return <div
          style={{ color: businessCheckTypeFlag === "UPDATE" && "red" }}
        >{renderText}</div>;
      }
    },
    visible: (val, item) => {
      if (isAllPlatform) {
        if (viewChange) {
          const flag = item.businessCheckTypeFlag === "UPDATE";
          return flag;
        }
        return true;
      }
      return false;
    },
  },
  {
    fieldCode: "serviceType",
    fieldName: $T("sslm.enterpriseInform.view.model.business.serviceType").$D("经营性质"),
    render: (val, item) => {
      const businessNatureList = [
        item.manufacturerFlag ? "manufacturer" : null,
        item.traderFlag ? "trader" : null,
        item.servicerFlag ? "servicer" : null,
        item.agentFlag ? "agent" : null,
        item.integrationFlag ? "integration" : null,
        item.contractorFlag ? "contractor" : null,
        item.dealerFlag ? "dealer" : null,
      ].filter(Boolean);
      const displayList = [];
      businessNatureList.forEach((n) => {
        displayList.push(serviceTypeList()[n]);
      });
      const renderText = displayList.join("、");
      const renderDom =
        <div
          style={{
            fontWeight: 400,
            color:
            (item.manufacturerFlagFlag === "UPDATE" ||
            item.traderFlagFlag === "UPDATE" ||
            item.servicerFlagFlag === "UPDATE" ||
            item.agentFlagFlag === "UPDATE" ||
            item.integrationFlagFlag === "UPDATE" ||
            item.contractorFlagFlag === "UPDATE" ||
            item.dealerFlagFlag === "UPDATE") &&
            "red",
          }}
        >
          {renderText}
        </div>;
      if (isAllPlatform) {
        return renderDom;
      }
      return <SrmListHeader showOpenTag={false} >
        <SrmTooltip placement="top" title={renderText} >
          {renderDom}
        </SrmTooltip>
        {!viewChange && <span slot="right" >{renderUpdateTag(item)}</span>}
      </SrmListHeader>;
    },
    visible: (val, item) => {
      if (!viewChange) {
        return true;
      }
      const flag = item.manufacturerFlagFlag === "UPDATE" ||
      item.traderFlagFlag === "UPDATE" ||
      item.servicerFlagFlag === "UPDATE" ||
      item.agentFlagFlag === "UPDATE" ||
      item.integrationFlagFlag === "UPDATE" ||
      item.contractorFlagFlag === "UPDATE" ||
      item.dealerFlagFlag === "UPDATE";
      return flag;
    },
  },
  {
    fieldCode: "interBusinessShield",
    fieldName: $T("spfm.enterprise.model.message.interBusinessShield").$D("不允许其他企业找到我"),
    render: (val, item) => {
      if (item) {
        return <div
          style={{ color: item && item.interBusinessShieldFlag === "UPDATE" && "red" }}
        >{yesOrNoRenderer(val)}</div>;
      }
    },
    visible: (val, item) => {
      if (isAllPlatform && domesticForeignRelation !== 2) {
        if (viewChange) {
          const flag = item.interBusinessShieldFlag === "UPDATE";
          return flag;
        }
        return true;
      }
      return false;
    },
  },
  {
    fieldCode: "industryReqList",
    fieldName: $T("sslm.enterpriseInform.view.model.business.industryReqList").$D("行业类型"),
    render: (val, item) => {
      if (item) {
        const industryName = (item.industryReqList || []).map((n) => n.industryName);
        return <div
          style={{ color: item && item.industryFlag === "UPDATE" && "red" }}
        >{industryName.join("、")}</div>;
      }
    },
    visible: (val, item) => {
      if (!viewChange) {
        return true;
      }
      const flag = item.industryFlag === "UPDATE";
      return flag;
    },
  },
  {
    fieldCode: "industryCategoryReqList",
    fieldName: $T("sslm.enterpriseInform.view.model.business.industryList").$D("主营品类"),
    render: (val, item) => {
      if (item) {
        const categoryNames = (item.industryCategoryReqList || []).map((n) => n.categoryName);
        return <div
          style={{ color: item && item.industryCategoryFlag === "UPDATE" && "red" }}
        >{categoryNames.join("、")}</div>;
      }
    },
    visible: (val, item) => {
      if (!viewChange) {
        return true;
      }
      const flag = item.industryCategoryFlag === "UPDATE";
      return flag;
    },
  },
  {
    fieldCode: "serviceAreaReqList",
    fieldName: $T("sslm.enterpriseInform.view.model.business.serviceAreaReqList")
      .$D("送货服务范围"),
    render: (val, item) => {
      if (item) {
        const serviceAreas = (item.serviceAreaReqList || []).map((n) => n.serviceAreaMeaning);
        return <div
          style={{ color: item && item.serviceAreaFlag === "UPDATE" && "red" }}
        >
          {serviceAreas.join("、")}
        </div>;
      }
    },
    visible: (val, item) => {
      if (!viewChange) {
        return true;
      }
      const flag = item.serviceAreaFlag === "UPDATE";
      return flag;
    },
  },
  {
    fieldCode: "website",
    fieldName: $T("sslm.enterpriseInform.view.model.business.website").$D("公司官网"),
  },
  {
    fieldCode: "description",
    fieldName: $T("sslm.enterpriseInform.view.model.business.description").$D("公司简介"),
  },
  {
    fieldCode: "logoUrl",
    fieldName: $T("sslm.enterpriseInform.view.model.business.logoUrl").$D("公司 Logo"),
    render:(val) => val ? <srm-button style="font-size: 12px;font-weight:400" plain onClick={() => handlePreview(val)}> {
      $T("sslm.enterpriseInform.view.model.business.viewPhoto").$D("查看图片")
    }</srm-button> : "-"
  },
].map((col) => ({
  render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }),
  visible: (val, item, field) => viewChange ? getRedFlag({ name: field.fieldCode, record:item }) : true,
  ...col,
}));

// 开票信息
export const getInvoiceColums = (viewChange) => [
  {
    fieldCode: "invoiceHeader",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.invoiceHeader").$D("发票头"),
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:400 }}>{renderRedNode({ name: "invoiceHeader", record:item })}</span>
      {!viewChange && <span slot="right" >{renderUpdateTag(item)}</span>}
    </SrmListHeader>,
  },
  {
    fieldCode: "taxRegistrationNumber",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.taxNumber").$D("税务登记号"),
  },
  {
    fieldCode: "taxRegistrationPhone",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.taxPhone").$D("税务登记电话"),
  },
  {
    fieldCode: "taxRegistrationAddress",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.taxAddress").$D("税务登记地址"),
  },
  {
    fieldCode: "depositBank",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.depositBank").$D("开户行"),
  },
  {
    fieldCode: "bankAccountNum",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.bankAccountNum").$D("开户行账号"),
  },
  {
    fieldCode: "receiver",
    fieldName: $T("sslm.common.model.invoice.taker").$D("收票人"),
  },
  {
    fieldCode: "receiveMail",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.receiveMail").$D("收票人邮箱"),
  },
  {
    fieldCode: "receivePhone",
    fieldName: $T("sslm.enterpriseInform.view.model.invoice.receivePhone").$D("收票人手机号"),
    render:(val, item, field) => {
      const { internationalTelMeaning } = item;
      const redFlag = getRedFlag({ name:field.fieldCode, record:item });
      const internationalTelCodeRedFlag = getRedFlag({ name:"internationalTelCode", record:item });
      return <span style={{ color: (redFlag || internationalTelCodeRedFlag) && "red" }}>
        {val && internationalTelMeaning ? `${internationalTelMeaning } | ${val}` :
          val ? val : "-"}
      </span>;
    }
  },
  {
    fieldCode: "receiveAddress",
    fieldName: $T("sslm.common.model.invoice.ticketAddress").$D("收票地址"),
  },
].map((col) => ({
  render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }),
  visible: (val, item, field) => viewChange ? getRedFlag({ name: field.fieldCode, record:item }) : true,
  ...col,
}));

// 其他信息Columns
export const getOtherInfoColumns = (viewChange) => [
].map((col) => ({
  render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }),
  visible: (val, item, field) => viewChange ? getRedFlag({ name: field.fieldCode, record:item }) : true,
  ...col,
}));