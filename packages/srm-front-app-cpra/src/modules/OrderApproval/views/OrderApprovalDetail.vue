<template>
  <div style="height: 100vh">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button
            size="small"
            type="warn"
            icon="icon-clock"
            @click="showOperationPop">
            <span>{{
              $T("hipspfm.common.message.title.operationRecord").$D("操作记录")
            }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item
          :label="
            $T('hipspfm.common.view.message.title.orderHeaderInfo').$D(
              '订单头信息'
            )
          ">
          <customize
            :need-padding="true"
            code="SMBL.ORDER_APPROVAL.HEAD_INFO"
            :data-source="headInfo"
            :columns="getOrderHeadInfoColumns"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item
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
          <div
            v-for="(item, index) in lineInfo"
            :key="index"
            @click="showLineDetail(item)">
            <div
              v-show="item && item.changeMap && 'insertFlag' in item.changeMap"
              class="change-line-tip">
              {{
                $T("sodr.common.model.common.newChangeLine").$D(
                  "该行是变更时新增行"
                )
              }}
            </div>
            <customize
              :need-padding="true"
              code="SMBL.ORDER_APPROVAL.LINE_INFO"
              :data-source="item"
              :columns="getOrderLineInfoColumns"/>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup
      :visible.sync="visible"
      height="100%"
      position="right"
      :title="
        $T('hipspfm.orderApproval.view.message.title.orderDetail').$D(
          '订单详情'
        )
      ">
      <div style="height: 100%; overflow: auto">
        <customize-detail
          :need-padding="true"
          code="SMBL.ORDER_APPROVAL.LINE_INFO_DETAIL"
          :data-source="currentLineInfo"
          :columns="getOrderLineDetailInfoColumns"/>
      </div>
    </srm-popup>
    <srm-bottom-handler :btn-arr="getBtnArr" />

    <!-- 历史记录弹窗 -->
    <history-record
      v-model="operationPopup"
      :action-data="operationArr"
      :remark-label="
        $T('smbl.common.view.title.operationRemark').$D('操作说明')
      "
      operator-field-name="processUserName"
      process-remark-field-name="processRemark"
      operation-meaning-field-name="processTypeMeaning"
      process-date-field-name="processedDate"/>
  </div>
</template>

<script>
/*eslint-disable*/
import HistoryRecord from "@/components/HistoryRecord";
import { adoptApi, rejectApi } from "../api";
import {
  getOrderHeaderApi,
  getOrderLineApi,
  getOpRecordApi,
  queryDoubleUomConfigApi,
} from "../api/index";
import { getDynamicLabel } from "../../../utils";
// import {SrmMath} from 'srm-mobile-ui';
import { SrmUtil } from "srm-mobile-ui";
import { isNil } from "lodash";
import { SrmTooltip } from "srm-mobile-ui";
import { SrmTabBar, SrmTabItem } from "srm-mobile-ui";
import BigNumber from "bignumber.js";

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
    "hipspfm.orderApproval",
    "spuc.common",
    "ssrc.inquiryHall",
    "smbl.common",
    "sodr.common",
    "sprm.common",
    "sodr.workspace",
  ],
  name: "DeliveryBillDetail",
  components: {
    HistoryRecord,
  },
  data() {
    return {
      // tabs: ["仅展示待处理行", "全部行"],
      tabs: [
        this.$T("sodr.common.model.common.changeLineDisplay").$D(
          "仅展示变更行"
        ),
        this.$T("sodr.common.model.common.allDisplay").$D("全部行"),
      ],
      orgName: "",
      poHeaderId: "",
      operationArr: [], // 操作记录
      headInfo: {}, //头信息
      lineInfo: [], //行信息
      operationPopup: false, //操作记录弹窗标识
      logisticsPop: false, //物流信息标识
      visible: false, //行信息弹窗
      currentLineInfo: {}, //当前行信息
      storeInfoFlag: false, //门店信息弹窗
      storeInfoDs: {},
      isDoubleUnit: false,
    };
  },
  computed: {
    // remarkLabel() {
    //   return this.$T("smbl.common.view.description").$D("说明");
    // },
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    isSanJiang() {
      return SrmUtil.getTenantNum() === "SRM-SANJIANG";
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          // fieldName: "送货单号",
          fieldCode: "displayPoNum",
          // langCode: "sinv.purchaseReception.view.message.asnNum",
        },
        {
          fieldName: this.$T(
            "hipspfm.orderApproval.model.orderApproval.netPrice"
          ).$D("含税总金额"),
          fieldCode: "taxIncludeAmount",
          render: (val, record, field) => {
            const length = this.$options.filters.calcCurrencyPrecision(
              this.headInfo.currencyCode,
              "financialPrecision"
            );
            // const dom = val
            //   ? this.$options.filters.calcMultipleDelimiter(
            //       new BigNumber(val),
            //       length
            //     )
            //   : "-";
            // if (!isNil(val)) {
            //   return this.renderChangeTip(field, record, dom);
            // }
            const dom = this.$options.filters.calcMultipleDelimiter(
              new BigNumber(val),
              length
            );
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.versionNum").$D(
            "版本号"
          ),
          fieldCode: "versionNum",
        },
      ];

      return columns;
    },
    // 送货单头信息
    getOrderHeadInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.common.message.company").$D("公司"),
          fieldCode: "companyName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T(
            "hipspfm.orderApproval.model.orderApproval.uoId"
          ).$D("业务实体"),
          fieldCode: "orgName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("hipspfm.common.message.supplier").$D("供应商"),
          fieldCode: "supplierName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.poTypeCode").$D(
            "订单类型"
          ),
          fieldCode: "poTypeDesc",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.purOrganizationId"
          ).$D("采购组织"),
          fieldCode: "purchaseOrgName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.agentName").$D(
            "采购员"
          ),
          fieldCode: "agentName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T(
            "hipspfm.orderApproval.model.orderApproval.releasedDate"
          ).$D("发布时间"),
          fieldCode: "releasedDate",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.remark").$D(
            "订单摘要"
          ),
          fieldCode: "remark",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
      ];
      return columns;
    },
    // 订单行信息
    getOrderLineInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          langCode: "sodr.orderApproval.model.common.displayLineNum",
          render: (val, item) => (
            <SrmListHeader>
              <span>{item.itemName}</span>
              <span slot="right">
                {this.$T("sodr.orderApproval.model.common.displayLineNum").$D(
                  "行号"
                )}
                ：{item.lineNum}
              </span>
            </SrmListHeader>
          ),
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
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.orderApproval.model.common.quantity").$D(
            "数量"
          ),
          fieldCode: "secondaryQuantity",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
            }
          },
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
            }
          },
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.taxedEnteredUnitPrice"
          ).$D("原币含税单价"),
          fieldCode: "enteredTaxIncludedPrice",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
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
            const dom = this.$options.filters.CalcDate(val);
            return this.renderChangeTip(field, item, dom);
          },
        },
      ];
      return columns;
    },
    // 送货单行详细信息
    getOrderLineDetailInfoColumns() {
      const isBJGD = SrmUtil.getTenantNum() === "SRM-BJHL";
      const columns = [
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.displayLineNum"
          ).$D("行号"),
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.shipmentNum").$D(
            "发运号"
          ),
          fieldCode: "displayLineLocationNum",
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
          fieldName: this.$T("sodr.orderApproval.model.common.description").$D(
            "物料名称"
          ),
          fieldCode: "itemName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.orderApproval.model.common.unit").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.orderApproval.model.common.quantity").$D(
            "数量"
          ),
          fieldCode: "secondaryQuantity",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
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
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
            }
          },
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.taxedEnteredUnitPrice"
          ).$D("原币含税单价"),
          fieldCode: "enteredTaxIncludedPrice",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
            }
          },
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.taxedLineAmount"
          ).$D("含税行金额"),
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
        {
          fieldName: this.$T("sodr.orderApproval.model.common.taxRate").$D(
            "税率"
          ),
          fieldCode: "taxRate",
          render: (val, item, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, item, dom);
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
            const dom = this.$options.filters.CalcDate(val);
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.committedDeliveryDate"
          ).$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          render: (val, item, field) => {
            // eslint-disable-next-line new-cap
            const dom = this.$options.filters.CalcDate(val);
            return this.renderChangeTip(field, item, dom);
          },
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1"
          ).$D("年级"),
          fieldCode: "attributeVarchar1Meaning",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2"
          ).$D("学科"),
          fieldCode: "attributeVarchar2Meaning",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3"
          ).$D("课程类别"),
          fieldCode: "attributeVarchar3Meaning",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4"
          ).$D("总页码"),
          fieldCode: "attributeVarchar4",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5"
          ).$D("封面用纸"),
          fieldCode: "attributeVarchar5",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6"
          ).$D("封面印色"),
          fieldCode: "attributeVarchar6Meaning",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7"
          ).$D("内文用纸"),
          fieldCode: "attributeVarchar7",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8"
          ).$D("内文印色"),
          fieldCode: "attributeVarchar8Meaning",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9"
          ).$D("规格尺寸"),
          fieldCode: "attributeVarchar9",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10"
          ).$D("装订方式"),
          fieldCode: "attributeVarchar10Meaning",
        },
        isBJGD && {
          fieldName: this.$T(
            "spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11"
          ).$D("工艺"),
          fieldCode: "attributeVarchar11",
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.purchaserComments"
          ).$D("采购方行备注"),
          fieldCode: "remark",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        {
          fieldName: this.$T("sodr.common.model.common.newSourceNumAndLine").$D(
            "寻源单号-行号"
          ),
          fieldCode: "sourceNumAndLine",
          render: (val, item) => (
            <a style="color: blue" onClick={() => this.goSource(item)}>
              {val || item.sourceCodeNum}
            </a>
          ),
        },
      ];

      return columns;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          type: "danger",
          title: this.$T("hipspfm.common.message.reject").$D("拒绝"),
          handler: () => this.handlerPre("reject"),
        },
        {
          title: this.$T("hipspfm.common.message.pass").$D("通过"),
          handler: () => this.handlerPre("pass"),
        },
      ];
    },
    getTenantNum() {
      return SrmUtil.getTenantNum();
    },
  },
  async mounted() {
    this.orgName = this.$route.query.orgName;
    this.poHeaderId = this.$route.query.poHeaderId;
    this.getOrderHeader();
    this.getOrderLine();
    this.getOperationRecords();
    this.getDoubleUnitUom();
  },
  methods: {
    onIndexChange(index) {
      this.getOrderLine({ changeEditFlag: index === 0 ? 1 : 0 });
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    //获取订单头信息
    async getOrderHeader() {
      const params = {
        camp: 1,
        poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
        customizeUnitCode:
          "SODR.ORDER_APPROVE_LINE_LIST.HEADER,SODR.ORDER_APPROVE_LINE_LIST.DELIVERY_CATA",
      };
      const headInfo = await getOrderHeaderApi(this.poHeaderId, params);
      if (headInfo) {
        this.headInfo = { orgName: this.orgName, ...headInfo };
      }
    },
    //获取订单行信息
    getOrderLine(fields = {}) {
      this.$loading.show();
      let params = {};
      //晶科个性化
      if (this.getTenantNum === "SRM-BJHL") {
        params = {
          camp: 1,
          sortType: 1,
          ...fields,
          poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
          customizeUnitCode:
            "SODR.ORDER_APPROVE_LINE_LIST.APPROVE,SODR.ORDER_APPROVE_LINE_LIST.OTHER",
        };
      } else {
        params = {
          camp: 1,
          sortType: 1,
          ...fields,
          poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
        };
      }
      getOrderLineApi(this.poHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res && !res.empty) {
          this.lineInfo = res.content || [];
        }
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      this.$loading.show();
      await getOpRecordApi(this.poHeaderId).then((res) => {
        this.$loading.hide();
        //this.operationArr = res.content || [];
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
                    u.processTypeCode === "UPDATE" && !u.changeFieldNameMeaning
                      ? ""
                      : `\n${u.processUserName ?? ""} ${
                          u.processRemark
                            ? u.processRemark
                            : `${this.$T(
                                "sodr.workspace.model.operationRecord.take"
                              ).$D("将")}【${
                                u.changeFieldNameMeaning ?? ""
                              }】${this.$T(
                                "sodr.workspace.model.operationRecord.cause"
                              ).$D("由")}【${
                                u.priceShieldFlag ? "******" : u.oldValue ?? ""
                              }】${this.$T(
                                "sodr.workspace.model.operationRecord.change"
                              ).$D("改变为")}【${
                                u.priceShieldFlag ? "******" : u.newValue ?? ""
                              }】 ${
                                u.changeTableName === "SODR_PO_HEADER"
                                  ? ""
                                  : `${this.$T(
                                      "sodr.workspace.model.common.displayLineNum"
                                    ).$D("行号")}【${u.displayLineNum ?? ""}】`
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
          this.operationArr = data.map((e) => {
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
      });
    },
    //审批处理方法
    handlerPre(type) {
      if (type === "pass") {
        this.handleAdopt();
      } else {
        this.handleReject();
      }
    },
    // 拒绝该订单
    handleReject() {
      const that = this;
      this.$hips.dialog.confirm({
        content:
          that
            .$T("hipspfm.orderApproval.view.message.rejectOrderOrNot")
            .$D("是否拒绝该订单") + "?",
        okText: that.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: that.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          const params = that.buildParams("reject");
          that.$loading.show();
          rejectApi(params)
            .then((res) => {
              if (res) {
                if (res.length) {
                  that.$notification.open({
                    message: that
                      .$T("hipspfm.common.view.validation.rejectSuccess")
                      .$D("审批拒绝成功"),
                    class: "notification",
                  });
                  setTimeout(() => {
                    that.$router.back();
                  }, 1500);
                } else {
                  that.$hips.toast({ message: res.message });
                }
              }
            })
            .finally(() => {
              this.$loading.hide();
            });
        },
      });
    },
    // 通过该订单
    handleAdopt() {
      const that = this;
      this.$hips.dialog.confirm({
        content:
          that
            .$T("hipspfm.orderApproval.view.message.passOrderOrNot")
            .$D("是否通过该订单") + "?",
        okText: that.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: that.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          that.$loading.show();
          const params = that.buildParams("pass");
          adoptApi(params)
            .then((res) => {
              if (res) {
                if (res.length) {
                  that.$notification.open({
                    message: that
                      .$T("hipspfm.common.view.validation.approvelSuccess")
                      .$D("审批通过成功"),
                    class: "notification",
                  });
                  setTimeout(() => {
                    that.$router.back();
                  }, 1000);
                } else {
                  that.$hips.toast({ message: res.message });
                }
              }
            })
            .finally(() => {
              this.$loading.hide();
            });
        },
      });
    },
    // 处理传参
    buildParams(type) {
      let poLineDetailDTOs = [];
      const {
        _token,
        poHeaderId,
        objectVersionNumber,
        statusCode,
        sourceCode,
        poSourcePlatform,
        versionNum,
      } = this.headInfo;
      const headerInfo = type === "pass" ? this.headInfo : {};
      this.lineInfo.forEach((item) => {
        poLineDetailDTOs.push({
          _token: item._token,
          poHeaderId: item.poHeaderId,
          poLineId: item.poLineId,
          poLineLocationId: item.poLineLocationId,
          objectVersionNumber: item.objectVersionNumber,
          lineVersionNumber: item.lineVersionNumber,
          locationVersionNumber: item.locationVersionNumber,
          remark: item.remark,
        });
      });
      return [
        {
          poLineDetailDTOs,
          poHeaderDetailDTO: {
            ...headerInfo,
            _token,
            poHeaderId,
            objectVersionNumber,
            statusCode,
            sourceCode,
            poSourcePlatform,
            versionNum,
          },
        },
      ];
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
        } else {
          return <span style="color:red">{dom}</span>;
        }
      }
      return dom;
    },
    // 获取业务规则定义-双单位配置
    async getDoubleUnitUom() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    // 跳转寻源明细
    goSource(record) {
      const { sourceHeaderId: rfxHeaderId } = record;
      if (rfxHeaderId) {
        this.$router.push({
          path: "/appSour/RfxHallDetail",
          query: { rfxHeaderId },
        });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}

.change-line-tip {
  width: 100%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #E11900;
  font-size: 12px;
  font-weight: 500;
  background: #FFEFED;
}

.change-tabs {
  >>>.srm-tab-bar {
    height: 32px;

    .srm-tab-bar-box {
      max-width: 134px;
      height: 20px;
      margin: 6px 0 0 6px;
      background: #EEEEEE;
      border-radius: 20px;
    }

    .srm-tab-bar-button {
      height: 20px;
      padding: 0 6px;
      font-size: 12px;
    }

    .srm-tab-bar-button-active {
      color: #000;
      background: #FFF;
      border: 1px solid rgba(226, 226, 226, 1);
      border-radius: 20px;
    }
  }
}
</style>
