<template>
  <div style="min-height: 500px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content main-tab detail-container-tab" customize-code="SMBL.WORKFLOW.DEMAND_APPROVAL.COLLAPSE">
          <srm-scroll-tab-item :label="$T('hipspfm.workFlowDemand.view.title.demandHeadInfo').$D('需求头信息')" code="demandHeadInfo">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
                <span>{{ $T("hipspfm.workFlowDemand.view.title.noDemandHeadInfo").$D("暂无需求头信息") }}</span>
              </div>
              <ul v-else style="padding: 15px 15px">
                <customize :columns="getHeaderColumns"
                           :data-source="headInfo"
                           code="SMBL.WORKFLOW.DEMAND_APPROVAK.HEADER"/>
              </ul>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item :label="$T('hipspfm.workFlowDemand.view.title.demandLineInfo').$D('需求行信息')" code="demandLineInfo">
            <div ref="lineInfo" class="infoContent lineInfo">
              <!-- <div v-if="lineInfo.length">
                <div v-for="(item,index) in lineInfo" :key="index" @click="showLineInfoDetail(item)">
                  <div class="headCompany">
                    <span class="block"/>
                    <span class="code">
                      <span class="materiel-name">{{ item.itemName }}</span>
                      <span>{{ $T("sprm.common.model.common.lineNumber").$D("行号") }}：{{ item.lineNum }}</span>
                    </span>
                  </div>
                  <ul style="padding: 10px 15px 16px 15px">
                    <customize :columns="getLineColumns"
                               :data-source="item"
                               code="SMBL.WORKFLOW.DEMAND_APPROVAK.LINE"/>
                  </ul>
                </div>
              </div> -->
              <srm-list class="scoll-list" :scrollable="false" :columns="getLineColumns"
                        :data-set="prLineDataSet" customize-code="SMBL.WORKFLOW.DEMAND_APPROVAK.LINE"
                        @itemClick="showLineInfoDetail" />
              <!-- <div v-else class="noContent">
                <span>{{ $T("hipspfm.workFlowDemand.view.title.noDemandLineInfo").$D("暂无需求行信息") }}</span>
              </div> -->
            </div>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
      <!-- 行信息详情弹窗 -->
      <srm-popup :visible.sync="show"
                 position="right"
                 show-back
                 height="100%"
                 :show-close="false"
                 :title="$T('sprm.purchaseRequisitionInquiry.view.title.requirementDetail').$D('需求明细')">
        <section class="lineInfoDetail">
          <div class="lineBody">
            <ul>
              <customize-detail :columns="getLineDetailColumns" :data-source="lineInfoDetail"
                                code="SMBL.WORKFLOW.DEMAND_APPROVAK.LINE_DETAIL"/>
            </ul>
            <div class="line-div">
              <span class="line-block"/>
            </div>
          </div>
        </section>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import uuid from "uuid";
import { Popup, NavBar } from "hips";
import { SrmUtil, DataSet } from "srm-mobile-ui";
import {
  getDemandOrderHeadInfoApi,
} from "./api";
import CuxMethods from "../../../modules/CUX/PReqWorkbench_Cux/minxin";
import { purchaseRequisitionLineDS } from "./datasource/PurchaseRequisitionLineDS";

