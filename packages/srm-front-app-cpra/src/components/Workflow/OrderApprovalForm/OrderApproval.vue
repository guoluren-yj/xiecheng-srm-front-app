<template>
  <div v-loading="initLoading" style="min-height: 500px">
    <section v-if="headInfo" class="mainDetail">
      <div class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <srm-scroll-tab-item
            class="infoContent"
            :label="
              $T('hipspfm.common.view.message.title.orderHeaderInfo').$D(
                '订单头信息'
              )
            ">
            <div v-if="!headInfo.poHeaderId" class="noContent">
              <span>{{
                $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D(
                  "暂无订单头信息"
                )
              }}</span>
            </div>
            <div class="card-personalized">
              <!-- 个性化组件替换后的代码 -->
              <customize
                :columns="getHeaderInfoColumns"
                :data-source="headInfo"
                code="SMBL.WORKFLOW.ORDER_APPROVAL.HEAD"/>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item
            class="infoContent lineInfo"
            :label="
              $T('hipspfm.common.view.message.title.orderLineInfo').$D(
                '订单行信息'
              )
            ">
            <div v-show="headInfo && headInfo.changeFlag">
              <srm-tab-bar
                :tabs="tabs"
                class="change-tabs"
                @indexChange="onIndexChange"/>
            </div>
            <div v-if="!lineInfo || !lineInfo.length" class="noContent">
              <span>{{
                $T("hipspfm.common.view.message.title.noOrderLineInfo").$D(
                  "暂无行信息"
                )
              }}</span>
            </div>
            <div
              v-for="(item, index) in lineInfo"
              :key="index"
              class="card-personalized"
              @click="showLineInfoDetail(item, index)">
              <div
                v-show="
                  item && item.changeMap && 'insertFlag' in item.changeMap
                "
                class="change-line-tip">
                {{
                  $T("sodr.common.model.common.newChangeLine").$D(
                    "该行是变更时新增行"
                  )
                }}
              </div>
              <!-- 个性化组件替换后的代码 -->
              <customize
                :columns="getLineInfoColumns"
                :data-source="item"
                code="SMBL.WORKFLOW.ORDER_APPROVAL.LINE"/>
            </div>
          </srm-scroll-tab-item>
          <!-- 附件 -->
          <srm-scroll-tab-item
            :label="$T('sodr.orderApproval.view.message.attachment').$D('附件')">
            <srm-attachment-button
              group
              show-total
              :title="$T('sodr.common.view.enterAttachment').$D('内部附件')"
              :attachments="[
                {
                  attachmentUuid: headInfo.purchaserInnerAttachmentUuid,
                  readonly: true,
                  showInfo: true,
                  uploadButton: 'none',
                },
              ]"/>
            <srm-attachment-button
              group
              show-total
              :title="$T('sodr.common.view.outerAttachment').$D('外部附件')"
              :attachments="[
                {
                  attachmentUuid: headInfo.attachmentUuid,
                  readonly: true,
                  showInfo: true,
                  uploadButton: 'none',
                },
              ]"/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item
            :label="
              $T('sodr.orderApproval.view.message.actionHistory').$D('操作记录')
            ">
            <history-record-tiled
              :loading="historyLoading"
              :action-data="poProcessActions"
              operation-meaning-field-name="processTypeMeaning"
              process-remark-field-name="processRemark"
              operator-field-name="processUserName"
              process-date-field-name="processedDate"
              :remark-label="
                $T('smbl.common.view.title.operationRemark').$D('操作说明')
              "/>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
      <!-- 行信息详情弹窗 -->
      <order-line-detail
        v-model="orderLineDetailPopup"
        :line-info-detail="lineInfoDetail"
        :show-file-pop="showFilePop"
        :is-double-unit="!!isDoubleUnit"
        :render-change-tip="renderChangeTip"/>
    </section>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
import { SrmUtil, SrmAttachmentButton } from "srm-mobile-ui";
import { NavBar, Textarea } from "hips";
import { getDynamicLabel } from "../../../utils";
import OrderLineDetail from "./components/OrderLineDetail";
import {
  getOrderHeaderApi,
  getOrderLineApi,
  getPoProcessActions,
  queryDoubleUomConfigApi,
} from "./api";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";

