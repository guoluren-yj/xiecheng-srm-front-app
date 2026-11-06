<template>
  <!-- 发货工作台 -->
  <div>
    <srm-scroll-tab ref="srmScrollTab">
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getBasicColumns(commonInfo.tab, commonInfo.node)"
                  :customize-code="getCustomizeCode('basicInfo', commonInfo.node)"
                  @itemClick="clickDetailInfo('basicInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 发货信息 -->
      <srm-scroll-tab-item v-if="httpNum" :label="getLanguageDefine('shipInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getShipInfoColumns()"
                  :customize-code="getCustomizeCode('shipInfo', commonInfo.node)"
                  @itemClick="clickDetailInfo('shipInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 收货信息 -->
      <srm-scroll-tab-item v-if="httpNum" :label="getLanguageDefine('receiveInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getReceiveInfoColumns()"
                  :customize-code="getCustomizeCode('receiveInfo', commonInfo.node)"
                  @itemClick="clickDetailInfo('receiveInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('lineInfo')" :show-title="false" style="position: relative;">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ getLanguageDefine('lineInfo') }}
        </div>
        <!-- 开关 待处理行/全部行 -->
        <div v-if="isShowHandleAndAllBtn" class="switch-div">
          <div :class="{'checked-left-div': currentLine === 'handleLine'}"
               style="position: absolute;left: 0;"
               @click="toggleLineBtn('handleLine')">
            {{ getLanguageDefine("handleLine") }}
          </div>
          <div :class="{'checked-right-div': currentLine === 'allLine'}"
               style="position: absolute;right: 0;"
               @click="toggleLineBtn('allLine')">
            {{ getLanguageDefine("allLine") }}
          </div>
        </div>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto;border-top: 1px solid #f0f2f5;"
                  :show-bottom-bar="false"
                  :data-set="currentLine === 'handleLine' ? asnLineDataSetByHandle : asnLineDataSetByAll"
                  :columns="getLineInfoColumns(commonInfo.node)"
                  :customize-code="getCustomizeCode('lineInfo', commonInfo.node)"
                  @itemClick="clickDetailInfo('lineInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item v-if="httpNum" :label="getLanguageDefine('attachInfo')">
        <srm-list :scrollable="false"
                  :data-set="commonDataSet"
                  :customize-code="getCustomizeCode('attachInfo', commonInfo.node)"
                  :columns="getAttachInfoColumns()"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item :label="getLanguageDefine('operating')">
        <div>
          <history-record-tiled
            :action-data="operatingData"
            :remark-label="$T('slod.common.model.common.remark').$D('备注')"
            operation-meaning-field-name="fieldMeaning"
            process-remark-field-name="name"
            operator-field-name="operator"
            process-date-field-name="createDate"/>
        </div>
        <div class="bottom-button-space" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 基本信息细信息 -->
    <srm-popup :visible="basicFlag" position="right" :show-header="false" @onClose="scorePopupCloseBefore('basicInfoDetail')">
      <srm-form customize-type="detail" :columns="getBasicDetailColumns(commonInfo.node)" :data-set="commonDataSet" :customize-code="getDetailCustomizeCode('basicInfoDetail', commonInfo.node)"/>
    </srm-popup>
    <!-- 发货信息细信息 -->
    <srm-popup :visible="shipFlag" position="right" :show-header="false" @onClose="scorePopupCloseBefore('shipInfoDetail')">
      <srm-form customize-type="detail" :columns="getShipInfoDetailColumns()" :data-set="commonDataSet" :customize-code="getDetailCustomizeCode('shipInfoDetail', commonInfo.node)"/>
    </srm-popup>
    <!-- 收货信息细信息 -->
    <srm-popup :visible="receiveFlag" position="right" :show-header="false" @onClose="scorePopupCloseBefore('receiveInfoDetail')">
      <srm-form customize-type="detail" :columns="getReceiveInfoDetailColumns()" :data-set="commonDataSet" :customize-code="getDetailCustomizeCode('receiveInfoDetail', commonInfo.node)"/>
    </srm-popup>
    <!-- 行明细信息 -->
    <srm-popup :visible="lineVisible" position="right" :show-header="false" @onClose="scorePopupCloseBefore('lineInfoDetail')">
      <srm-form customize-type="detail" :columns="getLineInfoDetailColumns(commonInfo.tab, commonInfo.node)" :data-set="currentLine === 'handleLine' ? asnLineDataSetByHandle : asnLineDataSetByAll" :customize-code="getDetailCustomizeCode('lineInfoDetail', commonInfo.node)"/>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