export default {
  modules: [ "hipspfm.common", "hipspfm.workFlowDemand", "sprm.common", "sprm.purchaseRequisitionInquiry", "entity.organization", "sprm.purchaseReqInquiry", "sslm.supplyAbility", "entity.company", "entity.attachment", "hzero.common" ],
  name: "DemandApproval",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  extends: CuxMethods,
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    topHeight: {
      type: Number,
      default: 0,
    }
    // lineInfo: Array
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      loading: false,
      scroll: "",
      show: false,
      navIndex: 0,
      uuid: "",
      contentLenArr: [],
      contentLenArrTemp: [ 0 ],
      lineInfoDetail: {},
      handlerScrollFlag: false,
      prLineDataSet:  new DataSet(purchaseRequisitionLineDS(this.changeReqId)), // 行信息
    };
  },
  computed: {
    getHeaderColumns() {
      let cuxBasicInfoDetail = [];
      // 标准二开埋点
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }

      const columns = [

        {
          fieldCode: "title",
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 10,
          render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
            <span style={{ fontWeight:600 }}>{item.title || "-"}</span>
          </div>
        },
        {
          fieldCode: "displayPrNum",
          fieldType: "TEXT",
          fieldName: this.$T("sprm.common.model.common.displayPrNum").$D("采购申请编号"),
        },
        {
          fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sprm.common.model.common.amount").$D("申请总额"),
          fieldCode: "amount",
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.headerPriceHiddenFlag === 1) {
              return item.amountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, length);
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.applicant").$D("申请人"),
          fieldType: "TEXT",
          fieldCode: "prRequestedName",
          render: (val, item) => item.prRequestedNum && val ? `${item.prRequestedNum || ""}-${val}` : "-",
        },
        {
          fieldName: this.$T("sprm.common.model.common.contactTelNum").$D("联系方式"),
          fieldType: "TEXT",
          fieldCode: "contactTelNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
          fieldType: "TEXT",
          fieldCode: "prSourcePlatformMeaning",
        },
        {
          fieldName: this.$T("entity.company.tag").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.companyTeam").$D("公司组织"),
          fieldType: "TEXT",
          fieldCode: "parentUnitName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.department").$D("部门"),
          fieldType: "TEXT",
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.sqType").$D("申请类型"),
          fieldType: "TEXT",
          fieldCode: "prTypeName",
        },
        {
          fieldName: this.$T("entity.organization.class.purchase").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.buyType").$D("采购品类"),
          fieldType: "TEXT",
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("entity.organization.class.ouFlag").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.moneyPart").$D("费用挂靠部门"),
          fieldType: "TEXT",
          fieldCode: "expenseUnitName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.departmentMan").$D("部门验收人"),
          fieldType: "TEXT",
          fieldCode: "accepterUserName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.techFlag").$D("是否需要技术指导"),
          fieldType: "TEXT",
          fieldCode: "techGuidanceFlag",
          render: (val) => `${val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")}`,
        },
        {
          fieldName: this.$T("sprm.common.model.common.techloMan").$D("技术负责人"),
          fieldType: "TEXT",
          fieldCode: "techDirectorUserName",
        },
        {
          fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sprm.common.model.common.enterEnclosure").$D("内部附件"),
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid",
        }
      ];

      return columns.concat(cuxBasicInfoDetail);
    },
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => <div style="width:100%;display: flex;align-items: center;">
            <span style={{ fontWeight:600 }}>{item.itemName || "-"}</span>
            <div style="display: flex;align-items: center;marginLeft:auto">
              <span class="srm-icon icon-chevron-right" style={{ fontSize:"16px" }}/>
            </div>
          </div>
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "displayLineNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          fieldType: "TEXT",
          fieldCode: "quantity",
          editor: false,
          render: (val, item) => {
            let newVal = SrmUtil.getNumberLocalized(val);
            if (item.changeFiledMap && typeof item.changeFiledMap.quantity !== "undefined" && item.changeFiledMap.quantity !== null) {
              let oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.quantity);
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div onClick={(event) => {
                event.stopPropagation();
              }} style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            return newVal;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价（含税）"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedUnitPrice",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.taxIncludedUnitPrice !== "undefined" && item.changeFiledMap.taxIncludedUnitPrice !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedUnitPrice, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedUnitPrice);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal ? Number(newVal.replace(/,/g, "")) : newVal;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.needDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "neededDate",
          render: (val, item) => {
            // eslint-disable-next-line new-cap
            let newVal = this.$options.filters.CalcDate(val);
            if (item.changeFiledMap && item.changeFiledMap.neededDate) {
              // eslint-disable-next-line new-cap
              let oldVal = this.$options.filters.CalcDate(item.changeFiledMap.neededDate);
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal;
          }
        },
      ];

      return columns;
    },
    getLineDetailColumns() {
      const columns = [
        {
          fieldName: this.$T("sprm.common.model.common.lineNumber").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.itemCode) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.itemCode ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.itemName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.itemName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.invOrganizationId").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.invOrganizationName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.invOrganizationName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.categoryName").$D("物料分类"),
          fieldType: "TEXT",
          fieldCode: "categoryName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.categoryName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.categoryName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.standards").$D("规格"),
          fieldType: "TEXT",
          fieldCode: "itemModel",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.itemModel) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.itemModel ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.itemModel").$D("型号"),
          fieldType: "TEXT",
          fieldCode: "itemSpecs",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.itemSpecs) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.itemSpecs ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.class").$D("属性"),
          fieldType: "TEXT",
          fieldCode: "itemPropertiesMeaning",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.itemPropertiesMeaning) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.itemPropertiesMeaning ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.uomName").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "uomCodeAndName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.uomCodeAndName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.uomCodeAndName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.quantity").$D("数量"),
          // fieldType: "INPUT_NUMBER",
          fieldType: "TEXT",
          fieldCode: "quantity",
          // editor: false,
          render: (val, item) => {
            let newVal = SrmUtil.getNumberLocalized(val);
            if (item.changeFiledMap && typeof item.changeFiledMap.quantity !== "undefined" && item.changeFiledMap.quantity !== null) {
              let oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.quantity);
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            return newVal;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.currencyCode) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.currencyCode ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价（含税）"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedUnitPrice",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.taxIncludedUnitPrice !== "undefined" && item.changeFiledMap.taxIncludedUnitPrice !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedUnitPrice, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedUnitPrice);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal ? Number(newVal.replace(/,/g, "")) : newVal;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.taxIncludedBudgetUnitPrice").$D("预算单价(含税)"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedBudgetUnitPrice",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedBudgetUnitPriceMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.taxIncludedBudgetUnitPrice !== "undefined" && item.changeFiledMap.taxIncludedBudgetUnitPrice !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedBudgetUnitPrice, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedBudgetUnitPrice);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal ? Number(String(newVal).replace(/,/g, "")) : newVal;
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.lineAmount").$D("行金额"),
          fieldType: "TEXT",
          fieldCode: "taxIncludedLineAmount",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedLineAmountMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "financialPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.taxIncludedLineAmount !== "undefined" && item.changeFiledMap.taxIncludedLineAmount !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedLineAmount, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "financialPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.taxIncludedLineAmount);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal;
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.localCurrencyNoTaxUnit").$D("本币不含税单价"),
          fieldType: "TEXT",
          fieldCode: "localCurrencyNoTaxUnit",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.localCurrencyNoTaxUnitMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.localCurrencyNoTaxUnit !== "undefined" && item.changeFiledMap.localCurrencyNoTaxUnit !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyNoTaxUnit, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyNoTaxUnit);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal ? Number(String(newVal).replace(/,/g, "")) : newVal;
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.localCurrencyTaxUnit").$D("本币含税单价"),
          fieldType: "TEXT",
          fieldCode: "localCurrencyTaxUnit",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.localCurrencyTaxUnitMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.localCurrencyTaxUnit !== "undefined" && item.changeFiledMap.localCurrencyTaxUnit !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyTaxUnit, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "defaultPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyTaxUnit);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal ? Number(newVal.replace(/,/g, "")) : newVal;
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.localCurrencyNoTaxSum").$D("本币不含税金额"),
          fieldType: "TEXT",
          fieldCode: "localCurrencyNoTaxSum",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.localCurrencyNoTaxSumMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "financialPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.localCurrencyNoTaxSum !== "undefined" && item.changeFiledMap.localCurrencyNoTaxSum !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyNoTaxSum, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "financialPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyNoTaxSum);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal;
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.localCurrencyTaxSum").$D("本币含税金额"),
          fieldType: "TEXT",
          fieldCode: "localCurrencyTaxSum",
          editor: false,
          render: (val, item) => {
            let newVal;
            if (item.linePriceHiddenFlag === 1) {
              return item.localCurrencyTaxSumMeaning;
            }
            if (item.prSourcePlatform === "SRM") {
              newVal = SrmUtil.getNumberLocalized(val, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "financialPrecision"));
            } else {
              newVal = SrmUtil.getNumberLocalized(val);
            }
            //如果存在变更前的数据，渲染当前数据和气泡展示变更前数据
            if (item.changeFiledMap && typeof item.changeFiledMap.localCurrencyTaxSum !== "undefined" && item.changeFiledMap.localCurrencyTaxSum !== null) {
              let oldVal;
              if (item.prSourcePlatform === "SRM") {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyTaxSum, SrmUtil.getCurrencyPrecision(this.headInfo.originalCurrency, "financialPrecision"));
              } else {
                oldVal = SrmUtil.getNumberLocalized(item.changeFiledMap.localCurrencyTaxSum);
              }
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal;
          }
        },
        {
          fieldName: this.$T("sprm.common.model.common.needDate").$D("需求日期"),
          fieldType: "TEXT",
          fieldCode: "neededDate",
          render: (val, item) => {
            // eslint-disable-next-line new-cap
            let newVal = this.$options.filters.CalcDate(val);
            if (item.changeFiledMap && item.changeFiledMap.neededDate) {
              // eslint-disable-next-line new-cap
              let oldVal = this.$options.filters.CalcDate(item.changeFiledMap.neededDate);
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ String(oldVal) ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{newVal}</div></srm-tooltip>;
            }
            //否则直接返回当前值
            return newVal;
          }
        },
        {
          fieldName: this.$T("sprm.purchaseReqInquiry.model.common.supplierCompanyId").$D("建议供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.supplierCompanyName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.supplierCompanyName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "agentName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.agentName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.agentName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.keepMan").$D("保管人"),
          fieldType: "TEXT",
          fieldCode: "keeperUserName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.keeperUserName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.keeperUserName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.takeman").$D("验收人"),
          fieldType: "TEXT",
          fieldCode: "accepterUserName",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.accepterUserName) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.accepterUserName ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.purchaseReqInquiry.model.common.moneyPayPart").$D("费用承担部门"),
          fieldType: "TEXT",
          fieldCode: "expBearDep",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.expBearDep) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.expBearDep ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.interRoom").$D("存放地点"),
          fieldType: "TEXT",
          fieldCode: "address",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.address) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.address ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sprm.common.model.common.projectNum").$D("项目号"),
          fieldType: "TEXT",
          fieldCode: "projectNum",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.projectNum) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.projectNum ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
          render: (val, item) => {
            if (item.changeFiledMap && item.changeFiledMap.remark) {
              return <srm-tooltip title={this.$T("sprm.common.model.common.beforeChanged", [ item.changeFiledMap.remark ]).$D("变更前：{value}")} placement="top" ><div style={{ color:"red" }}>{val}</div></srm-tooltip>;
            }
            return val;
          },
        },
        {
          fieldName: this.$T("entity.attachment.tag").$D("附件"),
          fieldType: "TEXT",
          fieldCode: "attachment",
          render: (val, record) =>
            <SrmUpload showIcon={false} color="blue"
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              attachmentUuid={record.attachmentUuid}/>
            // return <span style="color:blue">{this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>;
          ,
        },
      ];

      return columns;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getDemandOrderHeader();
        await this.getDemandOrderLine();
        this.loading = true;
      } finally {
        this.$loading.hide();
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowDemand.view.title.demandApproval").$D("需求审批"));
    this.uuid = uuid();
  },
  methods: {
    // 获取需求头信息
    async getDemandOrderHeader() {
      await getDemandOrderHeadInfoApi(this.changeReqId).then((res) => {
        this.headInfo = res || {};
      });
    },
    //获取需求行信息
    getDemandOrderLine() {
      this.prLineDataSet.refresh().then(() => {
        this.lineInfo = this.prLineDataSet.data;
      });
    },
    // 显示行信息详情
    showLineInfoDetail(record) {
      this.lineInfoDetail = { ...record.data };
      console.log(this.lineInfoDetail, 44);
      setTimeout(() => {
        this.show = true;
        this.isLineDetailShow = true;
      }, 150);
    },
    closeLineInfoDetail() {
      this.show = false;
      this.isLineDetailShow = false;
    },
  }
};
</script>

