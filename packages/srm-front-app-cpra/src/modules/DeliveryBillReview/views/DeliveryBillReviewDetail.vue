<template>
  <div style="height: 100vh; overflow: auto;">
    <div class="detail-wrap">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <!-- <img src="@/assets/DeliveryBill/icon_Button_paperclip_highlight@3x.png"> -->
            <srm-upload :is-tab="true" :show-icon="false" :show-count="false" color="blue" :file-arr="fileArr" :desc-title="$T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')" />
          </srm-button>
          <srm-button size="small" type="warn" icon="icon-clock" @click="showOperationPop">
            <!-- <img src="@/assets/DeliveryBill/icon_Button_clock_highlight@3x.png"> -->
            <span>{{ $T('hipspfm.common.message.title.operationRecord').$D('操作记录') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 审批意见 -->
      <div class="approve-msg ">
        <div class="approve-tit">{{ $T('sinv.deliveryReview.model.deliveryReview.reviewRemark').$D('复审意见') }}</div>
        <div :class="[(showRemarkTips && !approvedRemark.length) ? 'textarea-wrap active':'textarea-wrap']">
          <textarea v-model="approvedRemark"/>
        </div>
        <div v-if="showRemarkTips && !approvedRemark.length" class="tips">{{ $T("hwfp.task.view.message.commentNotBeNull").$D("审批意见不能为空") }}</div>
      </div>

      <!-- 内容区 -->
      <srm-tab class="content" >
        <!-- 送货单头信息 -->
        <srm-tab-pane :label="$T('sinv.supplierDelivery.view.message.title.deliveryHeaderInfo').$D('送货单头信息')">
          <div class="content-item">
            <div class="card">
              <div class="card-head open-tag">{{ $T("sinv.common.model.common.supplierCompanyName").$D("供应商") }}：{{ headInfo.supplierCompanyName }}</div>
              <customize code="SMBL.DELIVERY_BILL_REVIEW.HEAD_INFO" :columns="getHeadColums" :data-source="headInfo" />
            </div>
            <div class="approve-msg ">
              <div class="approve-tit">{{ $T('small.common.model.markInfo').$D('备注信息') }}</div>
              <div class="textarea-wrap">
                <textarea v-model="headInfo.remark" disabled/>
              </div>
            </div>
            <div class="bottom-btn">
              <div class="look-detail" @click="goDetail()" >
                {{ $T("ssrc.bidHall.view.message.button.viewDetail").$D("查看详情") }}
              </div>
            </div>
          </div>
        </srm-tab-pane>

        <!-- 行信息 -->
        <srm-tab-pane :label="$T('hipspfm.common.view.message.title.lineInfo').$D('行信息')">
          <div class="content-item">
            <div v-for="(line, key) in lineInfo" :key="key" class="card has-border" @click="goLineDetail(line)">
              <div class="card-head open-tag">{{ line.itemName }}</div>
              <customize code="SMBL.DELIVERY_BILL_REVIEW.LINE_INFO" :columns="getLineInfoColumns" :data-source="line" />
            </div>
          </div>
        </srm-tab-pane>

        <!-- 物流信息 -->
        <srm-tab-pane :label="$T('sinv.common.view.message.title.logistics').$D('物流信息')">
          <div class="content-item">
            <div class="card" @click="goLogistDetail">
              <div class="card-head open-tag">{{ $T('sinv.common.model.common.logisticsCompany').$D('物流公司') }}：{{ logisInfo.logisticsCompanyMeaning }}</div>
              <customize code="SMBL.DELIVERY_BILL_REVIEW.LOGISTIC_INFO" :columns="getLogisticsInfoColumns" :data-source="logisInfo" />
            </div>
          </div>
        </srm-tab-pane>
      </srm-tab>
    </div>

    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="operationPopup"
      :action-data="operationArr"
      operator-field-name="processUser"
      operation-meaning-field-name="processStatusMeaning"/>

    <!-- 头信息弹窗 -->
    <head-info-popup v-model="headInfoFlag" :item-data="headInfo" />

    <!-- 行信息弹窗 -->
    <line-info-popup v-model="lineInfoFlag" :item-data="currentLineInfo" />

    <!-- 物流信息弹窗 -->
    <logis-info-popup v-model="LogisFlag" :item-data="logisInfo" />

    <!-- 底部按钮 -->
    <srm-bottom-handler :btn-arr="getBtnArr" />
  </div>
</template>

<script>
import uuid from "uuid";
import OperationRecord from "@/components/HistoryRecord";
import HeadInfoPopup from "../components/HeadInfoPopup";
import LineInfoPopup from "../components/LineInfoPopup";
import LogisInfoPopup from "../components/LogisInfoPopup";
import { dateFormat } from "@/utils/index";

import {
  adoptApi,
  rejectApi,
  getOpRecordApi,
  getOrderLineApi,
  getOrderHeaderApi,
  getLogisBaseInfoApi,
} from "../api/index";
export default {
  modules: [ "hipspfm.common", "sinv.common", "hipspfm.deliveryApproved", "ssrc.inquiryHall", "sinv.deliveryReview", "hwfp.task", "sinv.supplierDelivery", "small.common", "ssrc.bidHall", "sinv.purchaseReception", "sodr.common" ],
  name: "DeliveryBillReviewDetail",
  components: {
    LineInfoPopup,
    HeadInfoPopup,
    LogisInfoPopup,
    OperationRecord,
  },
  beforeRouteLeave(to, from, next) {
    if ((this.headInfoFlag || this.lineInfoFlag || this.LogisFlag) && to.name === "DeliveryBillReviewList") {
      if (this.LogisFlag) {
        this.LogisFlag = false;
      } else if (this.detailInfoFlag) {
        this.detailInfoFlag = false;
      } else if (this.lineInfoFlag) {
        this.lineInfoFlag = false;
      } else {
        this.headInfoFlag = false;
      }
      // eslint-disable-next-line callback-return
      next(false);
    } else {
      // eslint-disable-next-line callback-return
      next();
    }
  },
  data() {
    return {
      logisInfo: {}, //物流信息
      headInfoFlag: false,
      lineInfoFlag: false,
      LogisFlag: false,
      approvedRemark: "", //审批意见
      currentLineInfo: {}, //当前行信息
      headInfo: {},
      lineInfo: [],
      operationArr: [], //操作记录
      operationPopup: false,
      asnHeaderId: "",
      approveAttachmentUuid: "", //审核附件
      reviewAttachmentUuid: "", //复核附件
      otherAttachmentUuid: "", //采购方其他附件
      supplierAttachmentUuid: "", //供应商附件
      supplierOtherAttachmentUuid: "", //供应商其他附件
      showRemarkTips: false, //审批意见必输提示
    };
  },
  computed: {
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          // fieldName: "送货单号",
          fieldCode: "asnNum",
          // langCode: "sinv.purchaseReception.view.message.asnNum",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.expectedArriveTimeFrom").$D("预计到货时间"),
          fieldCode: "expectedArriveDate",
        }
      ];

      return columns;
    },
    // 头信息
    getHeadColums() {
      const columns = [
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.asnTypeCode").$D("送货单类型"),
          fieldCode: "asnTypeCodeMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.customer").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.invOrganizationName").$D("收货组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipToLocationAddress").$D("收货地点"),
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
          fieldCode: "immedShippedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sinv.common.model.common.contactInfo").$D("联系人"),
          fieldCode: "contactInfo",
        },
      ];

      return columns;
    },
    // 行信息
    getLineInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.common.model.deliverNumber").$D("发货数量"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promisedDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.lineNum").$D("行号"),
          fieldCode: "displayAsnLineNum",
        },
      ];

      return columns;
    },
    // 物流信息
    getLogisticsInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCost").$D("物流费用"),
          fieldCode: "logisticsCost",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
          fieldCode: "logisticsStaff",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
          fieldCode: "logisticsContactInfo",
        },
        {
          fieldName: this.$T("sinv.common.model.common.expressNum").$D("快递单号"),
          fieldCode: "expressNum",
        },
      ];

      return columns;
    },
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      let newFileArr = [
        {
          title: this.$T("sinv.common.purchasersAuditAttachment").$D(
            "审核附件"
          ),
          attachmentUuid: this.approveAttachmentUuid,
          readOnly: true
        },
        {
          title: this.$T("sinv.common.view.purchaserReviewAttachment").$D(
            "复核附件"
          ),
          attachmentUuid: this.reviewAttachmentUuid,
          readOnly: false
        },
        {
          title: this.$T("sinv.common.view.otherAttachment").$D("采购方其他附件"),
          attachmentUuid: this.otherAttachmentUuid,
          readOnly: true
        },
        {
          title: this.$T("sinv.common.view.supplierAttachment").$D(
            "供应商附件"
          ),
          attachmentUuid: this.supplierAttachmentUuid,
          readOnly: true
        },
        {
          title: this.$T("sinv.common.attachment.supplier.other").$D(
            "供应商其他附件"
          ),
          attachmentUuid: this.supplierOtherAttachmentUuid,
          readOnly: true
        }
      ];

      return newFileArr;
    },
    // 底部按钮
    getBtnArr() {
      const btnArr = [
        {
          type: "danger",
          title: this.$T("hipspfm.common.button.approvalReject").$D("审批拒绝"),
          color: "var(--color-other-default)",
          handler: () => {
            this.confirmReject();
          },
        },
        {
          title: this.$T("hipspfm.common.button.approved").$D("审批通过"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.confirmAdopt();
          },
        },
      ];

      return btnArr;
    }
  },
  mounted() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    this.getOrderHeader();
    this.getOrderLine();
    this.getOperationRecords();
    this.getLogisInfoList();
  },
  methods: {
    // 打开头信息弹窗
    goDetail() {
      this.headInfoFlag = true;
    },
    // 打开行信息弹窗
    goLineDetail(line) {
      this.lineInfoFlag = true;
      this.currentLineInfo = line;
    },
    // 打开物流信息弹窗
    goLogistDetail() {
      this.LogisFlag = true;
    },
    //操作记录弹窗线显示/隐藏
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    //获取订单头信息
    async getOrderHeader() {
      try {
        let param = {
          customizeUnitCode: "SINV.PURCHASER_DELIVERY.DETAIL.HEADER,SINV.SUPPLIER_DELIVERY.DETAIL.LOGISTICS,SINV.PURCHASER_DELIVERY.DETAIL.HEADERSHIP"
        };
        const headInfo = await getOrderHeaderApi(this.asnHeaderId, param);

        this.headInfo = headInfo;
        const {
          approveAttachmentUuid = uuid(),
          otherAttachmentUuid = uuid(),
          reviewAttachmentUuid = uuid(),
          supplierAttachmentUuid = uuid(),
          supplierAttaUuid = uuid(),
        } = headInfo;

        this.approveAttachmentUuid = approveAttachmentUuid;
        this.otherAttachmentUuid = otherAttachmentUuid;
        this.reviewAttachmentUuid = reviewAttachmentUuid;
        this.supplierAttachmentUuid = supplierAttachmentUuid;
        this.supplierOtherAttachmentUuid = supplierAttaUuid;
      } catch (err) {
        console.log(err);
      }
    },
    //获取订单行信息
    getOrderLine() {
      this.$loading.show();
      const params = {
        page: 0,
        size: 100,
        quaryType: "Review",
        customizeUnitCode: "SINV.DELIVERY_APPROVED_DETAIL.BASIC"
      };

      getOrderLineApi(this.asnHeaderId, params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      await getOpRecordApi(this.asnHeaderId).then((res) => {
        this.operationArr = res.content || [];
      });
    },
    // 获取物流信息
    getLogisInfoList() {
      // getLogisInfoListApi(this.asnHeaderId).then((res) => {
      //   // this.logisInfo = res[0]||{};
      // });
      getLogisBaseInfoApi(this.asnHeaderId).then((res) => {
        this.logisInfo = res || {};
      });
    },
    // 拒绝该订单
    confirmReject() {
      const that = this;

      this.$dialog({
        content: this.$T("hipspfm.deliveryApproved.validation.message.refusesDeliveryBill").$D("是否拒绝该送货单?"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          if (!that.approvedRemark) {
            that.showRemarkTips = true;
            return;
          }
          const params = that.buildParams();

          that.$loading.show();
          rejectApi(params).then((res) => {
            that.$loading.hide();
            if (res.length) {
              that.$notification.open({
                message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D("审批拒绝成功"),
                description: "",
                key: "refuse",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                that.$router.replace({ name: "DeliveryBillReviewList" });
              }, 1500);
            }
          }).finally(() => {
            that.$loading.hide();
          });
        },
      });
    },
    // 通过该订单
    confirmAdopt() {
      const that = this;

      that.showRemarkTips = false;
      this.$dialog({
        content: this.$T("hipspfm.deliveryApproved.validation.message.refuseDeliveryBill").$D("是否通过该送货单?"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          const params = that.buildParams();

          that.$loading.show();
          adoptApi(params).then((res) => {
            that.$loading.hide();
            if (res.length) {
              that.$notification.open({
                message: this.$T(
                  "hipspfm.common.view.validation.approvelSuccess"
                ).$D("审批通过成功"),
                description: "",
                key: "approvel",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                that.$router.replace({ name: "DeliveryBillReviewList" });
              }, 1500);
            }
          }).finally(() => {
            that.$loading.hide();
          });
        },
      });
    },
    buildParams() {
      const { _token, asnHeaderId, objectVersionNumber } = this.headInfo;
      const params = [
        {
          asnHeaderId,
          objectVersionNumber,
          _token
        }
      ];

      if (this.approvedRemark) {
        params[0].approvedRemark = this.approvedRemark;
      }
      return params;
    },
  },
};
</script>

