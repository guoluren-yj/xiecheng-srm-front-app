<template>
  <div class="order-content">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('sodr.common.view.planSheet.title').$D('计划排程')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  customize-code="SMBL.WORKFLOW.PLAN_SHEET.APPROVAL_BASIC_INFO"
                  :data-set="lineInfoDataSet"
                  :columns="getDetailInfoColumns"
                  @itemClick="showLineDetail"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sodr.common.view.button.operationRecord').$D('操作记录')">
        <history-record-tiled
          :action-data="operatingData"
          :remark-label="$T('sodr.common.model.remark').$D('备注')"
          operation-meaning-field-name="processStatusMeaning"
          process-remark-field-name="processRemark"
          operator-field-name="processUser"
          process-date-field-name="processDate"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('sodr.common.view.planSheet.detail').$D('计划排程详情')">
      <srm-form :data-set="lineInfoDataSet" customize-type="detail" customize-code="SMBL.WORKFLOW.PLAN_SHEET.APPROVAL_DETAIL" :columns="getOrderLineDetailInfoColumns" />
    </srm-popup>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { isArray } from "lodash";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { detailLine, asnLine } from "./dataSource";
import { dateFormat } from "@/utils/index";
import {
  fetchHistory,
} from "./api";
import { STATUS_COLOR_MAP, getRecord } from "./utils";
export default {
  modules: [ "sodr.common", "entity.item", "entity.organization" ],
  name: "ScheduleSheetApprovalForm",
  components: { HistoryRecordTiled },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      visible:false,
      lineInfoDataSet: new DataSet(detailLine()),
      operatingData: [],
      asnDataSet: new DataSet(asnLine()),
    };
  },
  computed:{
    getDetailInfoColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "head",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              <span>{item.itemName || "-"}</span>
              <SrmButton
                rect
                plain
                slot='right'
                style={{ fontWeight: "bold" }}
                type={STATUS_COLOR_MAP[item.planStatus]}
              >
                {item.planStatusMeaning || ""}
              </SrmButton>
            </SrmListHeader>,
        },
        {
          formRow: 20,
          fieldCode: "itemCode",
          fieldName: this.$T("sodr.common.model.common.itemCode").$D("物料编码"),
        },
        {
          formRow: 20,
          fieldCode: "categoryName",
          fieldName: this.$T("sodr.common.model.common.categoryName").$D("物料分类"),
        },
        {
          formRow: 30,
          fieldCode: "supplierCompanyName",
          fieldName: this.$T("sodr.common.model.common.supplierName").$D("供应商名称"),
        },
        {
          formRow:40,
          fieldCode: "planQuantity",
          fieldName: this.$T("sodr.common.model.common.planQuantity").$D("本次计划数量"),
        },
        {
          formRow: 40,
          fieldCode: "supplierConfirmQuantity",
          fieldName: this.$T("sodr.common.model.common.supplierConfirmQuantity").$D("供应方确认数量"),
        },
        {
          formRow: 50,
          fieldCode: "planDate",
          fieldName: this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期"),
          render: (val) => <span>{dateFormat(val)}</span>,
        },
        {
          formRow: 60,
          fieldCode: "displayPoNum",
          fieldName: this.$T("sodr.common.model.common.displayPoNum").$D("订单号"),
        },
        {
          formRow: 70,
          fieldCode: "lineNum",
          fieldName: this.$T("sodr.common.model.common.poLineId").$D("订单行号"),
        },
        {
          formRow: 70,
          fieldCode: "lineLocationNum",
          fieldName: this.$T("sodr.common.model.common.orderDisplayLineLocationNum").$D("订单发运号"),
        },
      ];
    },
    // 行详情
    getOrderLineDetailInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "asnNums",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            {this.renderAsnNum(item)}
          </SrmFlex>
        },
        {
          formRow: 20,
          fieldCode: "serialNum",
          fieldName: this.$T("sodr.common.model.common.orderSeq").$D("序号"),
        },
        {
          formRow: 30,
          fieldCode: "planStatus",
          fieldName: this.$T("sodr.common.model.common.status").$D("状态"),
          render: (val, item) => <span>{item.planStatusMeaning}</span>,
        },
        {
          formRow: 40,
          fieldCode: "itemCode",
          fieldName: this.$T("sodr.common.model.common.itemCode").$D("物料编码"),
        },
        {
          formRow: 50,
          fieldCode: "itemName",
          fieldName: this.$T("sodr.common.model.common.itemName").$D("物料名称"),
        },
        {
          formRow: 60,
          fieldCode: "categoryName",
          fieldName: this.$T("sodr.common.model.common.categoryName").$D("物料分类"),
        }, {
          formRow: 70,
          fieldCode: "supplierCompanyCode",
          fieldName: this.$T("sodr.common.model.common.supplierCode").$D("供应商编码"),
        }, {
          formRow: 80,
          fieldCode: "supplierCompanyName",
          fieldName: this.$T("sodr.common.model.common.supplierName").$D("供应商名称"),
        }, {
          formRow: 90,
          fieldCode: "planQuantity",
          fieldName: this.$T("sodr.common.model.common.planQuantity").$D("本次计划数量"),
        },
        {
          formRow: 100,
          fieldCode: "planDate",
          fieldName: this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期"),
          render: (val) => <span>{dateFormat(val)}</span>,
        },
        {
          formRow: 110,
          fieldCode: "purchaserRemark",
          fieldName: this.$T("sodr.common.model.common.purchaserRemark1").$D("采购方备注"),
        },
        {
          formRow: 120,
          fieldCode: "supplierConfirmQuantity",
          fieldName: this.$T("sodr.common.model.common.supplierConfirmQuantity").$D("供应方确认数量"),
        },
        {
          formRow: 130,
          fieldCode: "supplierRemark",
          fieldName: this.$T("sodr.common.model.common.supplierRemark").$D("供应商备注"),
        },
        {
          formRow: 140,
          fieldCode: "displayPoNum",
          fieldName: this.$T("sodr.common.model.common.displayPoNum").$D("订单号"),
        },
        {
          formRow: 150,
          fieldCode: "lineNum",
          fieldName: this.$T("sodr.common.model.common.poLineId").$D("订单行号"),
        },
        {
          formRow: 160,
          fieldCode: "lineLocationNum",
          fieldName: this.$T("sodr.common.model.common.orderDisplayLineLocationNum").$D("订单发运号"),
        },
        {
          formRow:170,
          fieldCode: "netReceivedQuantity",
          fieldName: this.$T("sodr.common.model.common.netReceivedQuantitys").$D("净接收数量"),
        },
        {
          formRow: 180,
          fieldCode: "sendingQuantity",
          fieldName: this.$T("sodr.common.model.common.sendingQuantity").$D("送货中数量"),
        },
        {
          formRow: 190,
          fieldCode: "uomName",
          fieldName: this.$T("sodr.common.model.common.uomNames").$D("单位"),
        },
        {
          formRow: 200,
          fieldCode: "needByDate",
          fieldName: this.$T("sodr.common.model.common.needByDate").$D("需求日期"),
          render: (val) => <span>{dateFormat(val)}</span>,
        },
        {
          formRow: 210,
          fieldCode: "promiseDeliveryDate",
          fieldName: this.$T("sodr.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          render: (val) => <span>{dateFormat(val)}</span>,
        },
        {
          formRow: 220,
          fieldCode: "agentId",
          fieldName: this.$T("sodr.common.model.common.agentId").$D("采购员"),
          render: (val, item) => <span>{item.purchaseAgentName}</span>,
        }, {
          formRow: 230,
          fieldCode: "companyName",
          fieldName: this.$T("entity.item.companyId").$D("公司"),
        }, {
          formRow: 240,
          fieldCode: "invOrganizationName",
          fieldName: this.$T("entity.organization.class.inventory").$D("库存组织"),
        }, {
          formRow: 250,
          fieldCode: "inventoryName",
          fieldName: this.$T("entity.organization.class.inventoryName").$D("库房"),
        }, {
          formRow: 260,
          fieldCode: "shipToThirdPartyAddress",
          fieldName: this.$T("sodr.common.model.common.receivingAddress").$D("收货地址"),
        }, {
          formRow: 270,
          fieldCode: "creationDate",
          fieldName: this.$T("sodr.common.model.common.createDate").$D("创建时间"),
        },
        {
          formRow: 280,
          fieldCode: "createdBy",
          fieldName: this.$T("sodr.common.model.common.createdByName").$D("创建人"),
          render: (val, item) => <span>{item.createdByName}</span>,
        },
      ];
    }
  },
  mounted() {
    //console.log("this", this.parameters);
    const { planId } = this.parameters;
    if (planId) {
      this.lineInfoDataSet.addPathParameter("planId", planId);
      this.lineInfoDataSet.refresh();
      this.fetchOperatingData(planId);
    }
  },
  methods:{
    // 查看行详情
    showLineDetail() {
      this.visible = !this.visible;
    },
    fetchOperatingData(planId) {
      // const { planId } = this.parameters;
      fetchHistory(planId).then((res) => {
        if (res && !res.failed && isArray(res.content)) {
          this.operatingData = getRecord(res.content);
        }
      });
    },
    renderAsnNum(item = {}) {
      return <SrmButton
        fill
        onClick={() => {
          this.asnDataSet.addPathParameter("poLineLocationId", item.poLineLocationId);
          this.$popup({
            title: this.$T("sodr.common.model.common.relatedAsn").$D("关联送货单"),
            showHeader: true,
            showClose: true,
            rounded: true,
            height: "75vh",
            position: "bottom",
            content: <SrmList
              showSearch={false}
              showCancel={false}
              height="calc(75vh - 46x)"
              dataSet={this.asnDataSet}
              columns={this.getAsnColumns()}
            //  data-source="headInfo"
            />,
          });
        }}>
        {this.$T("sodr.common.model.common.relatedAsn").$D("关联送货单")}
      </SrmButton>;
    },
    getAsnColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            {item.asnNum}
            <span slot="right">
              {this.$T("sodr.common.model.common.lineNum").$D("行号") + "：" + item.displayAsnLineNum}
            </span>
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "shipQuantity" },
        { formRow: 3, fieldCode: "uomName" },
        { formRow: 4, fieldCode: "shipDate" },
        { formRow: 5, fieldCode: "asnStatusMeaning" },
      ];
    }
  },
};
</script>
<style lang="stylus" scoped>
  .order-content{
    >>> .srm-field-error-message{
      overflow: initial;
      white-space: break-spaces;
    }
  }
</style>