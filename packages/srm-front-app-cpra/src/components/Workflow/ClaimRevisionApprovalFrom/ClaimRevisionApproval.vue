<template>
  <div>
    <!-- 内容区 -->
    <srm-scroll-tab class="content">
      <!-- 申诉处理 -->
      <srm-scroll-tab-item :label="$T('sqam.common.model.applyDeal').$D('申诉处理')">
        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.noInfo").$D("暂无信息") }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          code="SMBL.WORKFLOW.CLAIM.REVISION.APPROVAL_APPLY_DEAL_INFO"
          :data-source="headInfo"
          :columns="getApplyDealInfoColumns"/>
      </srm-scroll-tab-item>
      <!-- 基本信息 -->
      <srm-scroll-tab-item :label="$T('sqam.common.view.panel.baseInfo').$D('基本信息')">
        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.noInfo").$D("暂无信息") }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          :data-source="headInfo"
          code="SMBL.WORKFLOW.CLAIM.REVISION.APPROVAL_BASIC_INFO"
          :columns="getBasicInfoColumns"/>
      </srm-scroll-tab-item>
      <!-- 索赔信息 -->
      <srm-scroll-tab-item :label="$T('sqam.common.view.panel.claimInfo').$D('索赔信息')">
        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.noInfo").$D("暂无信息") }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          :data-source="headInfo"
          code="SMBL.WORKFLOW.CLAIM.REVISION.APPROVAL_CLAIM_INFO"
          :columns="getClaimInfoColumns"/>
      </srm-scroll-tab-item>
      <!-- 索赔项目 -->
      <srm-scroll-tab-item :label="$T('sqam.common.view.panel.claimItem').$D('索赔项目')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="claimLineDs"
                  :columns="getClaimItemLineInfoColumns"
                  :customize-code="getCodeDefine('line')"
                  @itemClick="showLineInfoDetail"/>
      </srm-scroll-tab-item>
      <!-- <srm-scroll-tab-item
        :label="
          $T('sqam.common.view.panel.claimItem').$D('索赔项目')
        ">
        <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
        </div>
        <div
          v-for="(item, index) in lineInfo"
          v-else
          :key="index"
          @click="showLineInfoDetail(item)">
          <customize
            :need-padding="true"
            code="SMBL.WORKFLOW.CLAIM.REVISION.APPROVAL_CLAIM_ITEM_LINE_INFO"
            :data-source="item"
            :columns="getClaimItemLineInfoColumns"/>
        </div>
      </srm-scroll-tab-item> -->
    </srm-scroll-tab>
    <!-- 行信息弹窗 -->
    <srm-popup
      :visible.sync="visible"
      height="100%"
      position="right"
      :title="
        $T('sqam.common.view.panel.claimItem').$D(
          '索赔项目'
        )
      ">
      <div style="height: 100%; overflow: auto">
        <!-- <srm-detail-head :data-source="lineInfoDetail" :columns="getClaimItemDetailHeadColumns"/> -->
        <customize-detail
          :need-padding="true"
          :data-source="lineInfoDetail"
          code="SMBL.WORKFLOW.CLAIM.REVISION.APPROVAL_CLAIM_ITEM_LINE_DETAIL"
          :columns="getClaimItemLineDetailInfoColumns"/>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { getClaimFormHeaderApi } from "./api";