<style lang="stylus" scoped>

.approve-msg {
  padding: 16px 15px;
  background: #ffffff;
  border-bottom .5px solid #f6f6f6;
  .approve-tit {
    color: #afafaf;
    line-height: 16px;
    font-size: 12px;
  }
  .textarea-wrap {
    margin-top 8px;
    height 56px;
    border-radius: 4px;
    &.active {
      border: 1px solid #f5222d;
    }
  }
  .tips {
    color: #f5222d;
    font-size: 10px;
    line-height 20px;
  }
}

.detail-wrap {
  width: 100%;
  overflow-y: auto;
  padding-bottom 80px;
  background: #F0F2F5;
  height calc(100vh - 44px);
}

// card样式
.card {
  padding 16px 15px;
  background: #ffffff;
  &.has-border {
    border-bottom: 4px solid #F0F2F5;
  }
  .card-head {
    color: #1f1f1f;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 12px;
  }
}

.bottom-btn {
  width 100%;
  display: flex;
  align-items center;
  padding-top 16px;
  padding-bottom 16px;
  background: #ffffff;
  justify-content center;
  .look-detail {
    background: #276ef1;
    border: 1px solid #276ef1;
    border-radius: 12px;
    padding 4px 8px;
    font-size 12px;
    color: #ffffff;
    line-height: 16px;
  }
}

</style>