<style scoped lang="stylus">
.blackFont {
  color: var(--color-font-default);
}

>>>.srm-attachment-button .srm-button-text{
  font-size: 12px !important;
  font-weight: 400;
}

.closeFont {
  color: var(--color-font-default-c) !important;
  border-color: var(--color-font-default-c) !important;
}

.mainDetail {
  overflow visible;
  background: var(--background-color-empty-tab-title);
  color: var(--font-color-default);

  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default);
        }

        &.active::before {
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100%;
          height: 2px;
          background-color: var(--color-other-default-b);
          content: '';
        }
      }
    }
  }

  .contentWrap {
    overflow visible;
    // height: calc(100vh - 260px);

    .content {
      .headInfo {
        ul {
          padding-left: 15px;
        }

        & ul li {
          margin-bottom: 8px;
          padding: 9px 10px 14px 0;
          border-bottom: 1px solid var(--color-border-default);
          display: flex;
          align-items: baseline;

          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: var(--color-font-default);
            line-height: 22px;
          }

          span:nth-child(1) {
            flex: 0 1 126px;
          }

          span:nth-child(2) {
            flex: 0 1 209px;
            color: var(--color-font-default-b);
          }
        }

        & ul li:nth-child(1) {
          padding: 20px 20px 11px 0;

          span:nth-child(1) {
            flex: 0 1 126px;
          }
        }

        & ul li:nth-child(1) span:nth-child(2) {
          flex: 0 1 190.7px;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        & ul li:nth-last-child(1) {
          border-bottom: 0;
          margin-bottom: 1px;
        }
      }

      .moreInfo {
        align-self: flex-end;
        width: 18.3px;
        height: 18.3px;
      }

      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 235px;
        }

        .materialCode {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 14px;
          display: flex;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: 80px;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 10px;
          margin: 16px 0 0 15px;
          border-bottom: 1px solid var(--color-border-default);
          padding-right: 15px;

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color: var(--color-font-default);
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  background: var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .left-button {
    // margin-left: 20px;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color: var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  .lineBody {
    background-color: var(--color-font-default-d);
    overflow: auto;

    ul {
      padding: 20px 20px 11px 20px;
    }

    li {
      display: flex;
      padding: 20px 20px 11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom: 1px solid var(--color-border-default);

      &:nth-of-type(1) {
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 122px;
        }

        &:nth-child(2) {
          color: var(--color-font-default-b);
          display: inline-block;
          width: 213px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}
</style>
