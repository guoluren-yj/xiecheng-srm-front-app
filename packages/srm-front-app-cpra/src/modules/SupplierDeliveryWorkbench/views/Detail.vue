<template>
  <!-- 发货工作台 -->
  <div>
    <srm-scroll-tab v-if="['all', 'submit', 'affirm'].includes(commonInfo.tab)" ref="srmScrollTab">
      <!-- 物流信息 -->
      <srm-scroll-tab-item v-if="commonInfo.tab === 'all' && commonInfo.node === 'ASN'" :label="getLanguageDefine('logisticsInfo')" :show-title="false">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ getLanguageDefine('logisticsInfo') }}
          <srm-flex v-if="logisticsInfoOther.logisticsTrackUrl" class="list-tool-tab">
            <!-- 轨迹地图 -->
            <srm-button type="primary" plain rect style="margin-left: 10px;" @click="toggleLineBtn('map')">
              <srm-flex direction="row">
                <!-- -ambulance -->
                <div class="icon-ambulance srm-icon"/>
                <span>{{ getLanguageDefine('map') }}</span>
              </srm-flex>
            </srm-button>
          </srm-flex>
        </div>
        <customize :columns="getLogisticsInfoColumns"
                   :data-source="logisticsInfoOther"
                   class="override-cus"/>
        <div v-if="logisticsInfoOther.lastUpdateDate" class="record-container">
          <logistics-info :action-data="logisticsInfo" :loading="logisticsInfoLoading"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getDetailHeaderColumns({ ...commonInfo, headerType: 'basicInfo' })"
                  :customize-code="getCustomizeCode(commonInfo, 'basicInfo')"
                  @itemClick="clickDetailInfo('basicInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 发货信息 -->
      <srm-scroll-tab-item v-if="commonInfo.node === 'ASN'" :label="getLanguageDefine('shipInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getDetailHeaderColumns({ ...commonInfo, headerType: 'shipInfo' })"
                  :customize-code="getCustomizeCode(commonInfo, 'shipInfo')"
                  @itemClick="clickDetailInfo('shipInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 收货信息 -->
      <srm-scroll-tab-item v-if="commonInfo.node === 'ASN'" :label="getLanguageDefine('receiveInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getDetailHeaderColumns({ ...commonInfo, headerType: 'receiveInfo' })"
                  :customize-code="getCustomizeCode(commonInfo, 'receiveInfo')"
                  @itemClick="clickDetailInfo('receiveInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('lineInfo')" :show-title="false" style="position: relative;">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ getLanguageDefine('lineInfo') }}
          <!-- 非全部tab页 -->
          <srm-flex v-if="commonInfo.tab !== 'all'" class="list-tool-tab">
            <!-- 编辑 -->
            <div v-if="!asnLineDataSetByHandle.editFlag && currentLine === 'handleLine'" class="icon-edit srm-icon" @click="toggleLineBtn('edit')"/>
            <!-- 取消 -->
            <srm-button v-if="asnLineDataSetByHandle.editFlag && currentLine === 'handleLine'" plain rect style="margin-left: 10px;" @click="toggleLineBtn('cancel')">
              {{ $T("hipspfm.common.button.cancle").$D("取消") }}
            </srm-button>
          </srm-flex>
          <!-- 全部tab页 -->
          <srm-flex v-if="commonInfo.tab === 'all'" class="list-tool-tab">
            <!-- 编辑 -->
            <div v-if="!asnLineDataSetByHandle.editFlag && !asnLineDataSetByAll.editFlag" class="icon-edit srm-icon" @click="toggleLineBtn('edit')"/>
            <!-- 取消 -->
            <srm-button v-if="asnLineDataSetByHandle.editFlag || asnLineDataSetByAll.editFlag" plain rect style="margin-left: 10px;" @click="toggleLineBtn('cancel')">
              {{ $T("hipspfm.common.button.cancle").$D("取消") }}
            </srm-button>
          </srm-flex>
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
                  :columns="getDetailLineColumns({...commonInfo, lineReadOnly, currentLine})"
                  :customize-code="getCustomizeCode(commonInfo, 'lineInfo')"
                  @itemClick="clickDetailInfo('lineInfoDetail')"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item v-if="commonInfo.node === 'ASN'" :label="getLanguageDefine('attachInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getDetailHeaderColumns({ ...commonInfo, headerType: 'attachInfo' })"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item v-if="httpNum" :label="getLanguageDefine('operating')">
        <div class="record-container">
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
      <div v-if="getButtons && getButtons.length > 0" class="approval-detail-bottom"/>
    </srm-scroll-tab>

    <!-- 行信息的拒绝、确认、删除按钮 -->
    <srm-list-bottom-bar v-if="asnLineDataSetByHandle.editFlag" :data-set="asnLineDataSetByHandle" :buttons="getLineButtons"/>
    <!-- 行信息的关闭按钮 -->
    <srm-list-bottom-bar v-if="asnLineDataSetByAll.editFlag" :data-set="asnLineDataSetByAll" :buttons="getLineButtons"/>

    <!-- 详情按钮 -->
    <srm-bottom-handler :btn-arr="getButtons" type="tooltip">
      <div v-if="commonInfo.tab === 'submit'"
           slot="left"
           style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px"
           @click="deleteRecord">
        <em class="srm-icon icon-trash" style="font-size: 24px;color: #cbcbcb"/>
      </div>
    </srm-bottom-handler>
    <!-- 基本信息细信息 -->
    <srm-popup :visible="basicFlag" position="right" :show-header="false" @onClose="scorePopupCloseBefore('basicInfoDetail')">
      <srm-form customize-type="detail" :columns="getDetailMoreHeaderColumns({ ...commonInfo, headerType: 'basicInfoDetail' })" :data-set="commonDataSet" :customize-code="getCustomizeCode(commonInfo, 'basicInfoDetail')"/>
    </srm-popup>
    <!-- 发货信息细信息 -->
    <srm-popup :visible="shipFlag" position="right" :show-header="false" @onClose="scorePopupCloseBefore('shipInfoDetail')">
      <srm-form customize-type="detail" :columns="getDetailMoreHeaderColumns({ ...commonInfo, headerType: 'shipInfoDetail' })" :data-set="commonDataSet" :customize-code="getCustomizeCode(commonInfo, 'shipInfoDetail')"/>
    </srm-popup>
    <!-- 收货信息细信息 -->
    <srm-popup :visible="receiveFlag" position="right" :show-header="false" @onClose="scorePopupCloseBefore('receiveInfoDetail')">
      <srm-form customize-type="detail" :columns="getDetailMoreHeaderColumns({ ...commonInfo, headerType: 'receiveInfoDetail' })" :data-set="commonDataSet" :customize-code="getCustomizeCode(commonInfo, 'receiveInfoDetail')"/>
    </srm-popup>
    <!-- 行明细信息 -->
    <srm-popup :visible="lineVisible" position="right" :show-header="false" @onClose="scorePopupCloseBefore('lineInfoDetail')">
      <srm-form customize-type="detail" :columns="getDetailMoreLineColumns({...commonInfo, lineReadOnly, currentLine})" :data-set="currentLine === 'handleLine' ? asnLineDataSetByHandle : asnLineDataSetByAll" :customize-code="getCustomizeCode(commonInfo, 'lineInfoDetail')"/>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import { isEmpty } from "lodash";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { nodeDs, asnLineDs, exportRecordDs } from "../datasource/commonDs";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import LogisticsInfo from "../components/LogisticsInfo";