const SHIED_FIELDS = [
  "amount",
  "taxIncludeAmount",
  "unitPrice",
  "enteredTaxIncludedPrice",
  "lineAmount",
  "taxIncludedLineAmount",
  "domesticTaxIncludedPrice",
  "domesticUnitPrice",
  "domesticTaxIncludedLineAmount",
  "domesticLineAmount",
];

export default {
  modules: [
    "hipspfm.common",
    "sodr.orderApproval",
    "sodr.common",
    "sodr.sendOrder",
    "hipspfm.orderApproval",
    "sodr.deliveryDateReview",
    "sinv.common",
    "smbl.common",
    "sodr.workspace",
    "sprm.common",
    "sinv.receiptWorkbench",
    "sinv.receiptExecution",
    "sinv.receipWorkbench",
    "slod.deliveryWorkbench",
    "slod.common",
  ],
  name: "OrderApproval",
  components: {
    HistoryRecordTiled,
    OrderLineDetail,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    topHeight: {
      type: Number,
      default: 0,
    },
    showFilePop: {
      type: Function,
    },
  },
  data() {
    return {
      tabs: [
        this.$T("sodr.common.model.common.changeLineDisplay").$D(
          "仅展示变更行"
        ),
        this.$T("sodr.common.model.common.allDisplay").$D("全部行"),
      ],
      initLoading: false,
      orderLineDetailPopup: false,
      contentLenArr: [],
      lineInfoDetail: {},
      headInfo: {},
      lineInfo: [],
      poProcessActions: [],
      historyLoading: false,
      isDoubleUnit: false,
    };
  },
  computed: {
    getHeaderInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.common.model.common.displayPoNum").$D(
            "订单号"
          ),
          fieldCode: "displayPoNum",
          fieldType: "EMPTY",
          render: (value) => <SrmListHeader showOpenTag={false}>
            <span style={{ "font-size": "12px", "font-weight": "bold" }}>{value}</span>
            {/* <div slot="right">
              <em class="srm-icon icon-chevron-right"/>
            </div> */}
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sodr.common.model.common.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sodr.common.model.common.supplierCompanyNum").$D(
            "供应商编码"
          ),
          fieldCode: "supplierCode",
        },
        {
          fieldName: this.$T("sodr.common.model.common.supplierCompanyName").$D(
            "供应商名称"
          ),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sodr.common.model.common.supplierSiteId").$D(
            "供应商地址"
          ),
          fieldCode: "supplierSiteName",
        },
        {
          fieldName: this.$T(
            "sodr.common.model.common.newTaxIncludeAmount"
          ).$D("金额(含税)"),
          fieldCode: "taxIncludeAmount",
          render: (val, record, field) => {
            let precision;
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              precision = Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
            const dom = SrmUtil.getNumberPrecision(
              new BigNumber(val),
              precision
            );
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        {
          fieldName: this.$T("sodr.common.model.common.newAmount").$D(
            "金额(不含税)"
          ),
          fieldCode: "amount",
          render: (val, record, field) => {
            let precision;
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              precision = Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
            const dom = SrmUtil.getNumberPrecision(
              new BigNumber(val),
              precision
            );
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.currencyName").$D(
            "币种"
          ),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.releaseNum").$D(
            "发放号"
          ),
          fieldCode: "releaseNum",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.poTypeCode").$D(
            "订单类型"
          ),
          fieldCode: "poTypeDesc",
        },
        {
          fieldName: this.$T("sodr.sendOrder.model.common.versionNumber").$D(
            "版本号"
          ),
          fieldCode: "versionNum",
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.purOrganizationId"
          ).$D("采购组织"),
          fieldCode: "purchaseOrgName",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.agentName").$D(
            "采购员"
          ),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T(
            "hipspfm.orderApproval.model.orderApproval.releasedDate"
          ).$D("发布时间"),
          fieldCode: "releasedDate",
        },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.common.receiverAddressName"
          ).$D("收货方地址"),
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.common.billToLocationAddress"
          ).$D("收单方地址"),
          fieldCode: "billToLocationAddress",
        },
        {
          fieldName: this.$T(
            "sodr.deliveryDateReview.model.common.termsName"
          ).$D("付款条款"),
          fieldCode: "termsName",
          render: (val, item, field) => {
            if (val) {
              return this.renderChangeTip(field, item, val);
            }
          },
        },
        {
          fieldName: this.$T("sodr.common.model.common.erpContractNum").$D(
            "合同编号"
          ),
          fieldCode: "erpContractNum",
        },
        {
          fieldName: this.$T("sodr.common.model.common.totalQuantity").$D(
            "总数量"
          ),
          fieldType: "INPUT_NUMBER",
          fieldCode: "quantityTotal",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.remark").$D(
            "订单摘要"
          ),
          fieldCode: "remark",
          render: (val, item, field) =>
            val ?
              this.renderChangeTip(field, item, val) :
              this.$T("hipspfm.common.currency.none").$D("无"),
        },
      ];
      return columns;
    },
    getLineInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.orderApproval.model.common.description").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (value) => <SrmListHeader showOpenTag={false}>
            <span style={{ "font-size": "12px", "font-weight": "bold" }}>{value}</span>
            <div slot="right">
              <em class="srm-icon icon-chevron-right"/>
            </div>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.displayLineNum").$D(
            "行号"
          ),
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.itemCode").$D(
            "物料编码"
          ),
          fieldCode: "itemCode",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.shipmentNum").$D(
            "发运号"
          ),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.orderApproval.model.common.quantity").$D(
            "数量"
          ),
          fieldCode: "secondaryQuantity",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        {
          fieldName: this.$T(
            "sodr.common.model.common.newEnteredTaxIncludedPrice"
          ).$D("原币单价(含税)"),
          fieldCode: "enteredTaxIncludedPrice",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
          fieldCode: "uomCodeAndName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.common.model.common.uomCode").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("sodr.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.needByDate").$D(
            "需求日期"
          ),
          fieldCode: "needByDate",
          render: (val, item, field) => {
            // eslint-disable-next-line new-cap
            const dom = this.$options.filters["CalcDate"](val);
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T(
            "sodr.workspace.model.common.taxIncludedLineAmounts"
          ).$D("行金额(含税)"),
          fieldCode: "taxIncludedLineAmount",
          render: (val, record, field) => {
            let precision;
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              precision = Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
            const dom = SrmUtil.getNumberPrecision(
              new BigNumber(val),
              precision
            );
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
      ];
      return columns;
    },
    // 附件
    getAttachColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "purchaserInnerAttachmentUuid",
          render: (val) =>
            <SrmFlex class="attachment" justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <SrmAttachmentButton
                  showTotal={true}
                  title={this.$T("sodr.common.view.enterAttachment").$D(
                    "内部附件"
                  )}
                  attachments={[
                    {
                      attachmentUuid: val,
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    },
                  ]}
                />
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>,
          formRow: 10,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "attachmentUuid",
          render: (val) =>
            <SrmFlex class="attachment" justify="between">
              <SrmFlex>
                <span class="srm-icon icon-other" />
                <SrmAttachmentButton
                  showTotal={true}
                  title={this.$T("sodr.common.view.outerAttachment").$D(
                    "外部附件"
                  )}
                  attachments={[
                    {
                      attachmentUuid: val,
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    },
                  ]}
                />
              </SrmFlex>
              <span class="srm-icon icon-chevron-right" />
            </SrmFlex>,
          formRow: 20,
        },
      ];
    },
  },
  watch: {},
  async mounted() {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.getOrderHeader();
        await this.getOrderLine();
        await this.queryDoubleUomConfig();
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.initLoading = false;
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("sodr.orderApproval.view.message.headerTitle").$D("订单审批")
    );
  },
  methods: {
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        this.isDoubleUnit = Number(res);
      });
    },
    onIndexChange(index) {
      this.getOrderLine({ changeEditFlag: index === 0 ? 1 : 0 });
    },
    // 显示变更信息提示,只对 fieldType为 TEXT、EMPTY有用
    renderChangeTip(field, record, content) {
      const that = this;
      const { fieldCode } = field;
      const { changeMap = {}, priceShieldFlag } = record || {};
      const shieldFlag =
        priceShieldFlag === 1 && SHIED_FIELDS.includes(fieldCode);
      const tipValue = changeMap[fieldCode] || "【】";
      const dom = content;
      if (fieldCode in changeMap) {
        const tipContent = `${that
          .$T("sodr.common.model.common.beforeUpdate")
          .$D("变更前")} : ${tipValue}`;
        if (!shieldFlag) {
          return (
            <srm-tooltip title={tipContent} placement="top">
              <span
                style="color:red"
                onClick={(e) => {
                  if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                {dom}
              </span>
            </srm-tooltip>
          );
        }
        return <span style="color:red">{dom}</span>;
      }
      return dom;
    },
    fetchPoProcessActions() {
      this.historyLoading = true;
      getPoProcessActions(this.headInfo.poHeaderId)
        .then((res) => {
          if (res && !res.failed) {
            // 操作记录数据处理
            /**
             * 动作为【新增行/删除行】的操作记录直接隐藏，
             * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
             * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
             * 动作为【分配】的操作记录不允许合并
             * 动作为【更新/变更】的操作记录 对字段进行合并记录
             */
            let data = [];
            res.content.map((item) => {
              if (
                item.processTypeCode === "UPDATE" ||
                item.processTypeCode === "CHANGE" ||
                item.processTypeCode === "ROLLBACK"
              ) {
                if (
                  data.findIndex(
                    (val) => val.poProcessActionId === item.poProcessActionId
                  ) === -1
                ) {
                  // 拼接更新的信息
                  let updateRecords = [];
                  res.content.map((val) => {
                    if (val.poProcessActionId === item.poProcessActionId) {
                      updateRecords.push(val);
                    }
                  });
                  let processRemarks =
                    updateRecords.map((u) =>
                      u.processTypeCode === "UPDATE" &&
                      !u.changeFieldNameMeaning ?
                        "" :
                        `\n${u.processUserName ?? ""} ${
                          u.processRemark ?
                            u.processRemark :
                            `${this.$T(
                              "sodr.workspace.model.operationRecord.take"
                            ).$D("将")}【${
                              u.changeFieldNameMeaning ?? ""
                            }】${this.$T(
                              "sodr.workspace.model.operationRecord.cause"
                            ).$D("由")}【${
                              u.priceShieldFlag ?
                                "******" :
                                u.oldValue ?? ""
                            }】${this.$T(
                              "sodr.workspace.model.operationRecord.change"
                            ).$D("改变为")}【${
                              u.priceShieldFlag ?
                                "******" :
                                u.newValue ?? ""
                            }】 ${
                              u.changeTableName === "SODR_PO_HEADER" ?
                                "" :
                                `${this.$T(
                                  "sodr.workspace.model.common.displayLineNum"
                                ).$D("行号")}【${
                                  u.displayLineNum ?? ""
                                }】`
                            }`
                        }`
                    ) || [];
                  data.push({
                    ...item,
                    processRemark: processRemarks.join("\n"),
                  });
                }
              } else {
                data.push(item);
              }
            });
            this.poProcessActions = data.map((e) => {
              e.processTypeMeaning = {
                text: e.processTypeMeaning,
                type: "primary",
              };
              if (e.processTypeCode === "SUBMIT") {
                e.processTypeMeaning.type = "primary";
              } else if (e.processTypeCode === "APV_REJECT") {
                e.processTypeMeaning.type = "danger";
              } else if (e.processTypeCode === "NEW") {
                e.processTypeMeaning.type = "info";
              }
              return e;
            });
          }
        })
        .finally(() => {
          this.historyLoading = false;
        });
    },
    // 显示行信息详情
    showLineInfoDetail(data, index) {
      this.orderLineDetailPopup = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    //获取订单头信息
    async getOrderHeader() {
      const params = {
        camp: 1,
        poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
      };
      const headInfo = await getOrderHeaderApi(this.changeReqId, params);
      this.headInfo = { orgName: this.orgName, ...headInfo };
      this.fetchPoProcessActions();
    },
    //获取订单行信息
    async getOrderLine(fields = {}) {
      const params = {
        camp: 1,
        sortType: 1,
        ...fields,
        poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
      };
      await getOrderLineApi(this.changeReqId, params).then((res) => {
        if (res && !res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
  },
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

.mainDetail {
  overflow: visible;

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

  .contentWrap {
    font-family: PingFangSC-Medium;
    overflow: visible;

    .content {
      .infoContent {
        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }
      }

      .lineInfo {
        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 11px;
            border-bottom: 1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 9px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: var(--color-font-default, #1b1e2b);
              line-height: 22px;
            }
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  height: 100%;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  div {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        color: var(--color-font-default-b);
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(2) {
        margin-bottom: 0;

        span {
          color: var(--color-font-default, #1b1e2b);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      line-height: 24px;
    }
  }

  > li {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    margin-bottom: 2px;

    &:nth-of-type(1) {
      padding-top: 9px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default, #1b1e2b);
      line-height: 22px;

      &:nth-child(2) {
        color: var(--color-font-default-b);
        display: inline-block;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.card {
  width: 100%;
  color: #666666;
  background: var(--color-bg-default);

  .card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align: right;

    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;

    .code {
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default);
      font-weight: bold;

      .tag {
        display: inline-block;
        width: 6px;
        height: 14px;
        background: var(--color-other-default-b);
        border-radius: 1px;
        margin-right: 8px;
      }

      .place-holder {
        display: inline-block;
        width: 30px;
        height: 100%;
      }
    }

    .noWrap {
      width: 260px;
    }

    .head-num, .line-num {
      span {
        font-size: 14px;
        color: #C6CAD6;
      }
    }
  }

  .sub-single-title {
    padding: 0 20px;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }

  ul {
    padding: 0 5.333vw 8px 5.333vw;

    li {
      display: flex;
      line-height: 32px;
      margin-top: 2px;
      font-size: 14px;
      color: var(--color-font-default);

      &:first-child {
        margin-top: 8px;
      }

      > span {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);

        .fileBtn {
          color: var(--color-other-default-b);
        }
      }

      > span:nth-child(1) {
        text-align: left;
      }
    }

    .name-title {
      display: flex;
      align-items: center;
      position: relative;

      span:first-child {
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;
        font-weight: bold;
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
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }

      .item-name {
        line-height: 22px;
        padding: 14px 0;
        font-weight: 700;
      }

      .item-num {
        height: 20px;
        margin-left: 8px;
        padding: 0 4px;
        font-size: 10px;
        color: var(--color-other-default-b);
        line-height: 20px;
        border-radius: 2px;
        background: var(--color-bg-default-c);
      }
    }

    .name-title:before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--color-other-default-b);
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.card-personalized {
  width: 100%;
  color: #666666;
  padding 15px;
  position: relative;
  background: var(--color-bg-default);

  .card-first-single {
    text-align: left;
    font-size: 14px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 22px;
  }

  .card-first-between {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
}
.icon-chevron-right {
    font-size 14px;
    color: var(--font-color-default);
}
.change-line-tip{
  width: 100%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #E11900;
  font-size: 12px;
  font-weight: 500;
  background: #FFEFED;
  position: absolute;
  left:0;
  top:0;
}
.change-tabs{
  >>>.srm-tab-bar{
    height:32px;
    .srm-tab-bar-box{
      max-width: 134px;
      height: 20px;
      margin: 6px 0 0 6px;
      background: #EEEEEE;
      border-radius: 20px;
    }
    .srm-tab-bar-button{
      height:20px;
      padding: 0 6px;
      font-size:12px;
    }
    .srm-tab-bar-button-active{
      color: #000;
      background: #FFF;
      border:1px solid rgba(226,226,226,1);
      border-radius: 20px;
    }
  }
}
</style>
