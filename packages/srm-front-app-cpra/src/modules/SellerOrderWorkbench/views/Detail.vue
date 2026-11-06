<template>
  <div class="order-content">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('smbl.common.view.tab.baseInfo').$D('基础信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  customize-code="SMBL.SELLER_ORDER_WORKBENCH.BASEINFO"
                  :data-set="basicInfoDataSet"
                  :columns="getBasicInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('slod.orderExecution.view.panel.organization').$D('交易方及采买组织信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  customize-code="SMBL.SELLER_ORDER_WORKBENCH.ORGANIZATION"
                  :data-set="basicInfoDataSet"
                  :columns="getOrgInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('slod.orderExecution.view.panel.detailInfo').$D('订单明细信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  customize-code="SMBL.SELLER_ORDER_WORKBENCH.DETAILINFO"
                  :data-set="lineInfoDataSet"
                  :columns="getDetailInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('slod.orderExecution.view.attachment.attachment').$D('附件')">
        <srm-attachment-button
          group
          :title="$T(
            'sodr.workspace.model.common.mobileAttachmentUUID'
          ).$D('外部附件-采购方')"
          show-total
          :attachments="[ {
            directory:'sodr-purchaser-external',
            attachmentUuid: basicInfoDataSet.current?.get('attachmentUuid'),
            displayType: 'list',
            readonly: true,
            showInfo:true,
            uploadButton: 'none',
          } ]"/>
        <srm-attachment-button
          group
          :title="$T(
            'sodr.workspace.model.common.mobileSupplierAttachmentId'
          ).$D('外部附件-供应商')"
          show-total
          :attachments="[ {
            directory:'sodr-supplier',
            attachmentUuid: basicInfoDataSet.current?.get('supplierAttachmentUuid') ||supplierAttachmentUuid,
            displayType: 'list',
            showInfo: true,
            readonly: type==='all' ,
            uploadButton: type==='all' ? 'none' : 'fixed',
          } ]"
          @fileUpload="onFileUpload"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('slod.orderExecution.view.option.operationRecord').$D('操作记录')">
        <history-record-tiled
          :action-data="operatingData"
          :remark-label="$T('slod.orderExecution.model.common.remark').$D('备注')"
          operation-meaning-field-name="processTypeMeaning"
          process-remark-field-name="processRemark"
          operator-field-name="processUserName"
          process-date-field-name="processedDate"/>
      </srm-scroll-tab-item>
      <!-- 留言板弹窗 -->
      <srm-scroll-tab-item
        class="srm-scroll-tab-message"
        :label="$T('sodr.common.view.button.messageBoard').$D('留言板')" >
        <div @click="showBoardPop">
          <srm-flex justify="between" align="center" class="message-container" style="padding: 0px 20px">
            <div>
              <span class="srm-icon icon-mail"/>
              <span class="message-text">{{ $T("sodr.common.view.button.boardMessage").$D("留言板消息") }}</span>
              <span v-show="unreadCount" class="message-badge">{{ unreadCount }}</span>
            </div>
            <span class="srm-icon icon-chevron-right"/>
          </srm-flex>
        </div>
      </srm-scroll-tab-item>
      <div v-if="getButtons.length>0" style="margin-bottom: 75px;border-top:1px solid var(--split-line-color-primary)"/>
    </srm-scroll-tab>
    <srm-bottom-handler v-if="getButtons.length>0" :btn-arr="getButtons" type="tooltip"/>
    <!-- 留言板弹窗 -->
    <message-board
      v-model="boardPop"
      :po-header-id="String($route.query.poHeaderId)"
      user-camp-code="SUPPLIER"/>
  </div>