import {
  getStatusCodeColor,
  getLanguage,
} from "../utils";
import { getDetailCustomize } from "../../DeliveryWorkbench/utils/index";
import {
  getOperatingDataApi,
  getTemplateCuszApi,
  getHeadInfoApi,
  saveAsnInfoApi,
  saveAsnInfoApiByAll,
  deleteLineApi,
  refuseAsnInfoApi,
  refuseLineApi,
  submitAsnInfoApi,
  closeAsnInfoApi,
  closeLineApi,
  sureAsnInfoApi,
  sureLineApi,
  deleteAsnInfoApi,
  getLogisticsInfoApi,
  refreshLogisticsInfoApi,
  getHeaderAttachmentUuidApi,
} from "../api";
import getDetailHeaderColumns from "../mixins/detailHeaderColumns";
import getDetailMoreHeaderColumns from "../mixins/detailHeaderColumns";
import getDetailLineColumns from "../mixins/detailLineColumns";
import getDetailMoreLineColumns from "../mixins/detailLineColumns";
import DeliveryWorkbenchMethod from "../../CUX_PART/Method/DeliveryWorkbenchMethod";

export default {
  modules: [ "slod.common", "hipspfm.common", "smbl.common" ],
  name: "DeliveryWorkbenchDetail",
  components: { HistoryRecordTiled, LogisticsInfo },
  extends: DeliveryWorkbenchMethod,
  mixins: [ getDetailHeaderColumns, getDetailMoreHeaderColumns, getDetailLineColumns, getDetailMoreLineColumns ],
  data() {
    return {
      getLanguageDefine: getLanguage,
      getCustomizeCode: getDetailCustomize,
      // 送货单头信息
      commonDataSet: new DataSet(),
      // 送货单待处理行信息
      asnLineDataSetByHandle: new DataSet(),
      // 送货单全部行信息
      asnLineDataSetByAll: new DataSet(),
      // 导出记录
      exportRecordDataSet: new DataSet(exportRecordDs()),
      basicFlag: false,
      shipFlag: false,
      receiveFlag:false,
      // 展示变更按钮
      updateFlag: true,
      lineVisible:false,
      // 存储待处理行 编辑状态
      saveEditState: false,
      // 行不可编辑
      lineReadOnly: false,
      logisticsInfoLoading: false,
      // 展示待处理行/全部行
      isShowHandleAndAllBtn: false,
      // http编码
      httpNum:true,
      // 个性化单元集合
      uiTemp: "",
      // 当前选择的行
      currentLine: "handleLine",
      // 单据样式模版
      tempInfo: {},
      // 头信息
      headInfo: {},
      // 列表传过来的数据
      commonInfo: {},
      // 操作记录
      operatingData: [],
      // 物流信息
      logisticsInfo: [],
      logisticsInfoOther: {},
      lineIds: {
        ASN: "asnLineId",
        PLAN: "planLineId",
      },
      nodeNum: null,
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
              editor: this.commonInfo.tab === "submit",
              required: this.commonInfo.tab === "submit",
            },
            {
              fieldCode: "expectedArriveDate",
              editor: this.commonInfo.tab === "submit",
              required: this.commonInfo.tab === "submit",
            },
            {
              fieldCode: "deliveryAddress",
              editor: this.commonInfo.tab === "submit",
            },
          ];
        case "shipInfoDetail":
          return [
            {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "shipDate",
              editor: this.commonInfo.tab === "submit",
              required: this.commonInfo.tab === "submit",
            },
            {
              fieldCode: "expectedArriveDate",
              editor: this.commonInfo.tab === "submit",
              required: this.commonInfo.tab === "submit",
            },
            {
              fieldCode: "deliveryAddress",
              editor: this.commonInfo.tab === "submit",
            },
            {
              fieldCode: "shipTotalQuantity",
            },
            {
              fieldCode: "shipTaxIncludedAmount",
            },
            this.commonInfo.tab !== "affirm" && {
              fieldCode: "transportType",
              editor: this.commonInfo.tab !== "affirm",
            },
            this.commonInfo.tab === "affirm" && {
              fieldCode: "transportTypeMeaning",
            },
            this.commonInfo.tab !== "affirm" && {
              fieldCode: "logisticsCompanyCode",
              editor: this.commonInfo.tab !== "affirm",
            },
            this.commonInfo.tab === "affirm" && {
              fieldCode: "logisticsCompanyName",
            },
            {
              fieldCode: "carNumber",
              editor: this.commonInfo.tab !== "affirm",
            },
            {
              fieldCode: "expressNum",
              editor: this.commonInfo.tab !== "affirm",
            },
            {
              fieldCode: "logisticsStaff",
              editor: this.commonInfo.tab !== "affirm",
            },
            this.commonInfo.tab !== "affirm" && {
              fieldCode: "logisticsPhoneNum",
              prefixField:{
                fieldCode: "internationalTelCode",
                lovCode: "HPFM.IDD",
                fieldType: "SELECT",
                defaultValue: { value: "+86", meaning: `${$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86` },
              },
            },
            this.commonInfo.tab === "affirm" && {
              fieldCode: "logisticsPhoneNumber",
              render: (val, item) => <span>{item.internationalTelCode} | {item.logisticsPhoneNum}</span>
            },
            {
              fieldCode: "purchaseRemark",
            },
            {
              fieldCode: "supplierRemark",
              editor: (val, item) => this.commonInfo.tab === "submit" || this.commonInfo.tab === "affirm" && [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]),
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
              editor: this.commonInfo.tab === "submit",
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
              editor: this.commonInfo.tab === "submit",
            },
            {
              fieldCode: "contactName",
              editor: this.commonInfo.tab === "submit",
            },
            this.commonInfo.tab !== "affirm" && {
              fieldCode: "contactTelNum",
              prefixField:{
                fieldCode: "internationalTelCode",
                lovCode: "HPFM.IDD",
                fieldType: "SELECT",
                defaultValue: { value: "+86", meaning: `${$T("hipspfm.common.view.message.title.internationalTelCode").$D("中国大陆")}+86` },
              },
            },
            this.commonInfo.tab === "affirm" && {
              fieldCode: "contactTelNumber",
              render: (val, item) => <span>{item.internationalTelCode} | {item.contactTelNum}</span>
            },
          ];
        case "lineInfo":
          return [
            {
              fieldCode: "itemCode",
              fieldType: "EMPTY",
              render: (val, item) => <srm-list-header show-open-tag={true}>
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
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
              required: this.commonInfo.tab === "submit" && !this.lineReadOnly,
              formRow: 4,
            },
            this.commonInfo.tab !== "submit" && {
              fieldCode: "quantity",
              editor: (val, item) => !this.lineReadOnly && item["changedFlag"] !== 1 &&
                [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
                [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED" ].includes(item["lineStatus"]),
              required: (val, item) => !this.lineReadOnly && item["changedFlag"] !== 1 &&
                [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
                [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED" ].includes(item["lineStatus"]),
              formRow: 5
            },
            {
              formRow: 99999,
              fieldType: "EMPTY",
              render: (val, item) => (this.commonInfo.tab === "submit" && this.currentLine === "handleLine" ||
              this.commonInfo.tab === "affirm" && Number(item["changingFlag"]) !== 1 && item["demolitionUpdateCode"] === "CAN_SPLIT_UPDATE" &&
                [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED" ].includes(item["lineStatus"]) &&
                this.currentLine === "handleLine") &&
                <srm-flex justify="end">
                  <srm-button type="primary" fill onClick={() => this.splitLine(item)}>
                    { $T("slod.common.view.button.split").$D("拆分") }
                  </srm-button>
                </srm-flex>
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
            this.commonInfo.tab === "submit" && {
              fieldCode: "canCreateQuantity",
            },
            this.commonInfo.tab !== "submit" && {
              fieldCode: "quantity",
              editor: (val, item) => this.commonInfo.tab === "affirm" && !this.lineReadOnly && item["changedFlag"] !== 1 &&
                [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
                [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED" ].includes(item["lineStatus"]),
              required: (val, item) => this.commonInfo.tab === "affirm" && !this.lineReadOnly && item["changedFlag"] !== 1 &&
                [ "CAN_SPLIT_UPDATE", "NO_SPLIT_CAN_UPDATE" ].includes(item["demolitionUpdateCode"]) &&
                [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED" ].includes(item["lineStatus"]),
            },
            {
              fieldCode: "actualQuantity",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
              required: this.commonInfo.tab === "submit" && !this.lineReadOnly,
              inputChange:(val, record) => {
                if (record.actualQuantity && record.unitPackageQuantity && val) {
                  const number = record.actualQuantity / record.unitPackageQuantity;
                  // eslint-disable-next-line radix
                  const num = parseInt(number);
                  // const residue = (record.actualQuantity % record.unitPackageQuantity)
                  const residue = this.calculation(_, record.actualQuantity, record.unitPackageQuantity * num);
                  this.$set(record, "packageQuantity", num);
                  this.$set(record, "remainderQuantity", residue);
                } else {
                  this.$set(record, "packageQuantity", null);
                  this.$set(record, "remainderQuantity", null);
                }
              },
            },
            {
              fieldCode: "unitPackageQuantity",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
              inputChange:(val, record) => {
                if (record.actualQuantity && record.unitPackageQuantity && val) {
                  const number = record.actualQuantity / record.unitPackageQuantity;
                  // eslint-disable-next-line radix
                  const num = parseInt(number);
                  // const residue = (record.actualQuantity % record.unitPackageQuantity)
                  const residue = this.calculation(_, record.actualQuantity, record.unitPackageQuantity * num);
                  this.$set(record, "packageQuantity", num);
                  this.$set(record, "remainderQuantity", residue);
                } else {
                  this.$set(record, "packageQuantity", null);
                  this.$set(record, "remainderQuantity", null);
                }
              },
            },
            {
              fieldCode: "packageQuantity",
            },
            {
              fieldCode: "remainderQuantity",
            },
            {
              fieldCode: "netWeight",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
            },
            {
              fieldCode: "grossWeight",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
            },
            {
              fieldCode: "lotNum",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
            },
            {
              fieldCode: "productionDate",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
            },
            {
              fieldCode: "lotExpirationDate",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
            },
            {
              fieldCode: "serialNum",
              editor: this.commonInfo.tab === "submit" && !this.lineReadOnly,
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
            },
            {
              fieldCode: "supplierLineRemark",
              editor: (val, item) => this.commonInfo.tab === "submit" && this.currentLine === "handleLine" || this.currentLine === "handleLine" && item["changedFlag"] !== 1 &&
                [ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["lineStatus"]),
            },
            this.commonInfo.tab === "submit" && {
              fieldCode: "supplierCompanyName",
            },
            {
              fieldCode: "deliveryAddress",
              editor: this.commonInfo.tab !== "all" && !this.lineReadOnly,
            },
            {
              fieldCode: "receiveAddress",
              editor: this.commonInfo.tab !== "all" && !this.lineReadOnly,
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
              disabled: (val, item) => item["changedFlag"] === 1 && !this.lineReadOnly || this.commonInfo.tab === "all",
              // readOnly: !(this.commonInfo.tab === "submit" && !this.lineReadOnly),
              canUpload: this.commonInfo.tab === "submit" && !this.lineReadOnly || this.commonInfo.tab === "all",
              canDelete: this.commonInfo.tab === "submit" && !this.lineReadOnly || this.commonInfo.tab === "all",
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
                  attachments: [ {
                    attachmentUuid: item.purchaseAttachmentUuid,
                    // bucketName: "public-bucket",
                    title: $T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件"),
                    tenantId: SrmUtil.getTenantId(),
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
                  onFileUpload: () => this.getSaveAttachmentUuid(item),
                  attachments: [ {
                    attachmentUuid: item.supplierAttachmentUuid,
                    title: $T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件"),
                    displayType: this.commonInfo.tab === "all" || this.commonInfo.tab === "affirm" && ![ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]) ? "list" : "grid",
                    readonly: this.commonInfo.tab === "all" || this.commonInfo.tab === "affirm" && ![ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]),
                    showInfo: true,
                    uploadButton: this.commonInfo.tab === "all" || this.commonInfo.tab === "affirm" && ![ "PURCHASER_PUBLISHED", "PURCHASER_REJECTED", "PURCHASER_FEEDBACK" ].includes(item["statusCode"]) ? "none" : "fixed",
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
    getButtons() {
      if (this.commonInfo.tab === "submit") {
        return [
          {
            text: $T("slod.common.view.button.save").$D("保存"),
            bordered: true,
            handler: () => {
              this.save();
            },
          },
          {
            text: $T("slod.common.view.button.submit").$D("提交"),
            fill: true,
            handler: () => {
              this.submit();
            },
          },
        ];
      }
      if (this.commonInfo.tab === "affirm") {
        // 方里埋点
        if (this.over$getLineButsFe && typeof this.over$getLineButsFe === "function" && this.commonInfo.node === "ASN") {
          const response = this.over$getLineButsFe();
          return response;
        }
        return [
          {
            text: $T("slod.common.view.button.reject").$D("拒绝"),
            type: "danger",
            bordered: true,
            handler: () => {
              this.reject();
            },
          },
          {
            text: $T("slod.common.view.button.sure").$D("确认"),
            fill: true,
            handler: () => {
              this.sure();
            },
          },
        ];
      }
      if (this.commonInfo.tab === "all") {
        if (this.updateFlag) {
          return [
            {
              text: $T("slod.common.view.button.close").$D("关闭"),
              type: "danger",
              bordered: true,
              handler: () => {
                this.close();
              },
            },
            {
              text: $T("slod.common.view.button.save").$D("保存"),
              fill: true,
              handler: () => {
                this.save();
              },
            },
            {
              text: $T("slod.common.view.button.exportRecord").$D("导出记录"),
              fill: true,
              handler: () => {
                this.exportRecord();
              },
            },
            // {
            //   text: $T("slod.common.view.button.update").$D("变更"),
            //   fill: true,
            //   handler: () => {
            //     this.updateFlag = !this.updateFlag;
            //   },
            // },
          ];
        }
        return [
          {
            text: $T("slod.common.view.button.close").$D("关闭"),
            type: "danger",
            bordered: true,
            handler: () => {
              this.close();
            },
          },
          {
            text: $T("slod.common.view.button.submit").$D("提交"),
            fill: true,
            handler: () => {
              this.submit();
            },
          },
        ];
      }
      return [];
    },
    getLineButtons() {
      if (this.commonInfo.tab === "affirm") {
        return [
          {
            text: $T("slod.common.view.button.reject").$D("拒绝"),
            type: "danger",
            bordered: true,
            visable: true,
            callback: (selected) => {
              // 拒绝
              if (selected && selected.length > 0) {
                this.reject(selected.map((res) => res.toData()));
              } else {
                this.reject();
              }
            },
          },
          {
            text: $T("slod.common.view.button.sure").$D("确认"),
            fill: true,
            visable: true,
            callback: (selected) => {
            // 确认
              if (selected && selected.length > 0) {
                this.sure(selected.map((res) => res.toData()));
              } else {
                this.sure();
              }
            },
          },
          {
            text: $T("slod.common.view.button.delete").$D("删除"),
            type: "danger",
            bordered: true,
            visable: true,
            disabled: (selected) => selected.length === 0,
            callback: (selected) => {
              // 删除行
              const slodasnLineListDTOS = selected.map((item) => item.data);
              let that = this;
              const ids = that.lineIds[that.commonInfo.node];
              console.log(ids, "行id");
              // 删除拆分行和原始行
              let newRecord = [];
              let oldRecord = [];
              slodasnLineListDTOS.map((res) => {
                if (res[ids]) {
                  oldRecord.push(res);
                } else {
                  newRecord.push(res);
                }
              });
              if (isEmpty(oldRecord)) {
                // 删除本地数据
                that.asnLineDataSetByHandle.removeLocalRecords(selected);
              } else {
                this.$dialog({
                  content: $T("slod.common.view.message.orderDel").$D("确认删除选中行？"),
                  onOk() {
                    that.$loading.show();
                    // 删除数据库数据
                    deleteLineApi(that.commonInfo.node, that.commonInfo.deliveryHeaderId, oldRecord).then(async (resp) => {
                      if (resp && resp.failed) {
                        that.$notification.open({
                          message: resp.message,
                          duration: 1000,
                        });
                        that.asnLineDataSetByHandle.refresh();
                      } else {
                        that.$notification.open({
                          message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
                          duration: 1000,
                        });
                        that.$loading.show();
                        await that.searchHead();
                        await that.searchLine();
                        that.$loading.hide();
                        if (!isEmpty(this.$refs?.srmScrollTab)) {
                          this.$refs?.srmScrollTab?.changeTab(this.nodeNum);
                        }
                      }
                    }).finally(() => {
                      that.$loading.hide();
                    });
                  }
                });
              }
            },
          },
        ];
      }
      if (this.commonInfo.tab === "all") {
        return [
          {
            text: $T("slod.common.view.button.close").$D("关闭"),
            type: "danger",
            bordered: true,
            visable: true,
            callback: (selected) => {
              // 关闭
              if (selected && selected.length > 0) {
                this.close(selected.map((res) => res.toData()));
              } else {
                this.close();
              }
            },
          },
        ];
      }
      return [
        {
          text: $T("slod.common.view.button.delete").$D("删除"),
          type: "danger",
          bordered: true,
          visable: true,
          disabled: (selected) => selected.length === 0,
          callback: (selected) => {
            let that = this;
            const ids = that.lineIds[that.commonInfo.node];
            const slodasnLineListDTOS = selected.map((item) => item.data);
            console.log(ids, "行id");
            let newRecord = [];
            let oldRecord = [];
            slodasnLineListDTOS.map((res) => {
              if (res[ids]) {
                oldRecord.push(res);
              } else {
                newRecord.push(res);
              }
            });
            if (isEmpty(oldRecord)) {
              // 删除本地数据
              that.asnLineDataSetByHandle.removeLocalRecords(selected);
            } else {
              this.$dialog({
                content: $T("slod.common.view.message.orderDel").$D("确认删除选中行？"),
                onOk() {
                  that.$loading.show();
                  deleteLineApi(that.commonInfo.node, that.commonInfo.deliveryHeaderId, oldRecord).then(async (resp) => {
                    if (resp && resp.failed) {
                      that.$notification.open({
                        message: resp.message,
                        duration: 1000,
                      });
                    } else {
                      that.$notification.open({
                        message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
                        duration: 1000,
                      });
                      that.$loading.show();
                      await that.searchHead();
                      await that.searchLine();
                      that.$loading.hide();
                      if (!isEmpty(this.$refs?.srmScrollTab)) {
                          this.$refs?.srmScrollTab?.changeTab(this.nodeNum);
                      }
                    }
                  }).finally(() => {
                    that.$loading.hide();
                  });
                }
              });
            }
          },
        },
      ];
    },
    getLogisticsInfoColumns() {
      return [
        {
          fieldCode: "stateMeaning",
          fieldType: "EMPTY",
          render: (val, item) => val && <srm-flex direction="column" justify="start" align="start">
            <srm-flex-item class="logisticsInfo">
              { val }
            </srm-flex-item>
            <srm-flex-item class="logisticsInfo">
              <span style="font-size: 12px">{ this.getLanguageDefine("update") }: { item.lastUpdateDate || "-" }</span>
            </srm-flex-item>
          </srm-flex>,
          formRow: 1,
        },
        {
          fieldType: "EMPTY",
          render: () => <srm-flex justify="end">
            <srm-button type="primary" plain rect onClick={() => this.refreshLogistics()}>
              { this.getLanguageDefine("logisticsBtn") }
            </srm-button>
          </srm-flex>,
          formRow: 1,
        }
      ];
    }
  },
  async beforeMount() {
    this.commonInfo = this.$route.query;
    this.nodeNum = this.commonInfo.node === "ASN" ? 3 : 2;
    const operatingType = SrmUtil?.getDocFlowFlag() || "";
    const node = this.commonInfo.node.toLowerCase();
    // 操作记录
    try {
      const params1 = {
        tableName: `slod_${node}_header`,
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
  },
  async mounted() {
    this.commonDataSet = new DataSet(nodeDs(this.commonInfo));
    this.asnLineDataSetByHandle = new DataSet(asnLineDs(this.commonInfo));
    this.asnLineDataSetByAll = new DataSet(asnLineDs(this.commonInfo));
    this.$loading.show();
    const configAbc = this.commonInfo?.node !== "ASN" ? `_${this.commonInfo?.customizeUnitCode?.slice(-1)}` : "";
    const asnCustCode = `SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.BASIC.CARD,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.BASIC.DETAIL,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.SHIP.CARD,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.SHIP.DETAIL,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.RECEIVE.CARD,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.RECEIVE.DETAIL,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.LINE.CARD,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.LINE.DETAIL,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}.ATTACH.CARD`;
    const otherCustCode = `SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}${configAbc}.BASIC.CARD,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}${configAbc}.BASIC.DETAIL,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}${configAbc}.LINE.CARD,SMBL.DELIVERY_WORKBENCH.${this.commonInfo.node}${configAbc}.LINE.DETAIL`;
    this.uiTemp = [ "ASN" ].includes(this.commonInfo?.node) ? asnCustCode : otherCustCode;
    // 查询头信息
    await this.searchHead();
    // 处理行赋值参数
    this.asnLineDataSetByHandle.addQueryParameter("cuszTplTemplateCode", this.tempInfo.templateCode);
    this.asnLineDataSetByHandle.addQueryParameter("cuszTplVersion", this.tempInfo.templateVersion);
    this.asnLineDataSetByHandle.addQueryParameter("customizeUnitCode", this.uiTemp);
    this.asnLineDataSetByHandle.addPathParameter("id", this.commonInfo.deliveryHeaderId);
    this.asnLineDataSetByHandle.addPathParameter("nodeConfigId", this.commonInfo.nodeConfigId);
    this.asnLineDataSetByHandle.addPathParameter("node", this.commonInfo.node);
    this.asnLineDataSetByHandle.addQueryParameter("pageSourceKey", [ "affirm", "all" ].includes(this.commonInfo.tab) ? this.commonInfo.tab : null);
    // 全部行赋值参数
    this.asnLineDataSetByAll.addQueryParameter("cuszTplTemplateCode", this.tempInfo.templateCode);
    this.asnLineDataSetByAll.addQueryParameter("cuszTplVersion", this.tempInfo.templateVersion);
    this.asnLineDataSetByAll.addQueryParameter("customizeUnitCode", this.uiTemp);
    this.asnLineDataSetByAll.addPathParameter("id", this.commonInfo.deliveryHeaderId);
    this.asnLineDataSetByAll.addPathParameter("nodeConfigId", this.commonInfo.nodeConfigId);
    this.asnLineDataSetByAll.addPathParameter("node", this.commonInfo.node);
    this.asnLineDataSetByAll.addQueryParameter("pageSourceKey", [ "affirm", "all" ].includes(this.commonInfo.tab) ? this.commonInfo.tab : null);

    // 查询行信息
    await this.searchLine();
    this.$loading.hide();
  },
  methods: {
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
    clickDetailInfo(tabItem,) {
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
      // this.$popup({
      //   showHeader: false,
      //   position: "right",
      //   content: <SrmForm
      //     style={{ padding: "0 15px" }}
      //     customizeType="detail"
      //     customizeCode={this.getCustomizeCode(tabItem)}
      //     dataSet={tabItem === "lineInfoDetail" ? this.currentLine === "handleLine" ? this.asnLineDataSetByHandle : this.asnLineDataSetByAll : this.commonDataSet}
      //     columns={this.getColumns(tabItem)}
      //   />,
      // });
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
    // 保存
    save() {
      if (!this.commonDataSet.validate() || !this.asnLineDataSetByHandle.validate() || !this.asnLineDataSetByAll.validate()) {
        return;
      }
      this.$loading.show();
      if (this.commonInfo.tab === "submit") {
        saveAsnInfoApi(this.commonInfo.node, this.commonInfo.deliveryHeaderId, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        }).then((res) => {
          if (res && !res.failed) {
            this.$notification.open({
              message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
              duration: 1000,
            });
            this.searchHead();
            this.searchLine();
          }
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 2000,
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
        return;
      }
      saveAsnInfoApiByAll(this.commonInfo.node, this.commonInfo.deliveryHeaderId, [
        `customizeUnitCode=${this.uiTemp}`,
        "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
        `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
        `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
        `cuszTplVersion=${this.tempInfo.templateVersion}`,
      ],
      {
        ...this.commonDataSet.toData()[0],
        deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
      }).then((res) => {
        if (res && !res.failed) {
          this.$notification.open({
            message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
            duration: 1000,
          });
          this.searchHead();
          this.searchLine();
        }
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            duration: 2000,
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 提交
    submit() {
      if (!this.commonDataSet.validate() || !this.asnLineDataSetByHandle.validate()) {
        return;
      }
      this.$loading.show();
      submitAsnInfoApi(this.commonInfo.node, this.commonInfo.nodeConfigId, [
        `customizeUnitCode=${this.uiTemp}`,
        "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
        `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
        `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
        `cuszTplVersion=${this.tempInfo.templateVersion}`,
      ],
      [ {
        ...this.commonDataSet.toData()[0],
        deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
      } ]).then((res) => {
        if (res && res.length > 0) {
          this.$notification.open({
            message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
            duration: 1000,
          });
          // 返回列表页
          this.$router.back();
        }
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            duration: 2000,
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 删除
    deleteRecord() {
      this.$loading.show();
      deleteAsnInfoApi(this.commonInfo.node, this.commonInfo.nodeConfigId, [ {
        ...this.commonDataSet.toData()[0],
        deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
      } ]).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            duration: 1000,
          });
        } else {
          this.$notification.open({
            message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
            duration: 1000,
          });
          // 返回列表页
          this.$router.back();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 确认(按行/整单)
    async sure(data = []) {
      if (!this.commonDataSet.validate() || !this.asnLineDataSetByHandle.validate()) {
        return;
      }
      this.$loading.show();
      let res = {};
      if (data.length > 0) {
        res = await sureLineApi(this.commonInfo.node, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        data.length > 0 ? data : [ {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        } ]);
      } else {
        res = await sureAsnInfoApi(this.commonInfo.node, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        data.length > 0 ? data : [ {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        } ]);
      }
      if (res && res.failed) {
        this.$notification.open({
          message: res.message,
          duration: 1000,
        });
        this.$loading.hide();
      } else {
        this.$notification.open({
          message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
          duration: 1000,
        });
        if (data.length === 0) {
          // 返回列表页
          this.$loading.hide();
          this.$router.back();
        } else {
          await this.searchHead();
          await this.searchLine();
          this.$loading.hide();
          if (!isEmpty(this.$refs?.srmScrollTab)) {
            this.$refs?.srmScrollTab?.changeTab(this.nodeNum);
          }
        }
      }
    },
    // 拒绝(按行/整单)
    async reject(data = []) {
      this.$loading.show();
      let res = {};
      if (data.length > 0) {
        res = await refuseLineApi(this.commonInfo.node, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        data.length > 0 ? data : [ {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        } ]);
      } else {
        res = await refuseAsnInfoApi(this.commonInfo.node, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        data.length > 0 ? data : [ {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        } ]);
      }
      if (res && res.failed) {
        this.$notification.open({
          message: res.message,
          duration: 1000,
        });
        this.$loading.hide();
      } else {
        this.$notification.open({
          message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
          duration: 1000,
        });
        if (data.length === 0) {
          // 返回列表页
          this.$loading.hide();
          this.$router.back();
        } else {
          await this.searchHead();
          await this.searchLine();
          this.$loading.hide();
          if (!isEmpty(this.$refs?.srmScrollTab)) {
            this.$refs?.srmScrollTab?.changeTab(this.nodeNum);
          }
        }
      }
    },
    // 关闭(按行/整单)
    async close(data = []) {
      this.$loading.show();
      let res = {};
      if (data.length > 0) {
        res = await closeLineApi(this.commonInfo.node, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        data.length > 0 ? data : [ {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        } ]);
      } else {
        res = await closeAsnInfoApi(this.commonInfo.node, [
          `customizeUnitCode=${this.uiTemp}`,
          "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
          `cuszTplStageCode=${this.commonInfo.tab.toUpperCase()}`,
          `cuszTplTemplateCode=${this.tempInfo.templateCode}`,
          `cuszTplVersion=${this.tempInfo.templateVersion}`,
        ],
        data.length > 0 ? data : [ {
          ...this.commonDataSet.toData()[0],
          deliveryLineDTOList: this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0 ? this.asnLineDataSetByHandle.toData() : this.asnLineDataSetByAll.toData(),
        } ]);
      }
      if (res && res.failed) {
        this.$notification.open({
          message: res.message,
          duration: 1000,
        });
        this.$loading.hide();
      } else {
        this.$notification.open({
          message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
          duration: 1000,
        });
        // 返回列表页
        this.$loading.hide();
        this.$router.back();
      }
    },
    // 导出记录
    async exportRecord(item = {}, lineFlag = false) {
      if (item.exportStatus) {
        if (item.exportStatus === "FAIL") {
          // 重新同步
          this.exportRecordDataSet.addPathParameter("id", item.recordId);
          this.exportRecordDataSet.addPathParameter("node", this.commonInfo.node);
          this.exportRecordDataSet.submitRecords([ this.exportRecordDataSet.current ]).then(() => {
            this.exportRecordDataSet.refresh();
          });
        }
        return;
      }
      this.$loading.show();
      this.exportRecordDataSet.addPathParameter("node", this.commonInfo.node);
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
          columns={this.getColumns("exportRecord")}/>,
      });
    },
    // 拆分行
    splitLine(item) {
      this.$loading.show();
      this.asnLineDataSetByHandle.create({ ...item, asnLineId: null, planLineId: null }, 0);
      setTimeout(() => {
        this.$notification.open({
          message: $T("slod.common.view.message.splitSuccess").$D("拆分成功"),
          duration: 1000,
        });
        this.$loading.hide();
        // 定位到拆分行
        if (!isEmpty(this.$refs?.srmScrollTab)) {
          this.$refs?.srmScrollTab?.changeTab(this.nodeNum);
        }
      }, 500);
    },
    // 行按钮
    toggleLineBtn(f) {
      if (f === "edit") {
        if (this.currentLine === "handleLine") {
          this.asnLineDataSetByHandle.editFlag = true;
          this.saveEditState = this.asnLineDataSetByHandle.editFlag;
        } else {
          this.asnLineDataSetByAll.editFlag = true;
          this.saveEditState = this.asnLineDataSetByAll.editFlag;
        }
      } else if (f === "cancel") {
        if (this.currentLine === "handleLine") {
          this.asnLineDataSetByHandle.editFlag = false;
          this.saveEditState = this.asnLineDataSetByHandle.editFlag;
        } else {
          this.asnLineDataSetByAll.editFlag = false;
          this.saveEditState = this.asnLineDataSetByAll.editFlag;
        }
      } else if (f === "handleLine") {
        this.currentLine = f;
        this.asnLineDataSetByHandle.editFlag = this.saveEditState;
        this.lineReadOnly = false;
        this.asnLineDataSetByHandle.refresh();
      } else {
        this.currentLine = f;
        // 全部行不能编辑
        this.asnLineDataSetByHandle.editFlag = false;
        this.lineReadOnly = true;
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
          templateCuszMethodCode: "SLOD_SHIP_WORKSPACE_ASN_DETAIL",
        });
      }
      // 查询头信息
      this.headInfo = await getHeadInfoApi(this.commonInfo.node, this.commonInfo.nodeConfigId, this.commonInfo.deliveryHeaderId, {
        customizeUnitCode: this.uiTemp,
        cuszTplTemplateCode: this.tempInfo.templateCode,
        cuszTplVersion: this.tempInfo.templateVersion,
        cuszTplStageCode: this.commonInfo.tab.toUpperCase(),
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
      if (this.commonInfo.tab === "all") {
        getLogisticsInfoApi(this.commonInfo.deliveryHeaderId).then((res) => {
          this.logisticsInfoLoading = false;
          if (res.logisticsLocusList && res.logisticsLocusList.length > 0) {
            this.logisticsInfo = [ res.logisticsLocusList.reverse() ];
          }
          this.logisticsInfoOther = {
            stateMeaning: res.stateMeaning,
            lastUpdateDate: res.lastUpdateDate,
            logisticsTrackUrl: res.logisticsTrackUrl,
          };
        }).finally(() => {
          this.logisticsInfoLoading = false;
        });
      }
      this.exportRecordDataSet.addQueryParameter("nodeTemplateCode", this.commonInfo.node);
      this.exportRecordDataSet.addQueryParameter("deliveryHeaderId", this.commonInfo.deliveryHeaderId);
    },
    // 查询行
    async searchLine() {
      // 待提交和待确认
      if ([ "submit", "affirm" ].includes(this.commonInfo.tab)) {
        this.asnLineDataSetByHandle.addQueryParameter("editableFlag", this.commonInfo.tab === "submit" ? "1" : this.commonInfo.tab === "affirm" ? "2" : null);
        await this.asnLineDataSetByHandle.refresh();
        if (this.headInfo.statusCode === "PART_PROCESSED" && this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length > 0) {
          // 是否展示 待处理行和全部行
          this.isShowHandleAndAllBtn = true;
          this.currentLine = "handleLine";
        } else if (this.commonInfo.tab === "affirm" && this.asnLineDataSetByHandle.toData() && this.asnLineDataSetByHandle.toData().length === 0) {
          // 待确认页面 待处理行数据为空，只展示全部行
          this.isShowHandleAndAllBtn = false;
          this.currentLine = "allLine";
          this.lineReadOnly = true;
          this.asnLineDataSetByAll.refresh();
        }
      } else {
        this.currentLine = "allLine";
        this.lineReadOnly = true;
        this.asnLineDataSetByAll.refresh();
      }
    },
    // 刷新物流信息
    refreshLogistics() {
      this.$loading.show();
      this.logisticsInfoLoading = true;
      refreshLogisticsInfoApi(this.commonInfo.deliveryHeaderId).then((res) => {
        this.logisticsInfoLoading = false;
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            duration: 2000,
          });
          return;
        }
        if (res.logisticsLocusList && res.logisticsLocusList.length > 0) {
          this.logisticsInfo = [ res.logisticsLocusList.reverse() ];
        }
        this.logisticsInfoOther = {
          stateMeaning: res.stateMeaning,
          lastUpdateDate: res.lastUpdateDate,
        };
        this.$notification.open({
          message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
          duration: 1000,
        });
      }).finally(() => {
        this.logisticsInfoLoading = false;
        this.$loading.hide();
      });
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
        supplierAttachmentUuid: data?.supplierAttachmentUuid,
      }).then((res) => {
        if (res && !res.failed) {
          that.commonDataSet.reset();
          that.commonDataSet.setData([ {
            ...data,
            supplierAttachmentUuid: res?.supplierAttachmentUuid,
            objectVersionNumber: res?.objectVersionNumber,
          } ]);
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}
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

.switch-div{
  position: relative;
  border-radius: 14px;
  width: 120px;
  height: 20px;
  padding: 0px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-color: #eeeeee;
  margin: 6px 0px 6px 15px;
  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: #757575;
    line-height: 12px;
    font-weight: 400;
  }
  .checked-left-div {
    width: 70px;
    height: 20px;
    background: #FFFFFF;
    border: 1px solid #E2E2E2;
    border-radius: 14px;
    font-family: PingFangSC-Medium;
    font-size: 10px;
    color: #1F1F1F;
    line-height: 12px;
    font-weight: 500;
  }
  .checked-right-div {
    width: 60px;
    height: 20px;
    background: #FFFFFF;
    border: 1px solid #E2E2E2;
    border-radius: 14px;
    font-family: PingFangSC-Medium;
    font-size: 10px;
    color: #1F1F1F;
    line-height: 12px;
    font-weight: 500;
  }
}

.override-cus {
  padding: 16px 20px 8px 20px;
  border-bottom: 1px solid var(--split-line-color-primary);
  .logisticsInfo {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
  }
  .logisticsInfo:nth-child(2) {
    font-size: 12px;
    color: #757575;
  }
}
</style>