import { DataSet } from "srm-mobile-ui";
import { claimLineDS } from "./dataSource/indexDs";
export default {
  modules: [ "sqam.common", "entity.supplier", "entity.company", "entity.organization", "entity.item", "hipspfm.workFlow", "hipspfm.common" ],
  name: "ClaimRevisionApproval",
  components: {
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      headInfo: {},
      visible:false,
      lineInfoDetail:{},
      lineInfo:[],
      claimLineDs: new DataSet(claimLineDS(this.changeReqId)),
    };
  },
  computed: {
    // 申诉处理
    getApplyDealInfoColumns() {
      const columns = [
        {
          fieldCode: "appealContentMeaning",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span class="font-weight-bold">{ val || "-" }</span>
              <div slot="right">
                {
                  record.appealHandleActionCode && record.appealHandleActionCode === "CANCEL_CLAIM" &&
                 <span class="name-tag cancle-tag">
                   {this.$T("sqam.common.model.cancelComplaint").$D("取消索赔")}
                 </span>
                }
                {
                  record.appealHandleActionCode && record.appealHandleActionCode === "NON_COMMUTED" &&
                 <span class="name-tag confirm-tag">
                   {this.$T("sqam.common.model.noChange").$D("不改判")}
                 </span>
                }
                {
                  record.appealHandleActionCode && record.appealHandleActionCode !== "CANCEL_CLAIM" && record.appealHandleActionCode !== "NON_COMMUTED" &&
                 <span class="name-tag">
                   {this.$T("sqam.common.model.changeItem").$D("改判")}
                 </span>
                }
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sqam.common.model.statementOption").$D("申诉意见"),
          fieldType: "TEXT",
          fieldCode: "appealOpinion",
        },
        {
          fieldName: this.$T("sqam.common.model.statementCount").$D("申诉次数"),
          fieldCode: "appealedSum",
          render:(val, record) => <span>{ record.appealedSum ? record.appealedSum : 0 }/{ record.appealedCount ? record.appealedCount : 1 }</span>
        },
        {
          fieldName: this.$T("sqam.common.date.statementDate").$D("申诉日期"),
          fieldType: "TEXT",
          fieldCode: "appealedDate",
        },
        {
          fieldName: this.$T("sqam.common.panel.supplierAppealAttachment").$D("供应商申诉附件"),
          fieldType: "TEXT",
          fieldCode: "supplierAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-count={true}
                show-icon={false}
                color="var(--color-other-default-b)"
                title={this.$T("sqam.common.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "sqam.common.view.button.viewUpload"
                ).$D("查看附件")}
              />
            </div>
          ,
        },
        {
          fieldName: this.$T("sqam.common.model.statementResolution").$D("决议说明"),
          fieldType: "TEXT",
          fieldCode: "appealHandleOpinion",
        },
      ];
      return columns;
    },
    // 基本信息
    getBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "formTitle",
          fieldType: "EMPTY",
          formRow:0,
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val || "-"}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sqam.common.model.claimNum").$D("索赔单号"),
          fieldType: "TEXT",
          fieldCode: "formNum",
        },
        {
          fieldName: this.$T("entity.supplier.name").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.createBy").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createName",
        },
        {
          fieldName: this.$T("sqam.common.model.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("entity.company.ta").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("entity.organization.class.asnType").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("sqam.common.model.claimTypee").$D("索赔类型"),
          fieldType: "TEXT",
          fieldCode: "claimTypeName",
        },
        {
          fieldName: this.$T("sqam.common.model.claimState").$D("索赔说明"),
          fieldType: "TEXT",
          fieldCode: "claimDesc",
        },
      ];
      return columns;
    },
    // 索赔信息
    getClaimInfoColumns() {
      const columns = [
        {
          fieldCode: "totalAmount",
          // fieldType: "EMPTY",
          formRow:0,
          fieldName: `${this.$T("sqam.common.model.claimSum").$D("索赔总额")}|${this.$T("sqam.common.model.MoneyType").$D("币种")}`,
          render: (val, record) => {
            const length = this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision");
            return <span>{this.$options.filters.calcMultipleDelimiter(val, length)} | {record.currencyName}</span>;
          }
        },
        {
          fieldName: this.$T("sqam.common.date.requireFeedbackDate").$D("要求反馈日期"),
          fieldType: "TEXT",
          fieldCode: "feedbackDate",
        },
        {
          fieldName: this.$T("sqam.common.model.claimOrigin").$D("索赔来源"),
          fieldType: "TEXT",
          fieldCode: "dataSourceCodeMeaning",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.source.num").$D("来源单号"),
          fieldType: "TEXT",
          fieldCode: "dataSourceNum",
        },
        {
          fieldName: this.$T("sqam.common.model.claimSum1").$D("费用处理方式"),
          fieldType: "TEXT",
          fieldCode: "expenseProcessTypeMeaning",
        },
      ];
      return columns;
    },
    // 索赔项目
    getClaimItemLineInfoColumns() {
      const columns = [
        {
          fieldCode: "claimItemDesc",
          fieldType: "EMPTY",
          formRow:0,
          render: (val) =>
            <SrmListHeader>
              <span class="font-weight-bold">{val}（{this.$T("sqam.common.model.claimItemDesc").$D("索赔项目描述")}）</span>
              <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", color: "var(--color-default)" }} />
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sqam.common.model.common.displayNumber").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "displayLineNum",
          formRow: 1,
        },
        {
          fieldName: this.$T("entity.item.name").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sqam.common.model.common.quantity").$D("数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "quantity",
          editor:false,
        },
        {
          fieldName: this.$T("sqam.common.model.unit").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T("sqam.common.model.taxRate").$D("税率"),
          fieldType: "TEXT",
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "lineRemark",
        },
        {
          fieldName: this.$T("sqam.common.view.model.noTaxBill").$D("金额(不含税)"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "lineAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
      ];
      return columns;
    },
    //索赔详情头
    getClaimItemDetailHeadColumns() {
      const columns = [
        {
          fieldName: this.$T("sqam.common.model.common.displayNumber").$D("行号"),
          fieldCode: "displayLineNum",
        },
        {
          fieldName: this.$T("entity.item.code").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("entity.item.name").$D("物料名称"),
          fieldCode: "itemName",
        },
      ];

      return columns;
    },
    //索赔项目行详情信息
    getClaimItemLineDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sqam.common.model.common.displayNumber").$D("行号"),
          fieldCode: "displayLineNum",
        },
        {
          fieldName: this.$T("entity.item.code").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("entity.item.name").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sqam.common.model.claimItemDesc").$D("索赔项目描述"),
          fieldCode: "claimItemDesc",
        },
        {
          fieldName: this.$T("sqam.common.model.happenDate").$D("发生日期"),
          fieldCode: "occurDate",
        },
        {
          fieldName: this.$T("sqam.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor:false,
        },
        {
          fieldName: this.$T("sqam.common.model.unit").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          fieldName: this.$T("sqam.common.model.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sqam.common.model.noTaxBill").$D("不含税金额"),
          fieldCode: "lineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sqam.common.model.hasTaxBill").$D("含税金额"),
          fieldCode: "taxIncludedLineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sqam.common.model.claimState").$D("索赔说明"),
          fieldCode: "lineExplain",
        },
        {
          fieldName: this.$T("sqam.common.model.common.jointCode").$D("连带物品编码"),
          fieldCode: "associateItemCode",
        },
        {
          fieldName: this.$T("sqam.common.model.common.jointUni").$D("连带物品单位"),
          fieldCode: "associateItemUomCodeAndName",
        },
        {
          fieldName: this.$T("sqam.common.model.common.jointNum").$D("连带物品数量"),
          fieldCode: "associateItemQuantity",
          fieldType: "INPUT_NUMBER",
          editor:false,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.remark").$D("备注"),
          fieldCode: "lineRemark",
        },
      ];

      return columns;
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getOrderHeader();
        await this.getOrderLine();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.model.title.claimFromTitle").$D("索赔单处理审批")
    );
  },
  methods: {
    //获取订单头信息
    async getOrderHeader() {
      const customizeUnitCode = "SQAM.CLAIM_STATEMENT_DEATIL.BASIC_INFO,SQAM.CLAIM_STATEMENT_DEATIL.CLAIM_INFO,SQAM.CLAIM_STATEMENT_DEATIL.STATEMENT";
      const headInfo = await getClaimFormHeaderApi(this.changeReqId, { customizeUnitCode });
      this.headInfo = headInfo;
    },
    //获取订单行信息
    async getOrderLine() {
      this.claimLineDs.setQueryParameter({
        formHeaderId: this.changeReqId,
        customizeUnitCode:"SQAM.CLAIM_STATEMENT_DEATIL.ITEM",
      });
      this.claimLineDs.refresh();
      // this.$loading.show();
      // const params = {
      //   page: 0,
      //   size: 2000,
      // };
      // await getClaimFormLineApi(this.changeReqId, params).then((res) => {
      //   this.$loading.hide();
      //   if (!res.empty) {
      //     this.lineInfo = res.content;
      //   }
      // });
    },
    // 显示行信息详情
    showLineInfoDetail(record) {
      const { data } = record || {};
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.visible = true;
      }, 200);
    },
    getCodeDefine(key) {
      const codeDefine = {
        "line": "SMBL.WORKFLOW.CLAIM.REVISION.APPROVAL_CLAIM_ITEM_LINE_INFO",
      };
      return codeDefine[key] || "";
    },
  },
};
</script>

<style lang="stylus" scoped>
  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }
.name-tag {
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        display: inline-block;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        // margin-right: 8px;
        flex: none;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }
      .cancle-tag{
        background: var(--color-bg-default-b);
        color: var(--color-font-default-e);
      }
      .confirm-tag{
        background: var(--color-bg-default-e);
        color: var(--color-other-default);
      }

    .code {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-e);
      text-align: right;
      line-height: 22px;
      font-weight: bold;
    }
    .srm-header-text {
      font-weight: normal;
    }
    >>> .open-tag::before {
      display: none;
    }
    .font-weight-bold {
      font-weight: 600 !important;
    }
</style>