// import { isEmpty } from "lodash";
import { nodeDs, asnLineDs, exportRecordDs } from "./datasource/commonDs";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import {
  getStatusCodeColor,
  getLanguage,
  getCustomize,
  getDetailCustomize,
} from "./utils";
import {
  getOperatingDataApi,
  getTemplateCuszApi,
  getHeadInfoApi,
  handWorkFlowSave,
  getHeaderAttachmentUuidApi,
} from "./api";
import Mixin from "./mixin/DetailColumns";
export default {
  modules: [ "slod.common", "hipspfm.common", "smbl.common" ],
  name: "DeliveryWorkbenchDetail",
  components: { HistoryRecordTiled },
  mixins: [ Mixin ],
  props: {
    parameters: {
      type: Object
    }
  },
  data() {
    return {
      getLanguageDefine: getLanguage,
      getCustomizeCode: getCustomize,
      getDetailCustomizeCode: getDetailCustomize,
      // 列表传过来的数据
      commonInfo: {
        node: "ASN",
      },
      // 送货单头信息
      commonDataSet: new DataSet(nodeDs(this.commonInfo)),
      // 送货单待处理行信息
      asnLineDataSetByHandle: new DataSet(asnLineDs(this.commonInfo)),
      // 送货单全部行信息
      asnLineDataSetByAll: new DataSet(asnLineDs(this.commonInfo)),
      // 操作记录
      operatingData: [],
      // 导出记录
      exportRecordDataSet: new DataSet(exportRecordDs(this.commonInfo)),
      httpNum: false,
      // 单据样式模版
      tempInfo: {},
      // 头信息
      headInfo: {},
      // 个性化单元集合
      uiTemp: "",
      custCode: "",
      basicFlag: false,
      shipFlag: false,
      receiveFlag: false,
      lineVisible:false,
      // 展示变更按钮
      updateFlag: true,
      // 展示待处理行/全部行
      isShowHandleAndAllBtn: false,
      // 当前选择的行
      currentLine: "handleLine",
      // 存储待处理行 编辑状态
      saveEditState: false,
      // 行不可编辑
      lineReadOnly: false,
      // 物流信息
      logisticsInfo: [],
      logisticsInfoLoading: false,
      logisticsInfoOther: {},
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "basicInfo":
          if (this.commonInfo.tab === "all") {
            return [
              {
                fieldCode: "displayAsnNum",
                fieldType: "EMPTY",
                render: (val, item) => <srm-list-header show-open-tag={true}>
                  <span>{ item.displayAsnNum }</span>
                  <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
                </srm-list-header>,
                formRow: 1,
              },
              {
                fieldCode: "asnTypeCodeMeaning",
                formRow: 2,
              },
              {
                fieldCode: "createdName",
                formRow: 3,
              },
              {
                fieldCode: "creationDate",
                formRow: 3,
              }
            ];
          }
          return [
            {
              fieldCode: "displayAsnNum",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.displayAsnNum }</span>
                <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
              </srm-list-header>,
              formRow: 1,
            },
            {
              fieldCode: "createdName",
              formRow: 2,
            },
            {
              fieldCode: "creationDate",
              formRow: 2,
            }
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "displayAsnNum",
            },
            {
              fieldCode: "nodeConfigName",
            },
            {
              fieldCode: "asnTypeCodeMeaning",
            },
            {
              fieldCode: "statusCodeMeaning",
            },
            {
              fieldCode: "createdName",
            },
            {
              fieldCode: "creationDate",
            },
          ];
        case "shipInfo":
          return [
            {
              fieldCode: "supplierCompanyName",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.supplierCompanyName }</span>
              </srm-list-header>,
            },
            {
              fieldCode: "shipDate",
              editor: false,
            },
            {
              fieldCode: "expectedArriveDate",
              editor: false,
            },
            {
              fieldCode: "deliveryAddress",
              editor: false,
            },
          ];
        case "shipInfoDetail":
          return [
            {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "shipDate",
              editor: false,
            },
            {
              fieldCode: "expectedArriveDate",
              editor: false,
            },
            {
              fieldCode: "deliveryAddress",
              editor: false,
            },
            {
              fieldCode: "shipTotalQuantity",
            },
            {
              fieldCode: "shipTaxIncludedAmount",
            },
            {
              fieldCode: "transportTypeMeaning",
            },
            {
              fieldCode: "logisticsCompanyName",
            },
            {
              fieldCode: "carNumber",
              editor: false,
            },
            {
              fieldCode: "expressNum",
              editor: false,
            },
            {
              fieldCode: "logisticsStaff",
              editor: false,
            },
            {
              fieldCode: "logisticsPhoneNumber",
              render: (val, item) => <span>{item.internationalTelCode} | {item.logisticsPhoneNum}</span>
            },
            {
              fieldCode: "purchaseRemark",
            },
            {
              fieldCode: "supplierRemark",
            }
          ];
        case "receiveInfo":
          return [
            {
              fieldCode: "companyName",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.companyName }</span>
              </srm-list-header>,
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "receiveAddress",
              editor: false,
            },
          ];
        case "receiveInfoDetail":
          return [
            {
              fieldCode: "companyName",
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "receiveAddress",
              editor: false,
            },
            {
              fieldCode: "contactName",
              editor: false,
            },
            {
              fieldCode: "contactTelNumber",
              render: (val, item) => <span>{item.internationalTelCode} | {item.contactTelNum}</span>
            },
          ];
        case "lineInfo":
          return [
            {
              fieldCode: "itemCode",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={false}>
                <span>{ item.itemCode || "-" }</span>
                <span slot="right" style={getStatusCodeColor(item.lineStatus)}>{ item.lineStatusMeaning }</span>
              </srm-list-header>,
              formRow: 1,
            },
            {
              fieldCode: "itemName",
              formRow: 2,
            },
            {
              fieldCode: "displayUom",
              formRow: 3
            },
            {
              fieldCode: "displayAsnLineNum",
              formRow: 3
            },
            {
              fieldCode: "actualQuantity",
              editor: false,
              formRow: 4,
            },
            {
              fieldCode: "quantity",
              editor: false,
              formRow: 5
            },
          ];
        case "lineInfoDetail":
          return [
            {
              fieldCode: "lineStatusMeaning",
            },
            {
              fieldCode: "displayAsnLineNum",
            },
            this.commonInfo.tab === "all" && {
              fieldCode: "exportRecord",
              render: (val, item) => item.lineExportStatusMeaning ? <span style="color: var(--color-other-default-b)">{item.lineExportStatusMeaning}</span> : "-",
              callBack: async (item) => {
                if (item.lineExportStatusMeaning) {
                  this.exportRecord({ lineId: item.asnLineId }, true);
                }
              }
            },
            {
              fieldCode: "itemCode",
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "displayUom",
            },
            this.commonInfo.tab !== "affirm" && {
              fieldCode: "sourceQuantity",
            },
            {
              fieldCode: "quantity",
              editor:false,
            },
            {
              fieldCode: "actualQuantity",
              editor: false,
            },
            {
              fieldCode: "unitPackageQuantity",
              editor:false,
            },
            {
              fieldCode: "packageQuantity",
            },
            {
              fieldCode: "remainderQuantity",
            },
            {
              fieldCode: "netWeight",
              editor: false,
            },
            {
              fieldCode: "grossWeight",
              editor: false,
            },
            {
              fieldCode: "lotNum",
              editor: false,
            },
            {
              fieldCode: "productionDate",
              editor: false,
            },
            {
              fieldCode: "lotExpirationDate",
              editor: false,
            },
            {
              fieldCode: "serialNum",
              editor: false,
            },
            {
              fieldCode: "fromDisplayPoNum",
              render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
            },
            {
              fieldCode: "fromDisplayPoLocationNum",
            },
            {
              fieldCode: "sourceDisplayNum",
              render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
            },
            {
              fieldCode: "sourceNodeConfigName",
            },
            {
              fieldCode: "purchaseLineRemark",
              editor:false,
            },
            {
              fieldCode: "supplierLineRemark",
            },
            {
              fieldCode: "deliveryAddress",
              editor:false,
            },
            {
              fieldCode: "receiveAddress",
              editor:false,
            },
            {
              fieldCode: "shipToLocContName",
            },
            {
              fieldCode: "shipToLocTelNum",
            },
            {
              fieldCode: "productNum", // 商品编码
            },
            {
              fieldCode: "productName", // 商品名称
            },
            {
              fieldCode: "catalogName", // 商品目录
            },
            {
              fieldCode: "creationDate", // 创建时间
            },
            {
              fieldCode: "createdName", // 创建人
            },
            {
              fieldCode: "purchaseLineAttachmentUuid",
            },
            {
              fieldCode: "supplierLineAttachmentUuid",
            },
            {
              fieldCode: "splitFlag",
              render: (val, item) => item.splitFlagMeaning,
            },
            {
              fieldCode: "occupiedQuantity",
            },
            {
              fieldCode: "changingFlag",
              render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
            },
          ];
        case "attachInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "purchaseAttachmentUuid",
              render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  onFileUpload: () => this.getSaveAttachmentUuid(item),
                  attachments: [ {
                    attachmentUuid: item.purchaseAttachmentUuid,
                    bucketName: "public-bucket",
                    title: $T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件"),
                    displayType: "list",
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="primary" plain>{$T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 10,
            },
            {
              fieldType: "EMPTY",
              render: () => <srm-blank size="1px" theme="fill"/>,
              formRow: 20,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "supplierAttachmentUuid",
              render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    attachmentUuid: item.supplierAttachmentUuid,
                    tenantId: SrmUtil.getTenantId(),
                    bucketName: "public-bucket",
                    title: $T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件"),
                    displayType: "list",
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="primary" plain>{$T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 30,
            },
          ];
        case "exportRecord":
          return [
            {
              fieldCode: "exportTypeMeaning",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
                <span>{ item.exportTypeMeaning }（{ item.exportType || "-"}）</span>
                <span slot="right">{ item.exportStatusMeaning }</span>
              </srm-list-header>,
            },
            {
              fieldCode: "synchronous",
              render: (val, item) => <span style={{
                color: [ "FAIL" ].includes(item.exportStatus) ? "var(--color-other-default-b)" : "",
              }}>
                {$T("slod.common.model.common.sync").$D("重新同步")}
              </span>,
              callBack: (item) => {
                this.exportRecord(item);
              },
            },
            {
              fieldCode: "exportMessage",
            },
            {
              fieldCode: "externalSystemCode",
            }
          ];
        default:
          return [];
        }
      };
    },
  },
  async beforeMount() {
    this.$loading.show();
    this.commonInfo = this.parameters;
    this.httpNum = [ "ASN" ].includes(this.commonInfo.node);
    this.custCode = this.commonInfo.node === "ASN" ? `SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_HEADER,SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_SHIPMENTS,SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_DELIVERY,SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_DELIVERY,DETAIL_ATTACHMENT,SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_LIST` : this.commonInfo.node === "PLAN" ? `SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_HEADER,SLOD.DELIVERY__WORKBENCH_${this.commonInfo.node}_A.DETAIL_LIST` : null;
    this.uiTemp = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.BASIC.CARD,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.BASIC.DETAIL,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.SHIP.CARD,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.SHIP.DETAIL,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.RECEIVE.CARD,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.RECEIVE.DETAIL,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.LINE.CARD,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.LINE.DETAIL,SMBL.WORKFLOW.DELIVERY_WORKBENCH.${this.commonInfo.node}.ATTACH.CARD`;
    // 查询头信息
    await this.searchHead();
    // 处理行赋值参数
    this.asnLineDataSetByHandle.addQueryParameter("cuszTplTemplateCode", this.tempInfo.templateCode);
    this.asnLineDataSetByHandle.addQueryParameter("cuszTplVersion", this.tempInfo.templateVersion);
    this.asnLineDataSetByHandle.addQueryParameter("customizeUnitCode", this.uiTemp);
    this.asnLineDataSetByHandle.addPathParameter("id", this.commonInfo.deliveryHeaderId);
    this.asnLineDataSetByHandle.addPathParameter("nodeConfigId", this.commonInfo.nodeConfigId);
    this.asnLineDataSetByHandle.addPathParameter("nodeTemplateCode", this.commonInfo.node);
    this.asnLineDataSetByHandle.addQueryParameter("editableFlag", "3");
    // 全部行赋值参数
    this.asnLineDataSetByAll.addQueryParameter("cuszTplTemplateCode", this.tempInfo.templateCode);
    this.asnLineDataSetByAll.addQueryParameter("cuszTplVersion", this.tempInfo.templateVersion);
    this.asnLineDataSetByAll.addQueryParameter("customizeUnitCode", this.uiTemp);
    this.asnLineDataSetByAll.addPathParameter("id", this.commonInfo.deliveryHeaderId);
    this.asnLineDataSetByAll.addPathParameter("nodeConfigId", this.commonInfo.nodeConfigId);
    this.asnLineDataSetByAll.addPathParameter("nodeTemplateCode", this.commonInfo.node);
    this.asnLineDataSetByHandle.addQueryParameter("editableFlag", null);

    // 查询行信息
    await this.searchLine();
    this.$loading.hide();
    const operatingType = SrmUtil?.getDocFlowFlag() || "";
    // 操作记录
    const template = this.commonInfo.node === "UNIQUE_LABEL" ? "LABEL".toLowerCase() : this.commonInfo.node.toLowerCase();
    try {
      const params1 = {
        tableName: `slod_${template}_header`,
        tablePk: this.commonInfo.deliveryHeaderId,
      };
      const params2 = {
        nodeTemplateCode: this.commonInfo.node,
        deliveryHeaderId: this.commonInfo.deliveryHeaderId,
      };
      this.operatingData = await getOperatingDataApi([ "1" ].includes(operatingType) ? params1 : params2, operatingType);
    } catch (e) {
      // 截取状态码
      // this.httpNum = ![ "500" ].includes(e?.message?.replace(/[^0-9]/ig, ""));
      console.info(e);
    }
    console.log(this.isShowHandleAndAllBtn, "isShowHandleAndAllBtn");
  },
  methods: {
    beforeApprove() {
      return new Promise((resolve, reject) => {
        const validateLine = this.asnLineDataSetByHandle.validate();
        const validateAll = this.asnLineDataSetByAll.validate();
        const validates = this.currentLine === "handleLine" ? validateLine : validateAll;
        try {
          if (!(this.commonDataSet.validate() && validates)) {
            throw new Error($T("slod.common.model.common.textVerify").$D("必输字段校验"));
            // return;
          }
          handWorkFlowSave(this.commonInfo.node, [
            `customizeUnitCode=${this.custCode}`,
            "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
            "cuszTplStageCode=SUBMIT",
            `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
            `cuszTplVersion=${this.tempInfo.templateVersion}`,
          ],
          [
            {
              ...this.commonDataSet.toData()[0],
              deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
            }
          ]).then((res) => {
            if (res && !res.failed) {
              resolve();
            } else {
              reject(res?.message);
            }
          });
        } catch (e) {
          reject(e.message);
        }
      });
    },
    calculation(type, num1, num2) {
      let temp1, temp2, a;
      try {
        // 获取temp1小数点后的长度
        temp1 = num1.toString().split(".")[1].length;
      } catch (e) {
        temp1 = 0;
      }
      try {
        // 获取temp2小数点后的长度
        temp2 = num2.toString().split(".")[1].length;
      } catch (e) {
        temp2 = 0;
      }
      // Math.max(temp1, temp2) 为了获取temp1和temp2两个值中较大的一个
      // Math.pow(a,b) 表示 a 的 b 次方
      a = Math.pow(10, Math.max(temp1, temp2));

      // 计算的方式是先将所有的小数乘为整数，待加减运算执行完之后再除去对应的 a 的值，将其变为小数输出
      // 先判断执行的方式是否是加法，不是的话则执行减法运算
      return type === "add" ? (num1 * a + num2 * a) / a : (num1 * a - num2 * a) / a;
    },
    // 块详情
    clickDetailInfo(tabItem) {
      if (tabItem === "basicInfoDetail") {
        this.basicFlag = true;
      }
      if (tabItem === "shipInfoDetail") {
        this.shipFlag = true;
      }
      if (tabItem === "receiveInfoDetail") {
        this.receiveFlag = true;
      }
      if (tabItem === "lineInfoDetail") {
        this.lineVisible = true;
      }
    },
    scorePopupCloseBefore(tabItem) {
      if (tabItem === "basicInfoDetail") {
        this.basicFlag = false;
      }
      if (tabItem === "shipInfoDetail") {
        this.shipFlag = false;
      }
      if (tabItem === "receiveInfoDetail") {
        this.receiveFlag = false;
      }
      if (tabItem === "lineInfoDetail") {
        this.lineVisible = false;
      }
      return true;
    },
    // 导出记录
    async exportRecord(item = {}, lineFlag = false) {
      if (item.exportStatus) {
        if (item.exportStatus === "FAIL") {
          // 重新同步
          this.exportRecordDataSet.addPathParameter("id", item.recordId);
          this.exportRecordDataSet.addPathParameter("nodeTemplateCode", this.commonInfo.node);
          this.exportRecordDataSet.submitRecords([ this.exportRecordDataSet.current ]).then(() => {
            this.exportRecordDataSet.refresh();
          });
        }
        return;
      }
      this.$loading.show();
      this.exportRecordDataSet.addPathParameter("deliveryLineId", lineFlag ? item.lineId : null);
      await this.exportRecordDataSet.refresh();
      this.$loading.hide();
      this.$popup({
        title: $T("slod.common.model.common.exportRecord").$D("导出记录"),
        showHeader: true,
        showClose: true,
        height: "80%",
        position: "bottom",
        content: <srm-list scrollable={false}
          height="auto"
          style="height: auto"
          data-set={this.exportRecordDataSet}
          columns={this.getExportRecordColumns("exportRecord")}/>,
      });
    },
    // 行按钮
    toggleLineBtn(f) {
      if (f === "edit") {
        if (this.currentLine === "handleLine") {
          this.saveEditState = this.asnLineDataSetByHandle.editFlag;
        } else {
          this.saveEditState = this.asnLineDataSetByAll.editFlag;
        }
      } else if (f === "cancel") {
        if (this.currentLine === "handleLine") {
          this.saveEditState = this.asnLineDataSetByHandle.editFlag;
        } else {
          this.saveEditState = this.asnLineDataSetByAll.editFlag;
        }
      } else if (f === "handleLine") {
        this.currentLine = f;
        this.lineReadOnly = false;
        this.asnLineDataSetByHandle.addQueryParameter("editableFlag", "3");
        this.asnLineDataSetByHandle.refresh();
      } else {
        this.currentLine = f;
        // 全部行不能编辑
        this.lineReadOnly = true;
        this.asnLineDataSetByAll.addQueryParameter("editableFlag", null);
        this.asnLineDataSetByAll.refresh();
      }
    },
    // 查询头
    async searchHead() {
      if (!this.tempInfo.templateCode) {
        this.tempInfo = await getTemplateCuszApi({
          businessParam: {
            deliveryHeaderId: this.commonInfo.deliveryHeaderId,
            node: this.commonInfo.node.toUpperCase(),
            nodeConfigId: this.commonInfo.nodeConfigId,
          },
          templateCuszMethodCode: `SLOD_SHIP_WORKSPACE_${this.commonInfo.node.toUpperCase()}_DETAIL`,
        });
      }
      // 查询头信息
      const params = {
        deliveryHeaderId: this.commonInfo.deliveryHeaderId,
        node: this.commonInfo.node.toUpperCase(),
        nodeConfigId: this.commonInfo.nodeConfigId,
      };
      this.headInfo = await getHeadInfoApi(params, {
        customizeUnitCode: this.uiTemp,
        cuszTplTemplateCode: this.tempInfo.templateCode,
        cuszTplVersion: this.tempInfo.templateVersion,
        cuszTplStageCode: "AFFIRM",
        cuszTplPageCode: "DELIVERY_WORKBENCH.DETAIL",
      });
      this.commonDataSet.reset();
      // 附件无值时，需要赋初始值才可以进行上传操作
      const { purchaseAttachmentUuid, supplierAttachmentUuid } = this.headInfo;
      if (!purchaseAttachmentUuid) {
        this.headInfo["purchaseAttachmentUuid"] = uuid();
      }
      if (!supplierAttachmentUuid) {
        this.headInfo["supplierAttachmentUuid"] = uuid();
      }
      this.commonDataSet.setData([ { ...this.headInfo } ]);
      this.commonDataSet.locate(0);
      this.logisticsInfoLoading = true;
      this.exportRecordDataSet.addQueryParameter("nodeTemplateCode", this.commonInfo.node);
      this.exportRecordDataSet.addQueryParameter("deliveryHeaderId", this.commonInfo.deliveryHeaderId);
    },
    // 查询行
    async searchLine() {
      const num = this.currentLine === "handleLine" ? "3" : null;
      this.asnLineDataSetByHandle.addQueryParameter("editableFlag", num);
      await this.asnLineDataSetByHandle.refresh();
      // this.headInfo.statusCode === "PART_PROCESSED" &&
      if (this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0) {
        // 是否展示 待处理行和全部行
        this.isShowHandleAndAllBtn = true;
        this.currentLine = "handleLine";
      } else if (this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length === 0) {
        // 待确认页面 待处理行数据为空，只展示全部行
        this.isShowHandleAndAllBtn = false;
        this.currentLine = "allLine";
        this.lineReadOnly = true;
        this.asnLineDataSetByAll.refresh();
      }
    },
    // 附件上传成功后调用保存uuid
    getSaveAttachmentUuid() {
      const data = { ...this.commonDataSet.toData()[0] };
      let that = this;
      getHeaderAttachmentUuidApi({
        asnHeaderId: data?.asnHeaderId,
        objectVersionNumber: data?.objectVersionNumber,
        _token: data?._token,
        statusCode: data?.statusCode,
        purchaseAttachmentUuid: data?.purchaseAttachmentUuid,
      }).then((res) => {
        if (res && !res.failed) {
          that.commonDataSet.reset();
          that.commonDataSet.setData([ {
            ...data,
            purchaseAttachmentUuid: res?.purchaseAttachmentUuid,
            objectVersionNumber: res?.objectVersionNumber,
          } ]);
        }
      });
    },
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
>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;
}

.line-filter {
  .list-tool-tab {
    width: 200px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
  .icon-ambulance {
    color var(--font-color-primary);
    margin-right: 4px;
  }
}

.text{
  font-weight: 600;
}
.tag-ste{
  padding: 2px 4px !important;
  font-size: 12px !important;
}
.title-text{
  font-weight:400;
}
</style>