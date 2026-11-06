<template>
  <div style="height: 100vh">
    <!-- 头信息 -->
    <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns" />

    <!-- 内容区域 -->
    <srm-scroll-tab
      content-scroll
      :margin-bottom="quotationHeaderStatus === 'NOT_PARTICIPATED' ? 55 : 40">
      <srm-scroll-tab-item
        :label="
          $T('hipspfm.supplierQuotation.view.title.rfxHeadInfo').$D(
            '询价单头信息'
          )
        ">
        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
          <span>{{
            $T("hipspfm.supplierQuotation.view.title.noRfxHeadInfo").$D(
              "暂无询价单头信息"
            )
          }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          code="SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_HEADER"
          :data-source="headInfo"
          :columns="getInquirySheetHeadInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="haspreQualification"
        :label="
          $T('ssrc.supplierQuotation.view.message.panel.preQualification').$D(
            '资格预审'
          )
        ">
        <div v-if="JSON.stringify(prequalInfo) === '{}'" class="noContent">
          <span>{{
            $T(
              "hipspfm.supplierQuotation.model.supplierQuotation.NoPreQualification"
            ).$D("暂无资格预审")
          }}</span>
        </div>
        <div v-else @click="goToPrequal">
          <customize
            :need-padding="true"
            code="SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_PREQUA"
            :data-source="prequalInfo"
            :columns="getPreQuaInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T(
            'hipspfm.supplierQuotation.model.supplierQuotation.rfxLineInfo'
          ).$D('询价单行信息')
        ">
        <div>
          <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
            <span>{{
              $T(
                "hipspfm.supplierQuotation.model.supplierQuotation.NoRfxLineInfo"
              ).$D("暂无询价单行信息")
            }}</span>
          </div>
          <div
            v-for="(item, index) in lineInfo"
            v-else
            :key="item.quotationLineId"
            @click="goToDetail(item, index)">
            <customize
              :need-padding="true"
              code="SMBL.SUPPLIER_QUOTATION.TAB_VIEW_SCROLL_LINE"
              :data-source="item"
              :columns="getLineInfoColumns"/>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <supplier-bidding-material-info
      v-model="lineDetailPopup"
      :index="currentLineIndex"
      :head-info="headInfo"
      :line-info="lineInfo"/>
    <!-- 审批意见弹窗 -->
    <info-pop
      v-model="ideaPop"
      type="reject"
      :title="
        $T('ssrc.supplierBid.model.supplierBid.giveUpReason').$D('放弃理由')
      "
      @confirmInfo="handleAbandon"/>
    <!-- 资格预审附件 -->
    <attached-file
      v-model="preFilePopup"
      :attachment-uuid="prequalAttachmentUuid"/>
    <srm-bottom-handler
      v-if="quotationHeaderStatus === 'NOT_PARTICIPATED'"
      :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import uuid from "uuid";
