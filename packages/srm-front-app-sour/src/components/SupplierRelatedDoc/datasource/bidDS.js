/*
 * @Date: 2023-01-31 09:49:37
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { SrmUtil, $T } from "srm-mobile-ui";

function bidDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "rfxStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.view.status").$D("状态"),
      },
      {
        fieldCode: "rfxNum",
        fieldType: "TEXT",
        fieldName: $T("ssrc.bidHall.model.bidHall.bidNum").$D("BID单号"),
      },
      {
        fieldCode: "rfxTitle",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.Title").$D("标题"),
      },
      {
        fieldCode: "viewDetail",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.implementation").$D("执行情况"),
      },
      {
        fieldCode: "approvalMessage",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.approvalMessage").$D("拒绝理由"),
      },
      {
        fieldCode: "quotationStartDate",
        fieldType: "TEXT",
        fieldName: $T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
      },
      {
        fieldCode: "quotationEndDate",
        fieldType: "TEXT",
        fieldName: $T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.company.fieldCode").$D("公司"),
      },
      {
        fieldCode: "purOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.purchOrgName").$D("采购组织名称"),
      },
      {
        fieldCode: "prequalEndDate",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.applicationDeadTime").$D("预审截止"),
      },
      {
        fieldCode: "createdByName",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.creator.fieldCode").$D("创建人"),
      },
      {
        fieldCode: "createdUnitName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.createdUnitName").$D("创建人部门"),
      },
      {
        fieldCode: "templateName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
      },
      {
        fieldCode: "sourceCategoryMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
      },
      {
        fieldCode: "sourceMethodMeaning",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
      },
      {
        fieldCode: "sourceProjectName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceProject").$D("寻源项目"),
      },
      {
        fieldCode: "sectionName",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sectionName").$D("标段名称"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建日期"),
      },
    ],
    transport: {
      read: {
        url: "/ssrc/v2/{tenantId}/rfx/list/all",
        method: "get",
      },
    },
  };
}

export default bidDS;