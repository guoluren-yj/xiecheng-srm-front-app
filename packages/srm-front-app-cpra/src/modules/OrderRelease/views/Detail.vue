<template>
  <!-- 订单发布 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <!-- 订单头信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('orderHeadInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('orderHeadInfo')"
                  :customize-code="getCodeDefine('orderHeadInfo')"
                  @itemClick="clickOrderHeadInfo"/>
      </srm-scroll-tab-item>
      <!-- 订单行信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="orderLineDataSet"
                  :columns="getColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')"
                  @itemClick="clickBasicInfo"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('attachInfo')"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item :label="getLanguageDefine('operationRecord')">
        <div class="record-container">
          <history-record-tiled
            :show-remark="false"
            :loading="false"
            :action-data="actionRecordList"
            operation-meaning-field-name="status"
            process-date-field-name="processedDate"
            operator-field-name="processUserName"
            process-remark-field-name="processRemark"
            :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
            process-remark-info-field-name="unknown"/>
        </div>
        <div class="bottom-button-space" />
      </srm-scroll-tab-item>
      <div class="approval-detail-bottom"/>
    </srm-scroll-tab>

    <!-- 详情按钮 -->
    <srm-bottom-handler :btn-arr="getButtons"/>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :position="'right'"
               :show-header="false"
               :height="'100%'">
      <!-- 详情tab -->
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getColumns(popupData.columns)"
        :customize-code="getCodeDefine(popupData.code)"/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { getOrderHeadInfo, getActionsRecordApi, publishBtnApi, putUuid, queryDoubleUomConfigApi } from "../api";
import { commonDs, lineDs } from "../datasource/indexDs";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { getDynamicLabel } from "../../../utils";
import { dateFormat } from "@/utils/index";
import uuid from "uuid";
export default {
  modules: [ "sodr.common", "hipspfm.common", "smbl.common", "ssta.purchaseSettle", "smpc.product", "sprm.common", "sodr.workspace", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench" ],
  name: "OrderReleaseDetail",
  components: {
    HistoryRecordTiled
  },
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      headerInfo: {},
      commonDataSet: new DataSet(commonDs()),
      orderLineDataSet: new DataSet(commonDs()),
      actionRecordList: [], // 操作记录
      popupData: {},
      visiblePopup: false,
      isDoubleUnit: false,
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "orderHeadInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.displayPoNum}</span>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "companyName",
              fieldName: $T("sodr.common.model.common.company").$D("公司"),
              formRow: 20,
            },
            {
              fieldCode: "supplierName",
              fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
              formRow: 30,
            },
            {
              fieldName: $T("sodr.common.model.common.poTypeCodeMeaning").$D("订单类型"),
              fieldCode: "poTypeDesc",
              formRow: 40,
            },
            {
              fieldName: $T("sodr.common.model.common.agentName").$D("采购员"),
              fieldCode: "agentName",
              formRow: 40,
            },
            {
              fieldName: $T("sodr.common.model.common.purOrganizationName").$D("采购组织"),
              fieldCode: "purchaseOrgName",
              formRow: 50,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("sodr.common.model.common.currencyCode").$D("币种"),
              formRow: 70,
            },
            {
              fieldCode: "versionNum",
              fieldName: $T("sodr.common.model.common.versionNum").$D("版本号"),
              formRow: 70,
            },
            {
              fieldCode: "taxIncludeAmount",
              fieldName: $T("sodr.common.model.common.newTaxIncludeAmount").$D("金额(含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : SrmUtil.getNumberLocalized(val, item.financialPrecision),
              formRow: 80,
            },
            {
              fieldCode: "amount",
              fieldName: $T("sodr.common.model.common.newAmount").$D("金额(不含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : SrmUtil.getNumberLocalized(val, item.financialPrecision),
              formRow: 80,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.remark").$D("订单摘要"),
              fieldType: "TEXT_AREA",
              formRow: 90,
            },
          ];
        case "basicInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.itemCode || "-"}</span>
                <span slot="right">{item.displayStatusMeaning}</span>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sodr.common.model.common.displayLineNum").$D("行号"),
              formRow: 20,
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
              formRow: 20,
            },
            this.isDoubleUnit && {
              fieldCode: "secondaryQuantity",
              fieldName: $T("sodr.common.model.common.newQuantity").$D("数量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 30,
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 30,
            },
            {
              fieldCode: "enteredTaxIncludedPrice",
              fieldName: $T("sodr.common.model.common.newEnteredTaxIncludedPrice").$D("原币单价(含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : val,
              formRow: 40,
            },
            {
              fieldCode: "needByDate",
              fieldName: $T("sodr.common.model.common.needByDate").$D("需求日期"),
              render: (val) => val ? dateFormat(val) : "-",
              formRow: 40,
            },
          ];
        case "attachInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "attachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("sodr.common.view.attachmentList").$D("附件列表"),
                      displayType: "grid",
                      showInfo: true,
                      uploadButton: "fixed",
                    } ]}
                    show-total
                    title={$T("sodr.common.view.attachmentList").$D("附件列表")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 10,
            },
          ];
        case "orderHeadInfoDetail":
          return [
            {
              fieldCode: "displayPoNum",
              fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
              formRow: 10,
            },
            {
              fieldCode: "companyName",
              fieldName: $T("sodr.common.model.common.company").$D("公司"),
              formRow: 20,
            },
            {
              fieldCode: "supplierName",
              fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
              formRow: 30,
            },
            {
              fieldName: $T("sodr.common.model.common.poTypeCodeMeaning").$D("订单类型"),
              fieldCode: "poTypeDesc",
              formRow: 40,
            },
            {
              fieldName: $T("sodr.common.model.common.agentName").$D("采购员"),
              fieldCode: "agentName",
              formRow: 40,
            },
            {
              fieldName: $T("sodr.common.model.common.purOrganizationName").$D("采购组织"),
              fieldCode: "purchaseOrgName",
              formRow: 50,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("sodr.common.model.common.currencyCode").$D("币种"),
              formRow: 70,
            },
            {
              fieldCode: "versionNum",
              fieldName: $T("sodr.common.model.common.versionNum").$D("版本号"),
              formRow: 70,
            },
            {
              fieldCode: "taxIncludeAmount",
              fieldName: $T("sodr.common.model.common.newTaxIncludeAmount").$D("金额(含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : SrmUtil.getNumberLocalized(val, item.financialPrecision),
              formRow: 80,
            },
            {
              fieldCode: "amount",
              fieldName: $T("sodr.common.model.common.newAmount").$D("金额(不含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : SrmUtil.getNumberLocalized(val, item.financialPrecision),
              formRow: 80,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.remark").$D("订单摘要"),
              fieldType: "TEXT_AREA",
              formRow: 90,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sodr.common.model.common.displayLineNum").$D("行号"),
              formRow: 10,
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
              formRow: 20,
            },
            this.isDoubleUnit && {
              fieldCode: "secondaryQuantity",
              fieldName: $T("sodr.common.model.common.newQuantity").$D("数量"),
              formRow: 30,
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
              formRow: 40,
            },
            {
              fieldCode: "attachmentUuid",
              fieldName: $T("sodr.common.model.common.attachmentUuid").$D("行附件"),
              fieldType: "UPLOAD",
              formRow: 40,
            },
            {
              fieldCode: "unitPrice",
              fieldName: $T("sodr.common.model.common.unitPrice").$D("单价(不含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : val,
              formRow: 50,
            },
            {
              fieldCode: "enteredTaxIncludedPrice",
              fieldName: $T("sodr.common.model.common.newEnteredTaxIncludedPrice").$D("原币单价(含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : val,
              formRow: 50,
            },
            {
              fieldCode: "lineAmount",
              fieldName: $T("sodr.common.model.common.newLineAmount").$D("金额(不含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : SrmUtil.getNumberLocalized(val, item.financialPrecision),
              formRow: 60,
            },
            {
              fieldCode: "taxIncludedLineAmount",
              fieldName: $T("sodr.common.model.common.newTaxIncludedLineAmount").$D("金额(含税)"),
              render: (val, item) => item.priceShieldFlag === 1 ? "***" : SrmUtil.getNumberLocalized(val, item.financialPrecision),
              formRow: 60,
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("sodr.common.model.common.newTaxRate").$D("税率（%）"),
              formRow: 70,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("sodr.common.model.common.currencyCode").$D("币种"),
              formRow: 70,
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T("sodr.common.model.common.invOrganizationName").$D("收货组织"),
              formRow: 80,
            },
            {
              fieldCode: "needByDate",
              fieldName: $T("sodr.common.model.common.needByDate").$D("需求日期"),
              render: (val) => val ? dateFormat(val) : "-",
              formRow: 90,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.purchaseLineRemark").$D("采购方行备注"),
              fieldType: "INPUT",
              formRow: 100,
            },
          ];
        default:
          return [];
        }
      };
    },
    getButtons() {
      return [
        {
          text: $T("sodr.common.view.button.publish").$D("发布"),
          fill: true,
          handler: () => {
            let that = this;
            that.$dialog({
              content: $T("sodr.common.model.common.confirmPublish").$D("是否确认发布订单") + "?",
              onOk() {
                that.publish();
              },
              onCancel() {
              },
            });
          },
        },
      ];
    },
  },
  mounted() {
    let prHeaderId = this.$route.query.poHeaderId || this.parameters.prHeaderId;
    if (prHeaderId) {
      this.$loading.show();
      getOrderHeadInfo(prHeaderId, {
        camp: 1,
        customizeUnitCode: "SODR.ORDER_PUBLISH_LINE_LIST.HEADER,SODR.ORDER_PUBLISH_LINE_LIST.DELIVERY_CATA"
      }).then(async (res) => {
        if (!res) {
          return;
        }
        let uId = uuid();
        if (!res.attachmentUuid) {
          await putUuid(prHeaderId, uId).then((result) => {
            res["attachmentUuid"] = uId;
            res["objectVersionNumber"] = result;
          });
        }
        this.headerInfo = { ...res };
        this.commonDataSet.create({ ...res }, 0);
        this.orderLineDataSet = new DataSet(lineDs(prHeaderId));
        this.orderLineDataSet.refresh();
        getActionsRecordApi(prHeaderId, {
          page: 0,
          size: 0,
          tenantId: SrmUtil.getTenantId(),
        }).then((response) => {
          // this.actionRecordList = data.content.map((item) => ({
          //   ...item,
          //   status: {
          //     type: "info",
          //     text: item.processTypeMeaning,
          //   }
          if (response && !response.failed) {
            // 操作记录数据处理
            /**
       * 动作为【新增行/删除行】的操作记录直接隐藏，
       * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
       * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
       * 动作为【分配】的操作记录不允许合并
       * 动作为【更新/变更】的操作记录 对字段进行合并记录
       */
            let data = [];
            response.content.map((item) => {
              if (item.processTypeCode === "UPDATE" || item.processTypeCode === "CHANGE" || item.processTypeCode === "ROLLBACK") {
                if (data.findIndex((val) => val.poProcessActionId === item.poProcessActionId) === -1) {
                  // 拼接更新的信息
                  let updateRecords = [];
                  response.content.map((val) => {
                    if (val.poProcessActionId === item.poProcessActionId) {
                      updateRecords.push(val);
                    }
                  });
                  let processRemarks = updateRecords.map((u) => u.processTypeCode === "UPDATE" && !u.changeFieldNameMeaning ? "" : `\n${u.processUserName ?? ""} ${u.processRemark ? u.processRemark : `${this.$T("sodr.workspace.model.operationRecord.take").$D("将")}【${u.changeFieldNameMeaning ?? ""}】${this.$T("sodr.workspace.model.operationRecord.cause").$D("由")}【${u.priceShieldFlag ? "******" : u.oldValue ?? ""}】${this.$T("sodr.workspace.model.operationRecord.change").$D("改变为")}【${u.priceShieldFlag ? "******" : u.newValue ?? ""}】 ${u.changeTableName === "SODR_PO_HEADER" ? "" : `${this.$T("sodr.workspace.model.common.displayLineNum").$D("行号")}【${u.displayLineNum ?? ""}】`}`}`
                  ) || [];
                  data.push({ ...item, processRemark: processRemarks.join("\n") });
                }
              } else {
                data.push(item);
              }
            });
            this.actionRecordList = data.map((e) => {
              e.status = {
                text: e.processTypeMeaning,
                type: "primary"
              };
              if (e.processTypeCode === "SUBMIT") {
                e.status.type = "primary";
              } else if (e.processTypeCode === "APV_REJECT") {
                e.status.type = "danger";
              } else if (e.processTypeCode === "NEW") {
                e.status.type = "info";
              }
              return e;
            });
          }

        });
        await this.getDoubleUnitUom();
      }).finally(() => {
        this.$loading.hide();
      });
    }
  },
  methods: {
    // 发布
    publish() {
      let poLineDetailDTOs = [];
      this.orderLineDataSet.data.map((res) => {
        if (res && res.remark) {
          poLineDetailDTOs.push({
            lineVersionNumber: res.lineVersionNumber,
            locationVersionNumber: res.locationVersionNumber,
            objectVersionNumber: res.objectVersionNumber,
            poHeaderId: res.poHeaderId,
            poLineId: res.poLineId,
            poLineLocationId: res.poLineLocationId,
            remark: res.remark,
            _token: res._token,
          });
        }
      });
      this.$loading.show();
      publishBtnApi([
        {
          poHeaderDetailDTO: this.commonDataSet.current.data,
          poLineDetailDTOs: poLineDetailDTOs,
        }
      ]).then((res) => {
        if (res) {
          if (res.failed) {
            this.$notification.open({ message: res.message });
          } else {
            this.$router.back();
          }
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 获取业务规则定义-双单位配置
    async getDoubleUnitUom() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "orderHeadInfo": $T("sodr.common.view.tab.orderHeadInfo").$D("订单头信息"),
        "basicInfo": $T("sodr.common.view.tab.lineInfo").$D("订单行信息"),
        "attachInfo": $T("sodr.common.view.tab.attach").$D("附件"),
        "operationRecord": $T("sodr.common.view.tab.operateRecord").$D("操作记录"),
        "bom": $T("sodr.common.view.title.bom").$D("外协BOM"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "orderHeadInfo": "SMBL.ORDER_RELEASE.ORDER_HEADER_INFO",
        "basicInfo": "SMBL.ORDER_RELEASE.BASIC_INFO",
        "orderHeadInfoDetail": "SMBL.ORDER_RELEASE.ORDER_HEADER_INFO.DETAIL",
        "basicInfoDetail": "SMBL.ORDER_RELEASE.BASIC_INFO.DETAIL",
      };
      return codeList[key] || key;
    },
    clickOrderHeadInfo() {
      this.openPopup("orderHeadInfoDetail", this.commonDataSet);
    },
    clickBasicInfo() {
      this.openPopup("basicInfoDetail", this.orderLineDataSet);
    },
    // 弹框
    async openPopup(name, item) {
      switch (name) {
      case "0":
        break;
      default:
        this.bomVisible = false;
        this.popupData = {
          data: item,
          columns: name,
          code: name,
        };
        setTimeout(() => {
          this.visiblePopup = true;
        }, 0);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.attachment {
  height 28px;
  font-size 14px;
  color #333333;
  line-height 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 8px;
  }

  .icon-chevron-right {
    font-size 16px;
    color val(--color-font-default-b);
  }
  >>> .srm-button-primary {
    color #333 !important;
  }
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

.line-filter {
  display flex;
  justify-content space-between;

  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
  }
  .color-primary {
    color var(--font-color-primary) !important;
    font-size 20px;
  }
}
</style>