import InfoPop from "@/components/InfoPop";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getOrderHeadInfo,
  getOrderLineInfos,
  getPreQualInfo,
  getParticipateApi,
  getAbandonApi,
  getDeliveryList,
} from "../api/index";
import SupplierBiddingMaterialInfo from "@/modules/SupplierQuotation/views/SupplierBiddingMaterialInfo";
export default {
  modules: [ "sodr.sendOrder", "hzero.common", "spuc.common", "sodr.confirmOrder", "hipspfm.common", "sodr.common", "hipspfm.orderConfirmation", "ssrc.inquiryHall", "hipspfm.invoiceBill", "sfin.invoiceBill", "sfin.common", "sfin.supplierChargeEntry", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "ssrc.supplierBid", "smbl.common", "ssrc.common" ],
  name: "PrequalificationDetail",
  components: {
    SupplierBiddingMaterialInfo,
    AttachedFile,
    InfoPop,
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      prequalInfo: {},
      ideaPop: false,
      currentLineIndex: -1,
      preFilePopup: false,
      lineDetailPopup: false,
      prequalAttachmentUuid: "", //资格预审文件
      quotationHeaderStatus: "", //报价单状态
      prequalLineStatusMap: {
        SUBMITED: this.$T("hipspfm.common.status.submitted").$D("已提交"),
        NO_SUBMIT: this.$T("hipspfm.common.status.unSubmitted").$D("未提交"),
        APPROVED: this.$T("hipspfm.common.status.passed").$D("已通过"),
      },
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          type: "danger",
          title: this.$T("ssrc.supplierQuotation.model.supQuo.abandon").$D(
            "放弃"
          ),
          // eslint-disable-next-line no-return-assign
          handler: this.openInfo,
        },
        {
          type: "primary",
          title: this.$T(
            "ssrc.supplierQuotation.view.message.button.participate"
          ).$D("参与"),
          // eslint-disable-next-line no-return-assign
          handler: this.handleParticipate,
        },
      ];
    },
    haspreQualification() {
      return (
        this.headInfo.preQualificationFlag ||
        Boolean(this.prequalLineStatusMeaning)
      );
    },
    getPreQualification() {
      return (
        this.prequalLineStatusMap[this.prequalLineStatus] ||
        this.prequalLineStatusMeaning
      );
    },
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      return [
        {
          title: this.$T(
            "sfin.invoiceBill.model.invoiceBill.supplierCompanyId"
          ).$D("供应商"),
          attachmentUuid: this.attachmentUUID || uuid(),
          readOnly: false,
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxTitle",
        },
      ];

      return columns;
    },
    // 询价单头信息
    getInquirySheetHeadInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "paymentTypeName",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>
                {this.$T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D(
                  "付款方式"
                )}
                :{val}
              </span>
              <div slot="right">
                <span style={{ color: "var(--color-font-default-e)" }}>
                  {this.$T("ssrc.supplierQuotation.model.supQuo.round").$D(
                    "轮次"
                  )}
                  ：{record.roundNumber}
                </span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuot.companyName"
          ).$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.curryCode"
          ).$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.exchangeRate"
          ).$D("汇率"),
          fieldCode: "exchangeRate",
          render: (val) => Number(val).toFixed(4),
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.bidDirect"
          ).$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.sealedQuotation"
          ).$D("密封报价"),
          fieldCode: "sealedQuotationFlag",
          render: (val) =>
            val === 0 ?
              this.$T("hipspfm.common.status.no").$D("否") :
              this.$T("hipspfm.common.status.yes").$D("是"),
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.sourcingCategory"
          ).$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.priceCategory"
          ).$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldCode: "rfxRemark",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span>
                {this.$T("ssrc.supplierQuotation.model.supQuo.remarks").$D(
                  "备注"
                )}
                ：{val}
              </span>
            </SrmListHeader>
          ,
        },
      ];
      return columns;
    },
    //资格预审
    getPreQuaInfoColumns() {
      const columns = [
        {
          fieldCode: "prequalEndDate",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) =>
            <SrmListHeader showOpenTag={true}>
              <span>
                {" "}
                {this.$T(
                  "hipspfm.supplierQuotation.model.supplierQuotation.prequalEndDate"
                ).$D("预审截止时间")}
                ：{val}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.prequalFileExpense"
          ).$D("预审文件费"),
          fieldCode: "prequalFileExpense",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.enableScoreFlag"
          ).$D("启用评分细项"),
          fieldCode: "paymentFlag",
          render: (val) =>
            Number(val) ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.prequalificationDocuments"
          ).$D("资格预审文件"),
          fieldCode: "prequalificationFile",
          render: () =>
            <span style="color:blue">{this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")}</span>,
          callBack: () => {
            this.showFilePop("preFilePopup");
          },
        },
        {
          fieldCode: "getPreQualification",
          fieldType: "EMPTY",
          render: () =>
            <SrmListHeader showOpenTag={false}>
              <span>
                {this.$T(
                  "ssrc.supplierQuotation.view.message.title.applicationForPre-qualification"
                ).$D("预审申请")}
                ：
                {this.getPreQualification ===
                  this.$T("sodr.sendOrder.model.common.submitted").$D(
                    "已提交"
                  ) && <span class="orange">{this.getPreQualification}</span>}
                {this.getPreQualification ===
                  this.$T("hipspfm.common.status.unSubmitted").$D("未提交") &&
                  <span class="red">{this.getPreQualification}</span>
                }
                {this.getPreQualification ===
                  this.$T("hipspfm.common.status.passed").$D("已通过") &&
                  <span class="green">{this.getPreQualification}</span>
                }
              </span>
            </SrmListHeader>
          ,
        },
      ];
      return columns;
    },
    // 询价单行信息
    getLineInfoColumns() {
      const columns = [
        {
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <div slot="right">
                <span>
                  {this.$T("ssrc.supplierQuotation.model.supQuo.lineNum").$D(
                    "行号"
                  )}
                  ：{record.rfxLineItemNum}
                </span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemCode").$D(
            "物料编码"
          ),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.rfxQuantity"
          ).$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.unit"
          ).$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.demandDate"
          ).$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val),
        },
      ].filter(Boolean);
      return columns;
    },
  },
  async mounted() {
    const {
      rfxHeaderId,
      quotationHeaderId,
      rfxNum,
      rfxTitle,
      operationMeaning,
      supplierCompanyId,
      prequalLineStatusMeaning,
      quotationHeaderStatus,
    } = this.$route.query;
    this.asnHeaderId = rfxHeaderId;
    this.rfxHeaderId = rfxHeaderId;
    this.quotationHeaderId = quotationHeaderId;
    this.organizationName = rfxNum;
    this.purchaseAgentName = rfxTitle;
    this.operationMeaning = operationMeaning;
    this.supplierCompanyId = supplierCompanyId;
    this.prequalLineStatusMeaning = prequalLineStatusMeaning;
    this.quotationHeaderStatus = quotationHeaderStatus;
    await this.getOrderHeader();
    await this.getOrderLine();
    await this.getPreQual();
    this.loading = true;
  },
  methods: {
    // 跳转预审详情
    goToPrequal() {
      this.$router.push({
        name: "PrequalificationApprove",
        query: {
          rfxHeaderId: this.rfxHeaderId,
          operationMeaning: this.operationMeaning,
          prequalLineStatusMeaning: this.prequalLineStatusMeaning,
          supplierCompanyId: this.supplierCompanyId,
        },
      });
    },
    // 跳转行详情
    goToDetail(item, index) {
      this.currentLineItemIndex = index;
      this.lineDetailPopup = true;
    },
    showFilePop(type = "filePopup") {
      this[type] = !this[type];
    },
    // 获取头信息
    async getOrderHeader() {
      const params = {
        customizeUnitCode: "SSRC.SUPPLIER_PARTICIPATE.BASE_FORM",
        organizationId: window.localStorage.organizationId,
        rfxHeaderId: this.rfxHeaderId,
      };
      try {
        const headInfo = await getOrderHeadInfo(
          this.rfxHeaderId,
          "supplier",
          params
        );
        this.headInfo = headInfo;
        this.rfxTechAttachmentUuid = headInfo.rfxTechAttachmentUuid || uuid();
        this.rfxBusinessAttachmentUuid =
          headInfo.rfxBusinessAttachmentUuid || uuid();
      } catch (err) {
        // console.log(err);
      }
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      let params = {
        customizeUnitCode: "SSRC.SUPPLIER_PARTICIPATE.ITEM_LINE",
        rfxHeaderId: this.rfxHeaderId,
        supplierCompanyId: this.supplierCompanyId,
        page: 0,
        size: 100,
      };
      //跟谁学个性化字段
      // if (this.getTenantNum === "SRM-BJHL") {
      //   params.customizeUnitCode = "SSRC.SUPPLIER_PARTICIPATE.ITEM_LINE";
      // }
      await getOrderLineInfos(this.rfxHeaderId, params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    //获取预审信息
    async getPreQual() {
      this.$loading.show();
      const params = {
        prequalCategory: "RFX",
      };
      await getPreQualInfo(this.rfxHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res) {
          this.prequalInfo = res;
          this.prequalEndDate = res.prequalEndDate;
          this.prequalLineStatus = res.prequalLineStatus;
          this.prequalAttachmentUuid = res.prequalAttachmentUuid || uuid();
          this.validAttachmentUuid = res.validAttachmentUuid || uuid();
        }
      });
    },
    // 获取列表信息
    getOpearMeaning() {
      return new Promise((resolve) => {
        getDeliveryList({ rfxNum: this.organizationName }).then((res) => {
          if (res) {
            resolve(res.content[0]);
          }
        });
      });
    },
    // 参与
    handleParticipate() {
      const params = {
        rfxHeaderId: this.rfxHeaderId,
        roundNumber: this.headInfo.roundNumber,
        objectVersionNumber: this.headInfo.objectVersionNumber,
        supplierCompanyId: this.supplierCompanyId,
      };
      // eslint-disable-next-line consistent-this
      const _this = this;
      //获取时间戳
      const dateFormate = new Date(
        this.prequalEndDate ? this.prequalEndDate.replace(/-/, "/") : ""
      ).getTime();
      const currentDate = new Date().getTime();
      if (currentDate > dateFormate) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.timeNullCantIn"
          ).$D("预审截止时间已过，无法参与"),
          description: "",
          class: "notification",
        });
      } else {
        // eslint-disable-next-line rulesdir/no_hips
        this.$dialog({
          content: this.$T(
            "hipspfm.supplierQuotation.view.message.confirmInTheQuery"
          ).$D("是否确定参与询价？"),
          okText: this.$T("hipspfm.common.button.ok").$D("确定"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable: false,
          asyncClose: true,
          onOk: () => {
            getParticipateApi(params).then((res) => {
              if (!res.failed) {
                _this.handlerFlag = false;
                _this.getOpearMeaning().then(() => {
                  //update by cyy , 对比pc的逻辑，参与成功后并没有进入报价界面，而是返回列表页， 由列表页可再次载入参与；当前这个写法后端并没有返回报价单头ID，
                  // 且通过getOpearMeaning过去的供应商报价列表信息取第一条的逻辑并不成立，后续逻辑会有问题，无法查询报价数据；改为和pc一致，直接返回列表页
                  // console.info(operationMeaning);
                  // 根据状态跳转页面
                  // if (![ "BIDDING", "QUOTATION" ].includes(operationMeaning)) {
                  //   _this.$router.replace({
                  //     name: "PrequalificationDetail",
                  //     query: { ..._this.$route.query, operationMeaning }
                  //   });
                  // } else {
                  //   _this.$router.replace({
                  //     name: "SupplierBiddingDetail",
                  //     query: {
                  //       ..._this.$route.query,
                  //       operationMeaning,
                  //       quotationHeaderId: this.rfxHeaderId
                  //     }
                  //   });
                  // }
                  // this.$router.back();
                  this.$notification.open({
                    message: this.$T("smbl.common.message.acction.success").$D(
                      "操作成功"
                    ),
                    description: "",
                    class: "notification",
                  });
                  this.$router.push({
                    name: "SupplierQuotationList",
                  });
                });
              } else {
                this.$notification.open({
                  message: res.message,
                  description: "",
                  class: "notification",
                });
              }
              // this.$router.push({
              //   name: "SupplierQuotationList",
              // });
              // setTimeout(() => {
              //   // eslint-disable-next-line rulesdir/no_hips
              //   _this.$hips.dialog.close();
              // }, 200);
            });
          },
        });
      }
    },
    openInfo() {
      this.ideaPop = !this.ideaPop;
      // this.$confirm({require: true})
    },
    // 放弃
    handleAbandon(data) {
      const params = {
        rfxHeaderId: this.rfxHeaderId,
        roundNumber: this.headInfo.roundNumber,
        objectVersionNumber: this.headInfo.objectVersionNumber,
        supplierCompanyId: this.supplierCompanyId,
        abandonRemark: data,
      };
      // eslint-disable-next-line consistent-this
      const _this = this;
      // eslint-disable-next-line rulesdir/no_hips
      this.$dialog({
        content: this.$T(
          "hipspfm.supplierQuotation.view.message.abandonInTheQuery"
        ).$D("是否放弃参与询价?"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        asyncClose: true,
        onOk: () => {
          this.$loading.show();
          getAbandonApi(params).then((res) => {
            this.$loading.hide();
            if (!res) {
              this.$notification.open({
                message: this.$T(
                  "hipspfm.supplierQuotation.view.message.abandonTheQuerySuccess"
                ).$D("您已成功放弃参与询价"),
                description: "",
                class: "notification",
              });
              _this.$router.push({
                name: "SupplierQuotationList",
              });
            } else {
              // eslint-disable-next-line rulesdir/no_hips
              this.$dialog({
                message: res.message,
                duration: 2000,
              });
            }
          });
          // setTimeout(() => {
          //   // eslint-disable-next-line rulesdir/no_hips
          //   _this.$hips.dialog.close();
          // }, 200);
        },
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.red {
  color: var(--color-other-default);
}

.green {
  color: var(--color-other-default-b) !important;
}

.orange {
  color: var(--color-other-default-c) !important;
}

.gray {
  color: var(--color-font-default-e) !important;
}
</style>