</template>
<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { isArray, isNumber, isEmpty, debounce } from "lodash";
import uuid from "uuid";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import MessageBoard from "@/modules/SellerOrderWorkbench/component/MessageBoard/MessageBoard";
import { detailHeader, detailLine } from "../dataSource";
import { fetchSettingApi,
  fetchHistory,
  queryCollByLine,
  queryFileList,
  getVerification,
  confirmDetail,
  saveDetail,
  afterConfirm,
  saveAttachmentUUID,
  queryDoubleUomConfig,
  queryDoubleUnitConversion,
} from "../api";
import { getRecord } from "../utils/index";
import VerificationTable from "../component/VerificationTable";
import { formatAumont } from "../utils";
export default {
  modules: [ "slod.orderExecution", "smbl.common", "sodr.workspace", "sodr.common", "smbl.sellerOrderWorkbench" ],
  name: "SellerOrderWorkbenchDetail",
  components: { HistoryRecordTiled, MessageBoard },
  data() {
    const { type } = this.$route.query;
    return {
      basicInfoDataSet: new DataSet(detailHeader(this)),
      lineInfoDataSet: new DataSet(detailLine(this)),
      operatingData: [],
      setting:null, // 是否开启校验供应商附件
      // collByLine: 0, // 是否开启按行协同
      type,
      supplierAttachmentUuid: uuid(),
      boardPop: false,
      unreadCount:0,
      doubleUnitEnabled:0
    };
  },
  computed:{
    getBasicInfoColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "displayPoNum",
          fieldType: "EMPTY",
          render:(val) => <SrmListHeader>{val}</SrmListHeader>
        },
        {
          formRow: 1,
          fieldCode: "poTypeDesc",
          fieldName:this.$T("slod.orderExecution.model.common.poTypeId").$D("订单类型")
        },
        {
          formRow:2,
          fieldCode: "taxIncludeAmount",
          fieldName:this.$T("sodr.workspace.model.common.amountTaxInclude").$D("总金额(含税)"),
          render: (val, item) => formatAumont(val, [ "E-COMMERCE", "CATALOGUE" ].includes(item.poSourcePlatform) ? null : item.financialPrecision, true)
        },
        {
          formRow:2,
          fieldCode: "amount",
          fieldName:this.$T("sodr.workspace.model.common.amounts").$D("总金额(不含税)"),
          render: (val, item) => formatAumont(val, [ "E-COMMERCE", "CATALOGUE" ].includes(item.poSourcePlatform) ? null : item.financialPrecision, true)
        },
        {
          formRow:3,
          fieldCode:"quantityTotal",
          fieldName:this.$T("slod.orderExecution.model.common.quantityTotal").$D("总数量"),
          render: (val, item) => formatAumont(val, item.defaultPrecision)
        },
        {
          formRow:3,
          fieldCode: "currencyCode",
          fieldName:this.$T("slod.orderExecution.model.common.currencyCode").$D("币种")
        },
        {
          formRow:4,
          fieldCode: "creationDate",
          fieldName:this.$T("slod.orderExecution.model.common.creationDateTime").$D("创建时间")
        },
        {
          formRow:5,
          fieldCode: "termsName",
          fieldName:this.$T("slod.orderExecution.model.common.termsId").$D("付款条款")
        },
        {
          formRow: 6,
          fieldCode:"remark",
          fieldName:this.$T("slod.orderExecution.model.common.remark").$D("备注")
        },
      ];
    },
    getOrgInfoColumns() {
      return [
        {
          formRow:0,
          fieldType: "EMPTY",
          fieldCode: "supplierName",
          render:(val) => <SrmListHeader>{this.$T("slod.orderExecution.model.common.supplier").$D("供应商")}：{val}</SrmListHeader>
        },
        {
          formRow:1,
          fieldCode: "companyName",
          fieldName:this.$T("slod.orderExecution.model.common.company").$D("公司")
        },
        {
          formRow:2,
          fieldCode: "agentName",
          fieldName:this.$T("slod.orderExecution.model.common.agentId").$D("采购员")
        },
        {
          formRow:3,
          fieldCode: "purchaseOrgName",
          fieldName:this.$T("slod.orderExecution.model.common.purchaseOrgId").$D("采购组织")
        },
      ];
    },
    getDetailInfoColumns() {
      const isToBeFedBack = this.type === "toBeFedBack";
      const isFeedbackAlready = this.type === "feedbackAlready";
      return [
        {
          formRow:0,
          fieldType: "EMPTY",
          fieldCode: "itemName",
          fieldName:this.$T("slod.orderExecution.model.common.itemName").$D("物料名称"),
          render:(val, item) => <SrmListHeader>
            <span>{val}</span>
            <span slot="right">{item.displayStatusMeaning}</span>
          </SrmListHeader>
        },
        {
          formRow:1,
          fieldCode: "itemCode",
          fieldName:this.$T("slod.orderExecution.model.common.itemCode").$D("物料编码"),
        },
        {
          formRow:1,
          fieldCode: "displayLineNum",
          fieldName:this.$T("slod.orderExecution.model.common.displayLineNum").$D("行号"),
        },
        {
          formRow:2,
          fieldCode: "quantity",
          fieldType:  "INPUT_NUMBER",
          editLimit: true,
          localizeNumber:true,
          fieldName:this.doubleUnitEnabled ?
            this.$T("sodr.common.view.message.basicQuantity").$D("基本数量") :
            this.$T("slod.orderExecution.model.common.feedbackQuantity").$D("反馈数量"),
          editor: (val, item) => (isToBeFedBack && item.quantityEditFlag === 1 ||
            isFeedbackAlready && item.quantityEditFlagConfirm === 1) && !this.doubleUnitEnabled,
          // render: (val, item) => formatAumont(val, item.defaultPrecision, false),
          required: (val, item) => (isToBeFedBack && item.quantityEnableFlag === 1 || isFeedbackAlready && item.quantityEnableFlagConfirm === 1) && !this.doubleUnitEnabled,
          precision: (val, item) => {
            const precision = Number(item.uomPrecision);
            return isNaN(precision) || this.doubleUnitEnabled ? null : precision;
          },
        },
        {
          formRow:2,
          fieldCode: "originalQuantity",
          fieldName:this.$T("slod.orderExecution.model.common.quantity").$D("数量"),
          render: (val, item) => formatAumont(val, item.defaultPrecision, false),
        },
        this.doubleUnitEnabled && {
          formRow:3,
          fieldCode: "secondaryQuantity",
          fieldType:  "INPUT_NUMBER",
          editLimit: true,
          localizeNumber:true,
          fieldName:this.$T("slod.orderExecution.model.common.feedbackQuantity").$D("反馈数量"),
          inputChange: (val, item) => this.conversionUpdate(val, item, this),
          editor: (val, item) => isToBeFedBack && item.quantityEditFlag === 1 ||
            isFeedbackAlready && item.quantityEditFlagConfirm === 1,
          // render: (val, item) => formatAumont(val, item.defaultPrecision, false),
          required: (val, item) => isToBeFedBack && item.quantityEnableFlag === 1 || isFeedbackAlready && item.quantityEnableFlagConfirm === 1,
          precision: (val, item) => {
            const precision = Number(item.secondaryUomPrecision);
            return isNaN(precision) ? null : precision;
          },
        },
        {
          formRow:3,
          fieldType: "DATE_PICKER",
          fieldCode: "needByDate",
          fieldName:this.$T("slod.orderExecution.model.common.needByDate").$D("需求日期"),
          editor: false,
        },
        {
          formRow:4,
          fieldCode: "unitPrice",
          fieldName:this.$T("sodr.workspace.model.common.unitPrices").$D("单价(不含税)"),
          render: (val, item) => formatAumont(val, item.defaultPrecision, false)
        },
        {
          formRow:4,
          fieldCode: "enteredTaxIncludedPrice",
          fieldName:this.$T("sodr.workspace.model.common.enteredTaxIncludedPrice").$D("单价(含税)"),
          render: (val, item) => formatAumont(val, item.defaultPrecision, false)
        },
        {
          formRow:5,
          fieldType: "DATE_PICKER",
          fieldCode: "promiseDeliveryDate",
          fieldName:this.$T("slod.orderExecution.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          editor: (val, item) => isToBeFedBack && item.deliveryDateEditFlag === 1 || isFeedbackAlready && item.deliveryDateEditFlagConfirm === 1,
          required: (val, item) => isToBeFedBack && item.deliveryDateEnableFlag === 1 || isFeedbackAlready && item.deliveryDateEnableFlagConfirm === 1,
        },
        {
          formRow:6,
          fieldCode: "remark",
          fieldName:this.$T("slod.orderExecution.model.common.remark").$D("备注"),
        },
      ];
    },
    // getAttachmentColumns() {
    //   return [
    //     {
    //       fieldType: "EMPTY",
    //       formRow: 10,
    //       fieldCode: "attachmentUuid",
    //       render: (val) => <SrmFlex class="attachment" justify="between">
    //         <SrmFlex>
    //           <span class="srm-icon icon-other"/>
    //           <SrmAttachmentButton
    //             title={this.$T(
    //               "sodr.workspace.model.common.mobileAttachmentUUID"
    //             ).$D("外部附件-采购方")}
    //             showTotal= {true}
    //             attachments={ [ {
    //               attachmentUuid: val,
    //               displayType: "list",
    //               readonly: true,
    //               showInfo: true,
    //               uploadButton: "none",
    //             } ]}
    //           />
    //         </SrmFlex>
    //         <span class="srm-icon icon-chevron-right"/>
    //       </SrmFlex>,
    //     },
    //     {
    //       fieldType: "EMPTY",
    //       formRow: 20,
    //       fieldCode: "supplierAttachmentUuid",
    //       render: (val, item) => <SrmFlex class="attachment" justify="between">
    //         <SrmFlex>
    //           <span class="srm-icon icon-other"/>
    //           <SrmAttachmentButton
    //             showTotal= {true}
    //             title={this.$T(
    //               "sodr.workspace.model.common.mobileSupplierAttachmentId"
    //             ).$D("外部附件-供应商")}
    //             attachments={ [ {
    //               attachmentUuid: val || this.supplierAttachmentUuid,
    //               displayType: "list",
    //               readonly: this.type === "all",
    //               showInfo: true,
    //               uploadButton: this.type === "all" ? "none" : "fixed",
    //             } ]}
    //             onFileUpload= {() => {
    //               const { poHeaderId, supplierAttachmentUuid } = item;
    //               if (poHeaderId && !supplierAttachmentUuid) {
    //                 const params = { poHeaderId, uuidType: 2, uuid:this.supplierAttachmentUuid };
    //                 saveAttachmentUUID(params).then((res) => {
    //                   const basicCurrent = this.basicInfoDataSet.current;
    //                   if (isNumber(res) && !res.failed) {
    //                     basicCurrent.set("supplierAttachmentUuid", this.supplierAttachmentUuid);
    //                     basicCurrent.set("objectVersionNumber", res);
    //                   }
    //                 });
    //               }
    //             }}
    //           />
    //         </SrmFlex>
    //         <span class="srm-icon icon-chevron-right"/>
    //       </SrmFlex>,
    //     },
    //   ];
    // },
    getButtons() {
      switch (this.type) {
      case "toBeFedBack":
        return [
          {
            text: this.$T("slod.orderExecution.view.option.save").$D("保存"),
            type: "primary",
            visable: true,
            handler: () => {
              this.handleSave();
            },
          },
          {
            text: this.$T("slod.orderExecution.view.option.feedback").$D("反馈"),
            type: "primary",
            bordered: true,
            fill:true,
            visable: true,
            handler: () => {
              this.handleFeedback();
            },
          },
        ];
      case "feedbackAlready":
        return [ {
          text: this.$T("slod.orderExecution.view.option.feedbackAgain").$D("再次反馈"),
          type: "primary",
          bordered: true,
          fill:true,
          visable: true,
          handler: () => {
            this.handleFeedback();
          },
        } ];
      default:
        return [];
      }
    }
  },
  mounted() {
    this.refresh();
  },
  methods:{
    conversionUpdate:debounce(async (val, item, self) => {
      const { itemId, secondaryUomId, secondaryQuantity, uomId:doublePrimaryUomId } = item;
      if (!(itemId && secondaryUomId && doublePrimaryUomId && secondaryQuantity)) {
        return;
      }
      const itemOrgUom = [ {
        itemId,
        businessKey: "-9999",
        secondaryUomId,
        secondaryQuantity,
        doublePrimaryUomId,
      } ];
      self.$loading.show();
      queryDoubleUnitConversion(itemOrgUom).then((res) => {
        if (res && !res.failed) {
          if (res.length) {
            item.quantity = res[0].primaryQuantity;
          }
        }
      }).finally(() => {
        self.$loading.hide();
      });
    }, 600),
    // 获取双单位配置
    queryCommonDoubleUomConfig() {
      queryDoubleUomConfig().then((res) => {
        if (isNumber(res)) {
          this.doubleUnitEnabled = res;
        }
      });
    },
    //留言板显示
    showBoardPop() {
      this.boardPop = !this.boardPop;
      this.unreadCount = 0;
    },
    refresh() {
      this.basicInfoDataSet.refresh();
      this.lineInfoDataSet.refresh();
      this.fetchOperatingData();
      this.fetchSettings();
      // this.queryCollByLine();
      this.queryCommonDoubleUomConfig();
    },
    fetchOperatingData() {
      const { poHeaderId } = this.$route.query;
      fetchHistory(poHeaderId).then((res) => {
        if (res && !res.failed && isArray(res.content)) {
          this.operatingData = getRecord(res.content);
        }
      });
    },
    queryCollByLine() {
      queryCollByLine().then((res) => {
        if (isNumber(res)) {
          this.collByLine = res;
        }
      });
    },
    fetchSettings() {
      fetchSettingApi().then((res) => {
        if (res && !res.failed) {
          this.setting = res["010219"];
        }
      });
    },
    handleSave() {
      const data = {
        poHeaderDetailDTO:
              { ...this.basicInfoDataSet.current.toData(), poWorkbenchFlag:1, },
        poLineDetailDTOs: this.lineInfoDataSet.toData()
      };
      const validateStatus = this.basicInfoDataSet.validate() && this.lineInfoDataSet.validate();
      if (validateStatus) {
        this.$loading.show();
        saveDetail(data).then((res) => {
          if (res && !res.failed || res === "") {
            this.$notification.open({
              message: this.$T("smbl.common.message.operateSuccess").$D("操作成功")
            });
            this.refresh();
          }
        }).finally(() => {
          this.$loading.hide();
        });
      }
    },
    async handleFeedback() {
      this.$loading.show();
      const isToBeFedBack = this.type === "toBeFedBack";
      const validateStatus = this.basicInfoDataSet.validate() && this.lineInfoDataSet.validate();
      if (validateStatus) {
        const verificationRes = !isToBeFedBack || await this.getVerification();
        if (verificationRes) {
          const uuidRes = await this.validateUuid().catch(() => this.$loading.hide());
          if (uuidRes) {
            const data = {
              poHeaderDetailDTO:
              { ...this.basicInfoDataSet.current.toData(), poWorkbenchFlag:1, },
              poLineDetailDTOs: this.lineInfoDataSet.toData()
            };
            const res = await (isToBeFedBack ? confirmDetail([ data ]) : afterConfirm(data)).catch(() => this.$loading.hide());
            if (res && !res.failed) {
              this.$notification.open({
                message: this.$T("smbl.common.message.operateSuccess").$D("操作成功")
              });
              this.$router.push({
                name: "SellerOrderWorkbenchList",
              });
            }
          }
        }
      }
      this.$loading.hide();
    },
    getVerification() {
      return new Promise((resolve) => {
        const data = this.basicInfoDataSet.toData();
        getVerification(data).then((result) => {
          if (result && !result.failed) {
            if (isArray(result.content) && !isEmpty(result.content)) {
              const onOk = function() {
                resolve(true);
              };
              const onClose = function() {
                resolve(false);
              };
              this.$popup({
                showHeader:true,
                rounded:true,
                height:"75%",
                content:<VerificationTable body={data} handleOk={onOk} handleClose={onClose}></VerificationTable>,
                onClose,
                title:this.$T("slod.orderExecution.view.confirm.feedback").$D("是否确认反馈订单") });
            } else {
              resolve(true);
            }
          } else {
            resolve(false);
          }
        });
      });
    },
    async validateUuid() {
      const basicCurrent = this.basicInfoDataSet.current;
      let result = true;
      if (this.setting === "1") {
        const supplierAttachmentUuid = basicCurrent?.get("supplierAttachmentUuid");
        if (supplierAttachmentUuid) {
          const fileList = await queryFileList({ attachmentUUID:supplierAttachmentUuid, bucketName: SrmUtil.getDefaultBucketName(),
            bucketDirectory: "sodr-order" });
          result = isArray(fileList) && !isEmpty(fileList);
        } else {
          result = false;
        }
      }
      if (!result) {
        const displayPoNum = basicCurrent?.get("displayPoNum");
        this.$notification.open({
          type: "waring",
          message: this.$T("slod.orderExecution.view.message.accessoryNotNull1", [ displayPoNum ]).$D("订单:[{poNum}]附件不能为空"),
          duration: 5,
        });
      }
      return result;
    },
    onFileUpload() {
      const basicCurrent = this.basicInfoDataSet.current;
      const { poHeaderId, supplierAttachmentUuid } = basicCurrent?.toData() || {};
      if (poHeaderId && !supplierAttachmentUuid) {
        const params = { poHeaderId, uuidType: 2, uuid:this.supplierAttachmentUuid };
        saveAttachmentUUID(params).then((res) => {
          if (isNumber(res) && !res.failed) {
            basicCurrent.set("supplierAttachmentUuid", this.supplierAttachmentUuid);
            basicCurrent.set("objectVersionNumber", res);
          }
        });
      }
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
  .attachment-tag{
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

.srm-scroll-tab-message {
  position: relative;
  .message-container{
    height: 60px;
    .message-badge{
      display: inline-block;
      padding: 0 4px;
      height: 18px;
      min-width: 20px;
      line-height: 18px;
      font-weight: 500;
      border-radius: 10px;
      background: #E11900;
      font-family: PingFangSC-Medium;
      font-size: 10px;
      color: #FFFFFF;
    }
    .message-text{
      font-size: 14px;
      margin: 0 10px;
    }
    .srm-icon{
      font-size: 16px;
    }
    .icon-mail {
      color: #276EF1;
    }
  }
}

</style>