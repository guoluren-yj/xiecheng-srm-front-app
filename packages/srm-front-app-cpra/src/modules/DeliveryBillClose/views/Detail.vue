<template>
  <!-- 送货单关闭 -->
  <div class="detail-container">
    <srm-scroll-tab>
      <!-- 发货信息 -->

      <srm-scroll-tab-item :label="getLanguageDefine('deliverGoodsInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('deliverGoodsInfo')"
                  :customize-code="getCodeDefine('deliverGoodsInfo')"
                  @itemClick="clickDeliverGoodsInfo"/>
      </srm-scroll-tab-item>
      <!-- 收货信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('receiveInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('receiveInfo')"
                  :customize-code="getCodeDefine('receiveInfo')"
                  @itemClick="clickReceiveInfo"/>
      </srm-scroll-tab-item>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('orderLineInfo')"
                           :show-title="false">
        <div class="srm-scroll-tab-item-title line-filter">
          <!-- 标题 -->
          {{ getLanguageDefine('orderLineInfo') }}
          <div v-if="!orderLineDataSet.editFlag" class="list-tool-tab">
            <!-- 编辑按钮 -->
            <div class="srm-icon icon-edit" @click="toggleOrderLineEdit"/>
          </div>
          <srm-button v-else plain rect @click="toggleOrderLineEdit">
            {{ $T("hipspfm.common.button.cancle").$D("取消") }}
          </srm-button>
        </div>
        <srm-list :scrollable="false"
                  :show-bottom-bar="false"
                  :data-set="orderLineDataSet"
                  :columns="getColumns('orderLineInfo')"
                  :customize-code="getCodeDefine('orderLineInfo')"
                  @itemClick="clickOrderLineInfo"/>
      </srm-scroll-tab-item>
      <!-- 物流信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('logisticsInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('logisticsInfo')"
                  :customize-code="getCodeDefine('logisticsInfo')"
                  @itemClick="clickLogisticsInfo"/>
      </srm-scroll-tab-item>
      <!-- 附件 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="commonDataSet"
                  :columns="getColumns('attachInfo')"
                  :customize-code="getCodeDefine('attachInfo')"/>
      </srm-scroll-tab-item>
      <div class="approval-detail-bottom"/>
    </srm-scroll-tab>
    <!-- 基础信息的选中按钮 -->
    <srm-list-bottom-bar :data-set="orderLineDataSet" :buttons="getOrderLineButtons"/>

    <!-- 详情按钮 -->
    <srm-bottom-handler v-if="!orderLineDataSet.editFlag && commonDataSet.data && commonDataSet.data.length" :btn-arr="getButtons"/>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :position="lineImportStatusVisible ? 'bottom' : 'right'"
               :show-header="lineImportStatusVisible"
               :title="lineImportStatusVisible ? popupData.title : ''"
               :header-align="'center'"
               :rounded="lineImportStatusVisible"
               :height="lineImportStatusVisible ? '70%' : '100%'">
      <!-- 行取消导入状态 -->
      <srm-list v-if="lineImportStatusVisible"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="lineImportStatusDataSet"
                :columns="getColumns('lineImportStatus')"
                :customize-code="getCodeDefine('lineImportStatus')"
                @itemClick="clickLineImportStatus"/>
      <!-- 详情tab -->
      <srm-form
        v-else-if="visiblePopup"
        customize-type="detail"
        :data-set="popupData.data"
        :columns="getColumns(popupData.columns)"
        :customize-code="getCodeDefine(popupData.code)"/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { getOrderHeadInfo, closeDeliveryBill, reSyncDeliveryBill } from "../api";
import { dateFormat } from "@/utils/index";
import { orderLineDs, lineImportStatusDs, commonDs } from "../datasource/indexDs";
export default {
  modules: [ "sodr.common", "hipspfm.common" ],
  name: "DeliveryBillCloseDetail",
  data() {
    return {
      headerInfo: {},
      commonDataSet: new DataSet(commonDs()),
      orderLineDataSet: new DataSet(),
      lineImportStatusDataSet: new DataSet(commonDs()),
      lineImportStatusVisible: false,
      popupData: {},
      visiblePopup: false,
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "deliverGoodsInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.asnNum}</span>
                <span slot="right">{item.asnTypeCodeMeaning}</span>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
              formRow: 20,
            },
            {
              fieldCode: "shipDate",
              fieldName: $T("sodr.common.model.common.fhDate").$D("发货日期"),
              render: (val) => dateFormat(val),
              formRow: 30,
            },
            {
              fieldCode: "immedShippedFlag",
              fieldName: $T("sodr.common.model.common.immedShippedFlag").$D("是否直发"),
              render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
              formRow: 30,
            },
            {
              fieldCode: "expectedArriveDate",
              fieldName: $T("sodr.common.model.common.expectedArriveTime").$D("预计到货时间"),
              formRow: 40,
            },
            {
              fieldCode: "totalQuantity",
              fieldName: $T("sodr.common.model.common.quantityTotal").$D("发货总数"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 50,
            },
            {
              fieldCode: "transportTypeMeaning",
              fieldName: $T("sodr.common.model.common.transportTypeMeaning").$D("运输类型"),
              formRow: 50,
            },
            {
              fieldCode: "supplierSiteName",
              fieldName: $T("sodr.common.model.common.supplierAddress").$D("发货地点"),
              formRow: 60,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.remarks").$D("备注"),
              formRow: 70,
            },
          ];
        case "receiveInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.companyName || "-"}</span>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "organizationName",
              fieldName: $T("sodr.common.model.common.organizationName").$D("收货组织"),
              formRow: 20,
            },
            {
              fieldCode: "actualReceiverName",
              fieldName: $T("sodr.common.model.common.actualReceiverName").$D("送达方"),
              formRow: 30,
            },
            {
              fieldCode: "contactInfo",
              fieldName: $T("sodr.common.model.common.contactInfo").$D("联系人"),
              formRow: 40,
            },
            // {
            //   fieldCode: "carriersName",
            //   fieldName: $T("sodr.common.model.common.carriersName").$D("第三方接收单位"),
            //   formRow: 50,
            // },
            {
              fieldCode: "shipToLocationAddress",
              fieldName: $T("sodr.common.model.common.locationAddress").$D("收货地点"),
              formRow: 60,
            },
          ];
        case "orderLineInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.itemCode || "-"}</span>
                <span slot="right">{item.asnLineNum}</span>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
              formRow: 20,
            },
            {
              fieldCode: "lineImportStatus",
              fieldName: $T("sodr.common.model.common.lineCloseImportStatus").$D("行关闭导入状态"),
              render: () => <span style="color: var(--color-other-default-b)">{$T("hipspfm.common.button.view").$D("查看")}</span>,
              callBack: (record) => {
                this.openPopup("lineImportStatus", record);
              },
              formRow: 30,
            },
            {
              fieldCode: "cancelledFlag",
              fieldName: $T("sodr.common.model.common.cancelled").$D("已取消"),
              render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
              formRow: 40,
            },
            {
              fieldCode: "closedFlag",
              fieldName: $T("sodr.common.model.common.closed").$D("已关闭"),
              render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
              formRow: 40,
            },
            {
              fieldCode: "shipQuantity",
              fieldName: $T("sodr.common.model.common.shipQuantity").$D("发货数量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 50,
            },
            {
              fieldCode: "uomName",
              fieldName: $T("sodr.common.model.common.uomNames").$D("单位"),
              render: (val, item) => item.unitCodeIsShow === "1" ? `${item.uomCode}/${val}` : val,
              formRow: 50,
            },
            {
              fieldCode: "receiveQuantity",
              fieldName: $T("sodr.common.model.common.received").$D("已接收"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 60,
            },
            {
              fieldCode: "receiveStatusMeaning",
              fieldName: $T("sodr.common.model.common.receiveStatusMeaning").$D("接收状态"),
              formRow: 60,
            },
            {
              fieldCode: "displayPoNum",
              fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
              formRow: 70,
            },
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sodr.common.model.common.orderLineNum").$D("订单行号"),
              formRow: 70,
            },
          ];
        case "logisticsInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.expressNum || "-"}</span>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "logisticsCompanyMeaning",
              fieldName: $T("sodr.common.model.common.logisticsCompanyMeaning").$D("物流公司"),
              formRow: 20,
            },
            {
              fieldCode: "logisticsStaff",
              fieldName: $T("sodr.common.model.common.logisticsStaff").$D("配送人员"),
              formRow: 30,
            },
            {
              fieldCode: "logisticsCost",
              fieldName: $T("sodr.common.model.common.logisticsCost").$D("物流费用"),
              formRow: 30,
            },
            {
              fieldCode: "logisticsContactInfo",
              fieldName: $T("sodr.common.model.common.logisticsContactInfo").$D("联系方式"),
              formRow: 40,
            },
            {
              fieldCode: "logisticsPhoneNum",
              fieldName: $T("sodr.common.model.common.logisticsPhoneNum").$D("收件人手机号"),
              render: (val, item) => [ item.internationalTelMeaning || "", item.logisticsPhoneNum || "" ].join("|"),
              formRow: 50,
            },
            // {
            //   fieldCode: "carNumber",
            //   fieldName: $T("sodr.common.model.common.carNumber").$D("车牌号"),
            //   formRow: 60,
            // },
          ];
        case "deliverGoodsInfoDetail":
          return [
            {
              fieldCode: "asnNum",
              fieldName: $T("sodr.common.model.common.asnNum").$D("送货单号"),
              formRow: 10,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
              formRow: 20,
            },
            {
              fieldCode: "shipDate",
              fieldName: $T("sodr.common.model.common.fhDate").$D("发货日期"),
              render: (val) => dateFormat(val),
              formRow: 30,
            },
            {
              fieldCode: "immedShippedFlag",
              fieldName: $T("sodr.common.model.common.immedShippedFlag").$D("是否直发"),
              render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
              formRow: 30,
            },
            {
              fieldCode: "expectedArriveDate",
              fieldName: $T("sodr.common.model.common.expectedArriveTime").$D("预计到货时间"),
              formRow: 40,
            },
            {
              fieldCode: "totalQuantity",
              fieldName: $T("sodr.common.model.common.quantityTotal").$D("发货总数"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 50,
            },
            {
              fieldCode: "transportTypeMeaning",
              fieldName: $T("sodr.common.model.common.transportTypeMeaning").$D("运输类型"),
              formRow: 50,
            },
            {
              fieldCode: "supplierSiteName",
              fieldName: $T("sodr.common.model.common.supplierAddress").$D("发货地点"),
              formRow: 60,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.remarks").$D("备注"),
              formRow: 70,
            },
          ];
        case "receiveInfoDetail":
          return [
            {
              fieldCode: "companyName",
              fieldName: $T("sodr.common.model.common.custom").$D("客户"),
              formRow: 10,
            },
            {
              fieldCode: "organizationName",
              fieldName: $T("sodr.common.model.common.organizationName").$D("收货组织"),
              formRow: 20,
            },
            {
              fieldCode: "actualReceiverName",
              fieldName: $T("sodr.common.model.common.actualReceiverName").$D("送达方"),
              formRow: 30,
            },
            {
              fieldCode: "contactInfo",
              fieldName: $T("sodr.common.model.common.contactInfo").$D("联系人"),
              formRow: 40,
            },
            // {
            //   fieldCode: "carriersName",
            //   fieldName: $T("sodr.common.model.common.carriersName").$D("第三方接收单位"),
            //   formRow: 50,
            // },
            {
              fieldCode: "shipToLocationAddress",
              fieldName: $T("sodr.common.model.common.locationAddress").$D("收货地点"),
              formRow: 60,
            },
          ];
        case "orderLineInfoDetail":
          return [
            {
              fieldCode: "asnLineNum",
              fieldName: $T("sodr.common.model.common.asnLineNum").$D("行号"),
              formRow: 10,
            },
            {
              fieldCode: "itemCode",
              fieldName: $T("sodr.common.model.common.itemCode").$D("物料编码"),
              formRow: 20,
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
              formRow: 30,
            },
            {
              fieldCode: "lineImportStatus",
              fieldName: $T("sodr.common.model.common.lineCloseImportStatus").$D("行关闭导入状态"),
              render: () => <span style="color: var(--color-other-default-b)">{$T("hipspfm.common.button.view").$D("查看")}</span>,
              callBack: (record) => {
                this.openPopup("lineImportStatus", record);
              },
              formRow: 30,
            },
            {
              fieldCode: "cancelledFlag",
              fieldName: $T("sodr.common.model.common.cancelled").$D("已取消"),
              render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
              formRow: 40,
            },
            {
              fieldCode: "closedFlag",
              fieldName: $T("sodr.common.model.common.closed").$D("已关闭"),
              render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
              formRow: 40,
            },
            {
              fieldCode: "shipQuantity",
              fieldName: $T("sodr.common.model.common.shipQuantity").$D("发货数量"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 50,
            },
            {
              fieldCode: "uomName",
              fieldName: $T("sodr.common.model.common.uomNames").$D("单位"),
              render: (val, item) => item.unitCodeIsShow === "1" ? `${item.uomCode}/${val}` : val,
              formRow: 50,
            },
            {
              fieldCode: "receiveQuantity",
              fieldName: $T("sodr.common.model.common.received").$D("已接收"),
              fieldType: "INPUT_NUMBER",
              editor: false,
              formRow: 60,
            },
            {
              fieldCode: "receiveStatusMeaning",
              fieldName: $T("sodr.common.model.common.receiveStatusMeaning").$D("接收状态"),
              formRow: 60,
            },
            {
              fieldCode: "displayPoNum",
              fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
              formRow: 70,
            },
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sodr.common.model.common.orderLineNum").$D("订单行号"),
              formRow: 70,
            },
            {
              fieldCode: "displayLineLocationNum",
              fieldName: $T("sodr.common.model.common.displayLineLocationNum").$D("发运号"),
              formRow: 80,
            },
            {
              fieldCode: "inventoryName",
              fieldName: $T("sodr.common.model.common.inventoryName").$D("库房"),
              formRow: 80,
            },
            {
              fieldCode: "locationName",
              fieldName: $T("sodr.common.model.common.location").$D("库位"),
              formRow: 80,
            },
            {
              fieldCode: "productNum",
              fieldName: $T("sodr.common.model.common.productNum").$D("商品编码"),
              formRow: 80,
            },
            {
              fieldCode: "productName",
              fieldName: $T("sodr.common.model.common.productName").$D("商品名称"),
              formRow: 80,
            },
          ];
        case "logisticsInfoDetail":
          return [
            {
              fieldCode: "itemCode",
              fieldName: $T("sodr.common.model.common.logisticNum").$D("快递单号"),
              formRow: 10,
            },
            {
              fieldCode: "logisticsCompanyMeaning",
              fieldName: $T("sodr.common.model.common.logisticsCompanyMeaning").$D("物流公司"),
              formRow: 20,
            },
            {
              fieldCode: "logisticsStaff",
              fieldName: $T("sodr.common.model.common.logisticsStaff").$D("配送人员"),
              formRow: 30,
            },
            {
              fieldCode: "logisticsCost",
              fieldName: $T("sodr.common.model.common.logisticsCost").$D("物流费用"),
              formRow: 30,
            },
            {
              fieldCode: "logisticsContactInfo",
              fieldName: $T("sodr.common.model.common.logisticsContactInfo").$D("联系方式"),
              formRow: 40,
            },
            {
              fieldCode: "logisticsPhoneNum",
              fieldName: $T("sodr.common.model.common.logisticsPhoneNum").$D("收件人手机号"),
              render: (val, item) => [ item.internationalTelMeaning || " ", item.logisticsPhoneNum || " " ].join("|"),
              formRow: 50,
            },
            // {
            //   fieldCode: "carNumber",
            //   fieldName: $T("sodr.common.model.common.carNumber").$D("车牌号"),
            //   formRow: 60,
            // },
          ];
        case "attachInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "approveAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("sodr.common.view.purchaserAuditAttachment").$D("采购方审核附件"),
                      displayType: "grid",
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={$T("sodr.common.view.purchaserAuditAttachment").$D("采购方审核附件")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 10,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "reviewAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("sodr.common.view.purchaserReviewAttachment").$D("采购方复核附件"),
                      displayType: "grid",
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={$T("sodr.common.view.purchaserReviewAttachment").$D("采购方复核附件")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 20,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "otherAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("sodr.common.view.otherAttachment").$D("采购方其他附件"),
                      displayType: "grid",
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={$T("sodr.common.view.otherAttachment").$D("采购方其他附件")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 30,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "supplierAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("sodr.common.view.supplierAttachment").$D("供应商附件"),
                      displayType: "grid",
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={$T("sodr.common.view.supplierAttachment").$D("供应商附件")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 40,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "supplierAttaUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("sodr.common.view.supplierOtherAttachment").$D("供应商其他附件"),
                      displayType: "grid",
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={$T("sodr.common.view.supplierOtherAttachment").$D("供应商其他附件")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 50,
            },
          ];
        case "lineImportStatus":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) => {
                const importStatus = item.importStatus;
                const statusType = {
                  SUCCESS: "success",
                };
                return <SrmListHeader>
                  <span>{item.importTypeMeaning}({item.importType})</span>
                  <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[importStatus] || "danger"}>
                    {item.importStatusMeaning}
                  </SrmButton>
                </SrmListHeader>;
              },
              formRow: 10,
            },
            {
              fieldCode: "sync",
              fieldName: $T("sodr.common.model.common.sync").$D("同步执行"),
              render: (val, item) => <span style={{
                color: item.importStatus === "SUCCESS" ? "" : "var(--color-other-default-b)",
              }}>{$T("sodr.common.view.button.resync").$D("重新同步")}</span>,
              callBack: (record) => {
                if (record.importStatus !== "SUCCESS") {
                  this.openPopup("sync", record);
                }
              },
              formRow: 20,
            },
            {
              fieldCode: "importMessage",
              fieldName: $T("sodr.common.model.common.feedback").$D("反馈信息"),
              formRow: 30,
            },
            {
              fieldCode: "sourceCode",
              fieldName: $T("sodr.common.model.common.sourceCode").$D("外部系统"),
              formRow: 40,
            },
          ];
        case "lineImportStatusDetail":
          return [
            {
              fieldCode: "importType",
              fieldName: $T("sodr.common.model.common.importTypeMeaning").$D("接口代码"),
              formRow: 10,
            },
            {
              fieldCode: "importTypeMeaning",
              fieldName: $T("sodr.common.model.common.importType").$D("导入类型"),
              formRow: 10,
            },
            {
              fieldCode: "importStatusMeaning",
              fieldName: $T("sodr.common.model.common.importStatusMeaning").$D("导入状态"),
              formRow: 20,
            },
            {
              fieldCode: "sync",
              fieldName: $T("sodr.common.model.common.sync").$D("同步执行"),
              render: (val, item) => <span style={{
                color: item.importStatus === "SUCCESS" ? "" : "var(--color-other-default-b)",
              }}>{$T("sodr.common.view.button.resync").$D("重新同步")}</span>,
              callBack: (record) => {
                if (record.importStatus !== "SUCCESS") {
                  this.openPopup("sync", record);
                }
              },
              formRow: 20,
            },
            {
              fieldCode: "importMessage",
              fieldName: $T("sodr.common.model.common.feedback").$D("反馈信息"),
              formRow: 30,
            },
            {
              fieldCode: "sourceCode",
              fieldName: $T("sodr.common.model.common.sourceCode").$D("外部系统"),
              formRow: 40,
            },
          ];
        default:
          return [];
        }
      };
    },
    getOrderLineButtons() {
      return [
        {
          text: $T("sodr.common.view.button.close").$D("关闭"),
          type: "danger",
          bordered: true,
          visible: true,
          callback: (selected) => {
            if (selected.length) {
              const that = this;
              that.$dialog({
                content: $T("sodr.common.model.common.confirmClose").$D("是否确认关闭送货单") + "?",
                onOk() {
                  that.orderLineDataSet.updateSelected().then(() => {
                    that.$router.back();
                  });
                },
                onCancel() {
                },
              });
            } else {
              this.close();
            }
          },
        },
      ];
    },
    getButtons() {
      return [
        {
          text: $T("sodr.common.view.button.close").$D("关闭"),
          type: "danger",
          bordered: true,
          handler: () => {
            this.close();
          },
        },
        {
          text: $T("sodr.common.view.button.resync").$D("重新同步"),
          type: "primary",
          fill: true,
          disabled: this.commonDataSet.data && this.commonDataSet.data[0].closeSyncStatus !== "FAIL",
          handler: () => {
            this.reSync();
          },
        },
      ];
    },
  },
  mounted() {
    if (this.$route.query.asnHeaderId) {
      this.$loading.show();
      getOrderHeadInfo(this.$route.query.asnHeaderId, {
        customizeUnitCode: "SODR.DELIVERY_CLOSED_DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SODR.DELIVERY_CLOSED_DETAIL.HEADERSHIP"
      }).then((res) => {
        this.orderLineDataSet = new DataSet(orderLineDs(this.$route.query.asnHeaderId));
        this.orderLineDataSet.refresh();
        this.headerInfo = { ...res };
        this.commonDataSet.create({ ...res }, 0);
      }).finally(() => {
        this.$loading.hide();
      });
    }
  },
  methods: {
    close() {
      const that = this;
      this.$dialog({
        content: $T("sodr.common.model.common.confirmClose").$D("是否确认关闭送货单") + "?",
        onOk() {
          that.$loading.show();
          closeDeliveryBill([ {
            asnHeaderId: that.headerInfo.asnHeaderId,
            asnNum: that.headerInfo.asnNum,
            asnStatus: that.headerInfo.asnStatus,
            objectVersionNumber: that.headerInfo.objectVersionNumber,
            receiveStatus: that.headerInfo.receiveStatus,
            submitSyncStatus: that.headerInfo.submitSyncStatus,
            _token: that.headerInfo["_token"]
          } ]
          ).then((res) => {
            if (res && res.failed) {
              that.$notification.open({ message: res.message });
            } else {
              that.$router.back();
            }
          }).finally(() => {
            that.$loading.hide();
          });
        },
        onCancel() {
        },
      });
    },
    reSync() {
      this.$loading.show();
      reSyncDeliveryBill([ {
        asnHeaderId: this.headerInfo.asnHeaderId,
        asnNum: this.headerInfo.asnNum,
        asnStatus: this.headerInfo.asnStatus,
        objectVersionNumber: this.headerInfo.objectVersionNumber,
        receiveStatus: this.headerInfo.receiveStatus,
        submitSyncStatus: this.headerInfo.submitSyncStatus,
        _token: this.headerInfo["_token"]
      } ]
      ).then((res) => {
        if (res && res.failed) {
          this.$notification.open({ message: res.message });
        } else {
          this.$router.back();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "deliverGoodsInfo": $T("sodr.common.view.tab.deliverGoodsInfo").$D("发货信息"),
        "receiveInfo": $T("sodr.common.view.tab.receiveInfo").$D("收货信息"),
        "orderLineInfo": $T("sodr.common.view.tab.orderLineInfo").$D("基础信息"),
        "logisticsInfo": $T("sodr.common.view.tab.logisticsInfo").$D("物流信息"),
        "attachInfo": $T("sodr.common.view.tab.attach").$D("附件"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        "deliverGoodsInfo": "SMBL.DELIVERY_BILL_CLOSED.DELIVERY_GOODS_INFO",
        "receiveInfo": "SMBL.DELIVERY_BILL_CLOSED.RECEIVE_INFO",
        "orderLineInfo": "SMBL.DELIVERY_BILL_CLOSED.ORDER_LINE_INFO",
        "logisticsInfo": "SMBL.DELIVERY_BILL_CLOSED.LOGISTICS_INFO",
        "deliverGoodsInfoDetail": "SMBL.DELIVERY_BILL_CLOSED.DELIVERY_GOODS_INFO.DETAIL",
        "receiveInfoDetail": "SMBL.DELIVERY_BILL_CLOSED.RECEIVE_INFO.DETAIL",
        "orderLineInfoDetail": "SMBL.DELIVERY_BILL_CLOSED.ORDER_LINE_INFO.DETAIL",
        "logisticsInfoDetail": "SMBL.DELIVERY_BILL_CLOSED.LOGISTICS_INFO.DETAIL",
        "lineImportStatus": "SMBL.DELIVERY_BILL_CLOSED.LINE_IMPORT_STATUS",
      };
      return codeList[key] || key;
    },
    toggleOrderLineEdit() {
      this.orderLineDataSet.editFlag = !this.orderLineDataSet.editFlag;
    },
    clickDeliverGoodsInfo() {
      this.openPopup("deliverGoodsInfoDetail", this.commonDataSet);
    },
    clickReceiveInfo() {
      this.openPopup("receiveInfoDetail", this.commonDataSet);
    },
    clickOrderLineInfo() {
      this.openPopup("orderLineInfoDetail", this.orderLineDataSet);
    },
    clickLogisticsInfo() {
      this.openPopup("logisticsInfoDetail", this.commonDataSet);
    },
    clickLineImportStatus() {
      this.openPopup("lineImportStatusDetail", this.lineImportStatusDataSet);
    },
    // 弹框
    async openPopup(name, item) {
      switch (name) {
      case "lineImportStatus":
        this.lineImportStatusDataSet = new DataSet(lineImportStatusDs(item.asnLineId));
        this.lineImportStatusDataSet.refresh();
        this.popupData = {
          title: this.commonDataSet.data[0]["asnTypeCodeMeaning"] + this.commonDataSet.data[0]["asnNum"]
        };
        setTimeout(() => {
          this.visiblePopup = true;
          this.lineImportStatusVisible = true;
        }, 0);
        break;
      case "sync":
        this.lineImportStatusDataSet.updateRecords([ this.lineImportStatusDataSet.current ]);
        this.lineImportStatusDataSet.refresh();
        break;
      default:
        this.lineImportStatusVisible = false;
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
.detail-container {
  height 100vh;
}
.line-filter {
  display flex;
  justify-content space-between;

  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
  }
}
.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}
</style>