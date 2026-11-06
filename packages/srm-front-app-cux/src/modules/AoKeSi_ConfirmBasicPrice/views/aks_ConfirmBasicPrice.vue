<template>
  <div style="height: 100vh">
    <!-- 导航栏 -->
    <NavHead
      :title="$T('sodr.sendOrder.view.message.title1').$D('确认基准价')"
      @goBack="goBack"
      @goClose="goClose"/>

    <!-- 内容 -->
    <srm-scroll-tab>
      <!-- 头信息 -->
      <srm-scroll-tab-item
        :label="$T('ssrc.inquiryHall.view.message.headerInfo').$D('头信息')">
        <div class="content-item">
          <div class="header-card">
            <Customize
              :columns="getHeaderInfoColums"
              :data-source="headerInfo"
              unit-type="FORM"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <!-- 标的行信息 -->
      <srm-scroll-tab-item
        :label="
          $T('ssrc.inquiryHall.view.message.biddingLineInfo').$D('标的行信息')
        ">
        <div class="content">
          <div class="scrollWrap">
            <div ref="listScroll" @refresh="loadRefresh" @loadMore="loadMore">
              <div v-for="(li, index) in list" :key="index" class="card">
                <!-- 标题 -->
                <div>
                  <span class="block" />
                  <span class="code">
                    <span>
                      {{ index + 1 }}： {{ li.itemCode }} -
                      {{ li.itemName }}
                    </span>
                  </span>
                  <div class="attachment-upload">
                    <SrmUpload :desc-title="$T('ssrc.inquiryHall.model.inquiryHall.attachment').$D(
                      '附件'
                    )" :attachment-uuid="li.attachmentUuid" />
                  </div>
                </div>
                <!-- 内容 -->
                <ul>
                  <li>
                    <p>
                      <span>{{
                        $T("ssrc.inquiryHall.model.inquiryHall.category").$D(
                          "类别"
                        )
                      }}：</span>
                      <span>{{ li.categoryName || `-` }}</span>
                    </p>
                    <p>
                      <span>{{
                        $T(
                          "ssrc.inquiryHall.model.inquiryHall.rfxQuantity"
                        ).$D("需求数量")
                      }}：</span>
                      <span>{{ li.rfxQuantity || `-` }}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <span>{{
                        $T(
                          "ssrc.inquiryHall.model.inquiryHall.benchmarkPrice"
                        ).$D("基准价(发起)")
                      }}：</span>
                      <span>{{ li.benchmarkPrice || `-` }}</span>
                    </p>
                    <p>
                      <span>{{
                        $T(
                          "ssrc.inquiryHall.model.inquiryHall.benchmarkRemark"
                        ).$D("发起备注")
                      }}：</span>
                      <span>{{ li.remark || `-` }}</span>
                    </p>
                  </li>
                </ul>
                <!-- 底部 -->
                <SrmInputField
                  v-model="li.reviewedPrice"
                  theme="fill"
                  :disabled="
                    reviewLineDisableFlag
                  "
                  type="number">
                  <span slot="left">{{
                    $T("ssrc.inquiryHall.model.inquiryHall.reviewPrice").$D(
                      "基准价审核(元)"
                    )
                  }}
                    :
                  </span>
                  <span slot="right" class="srm-icon icon-edit" />
                </SrmInputField>
                <SrmInputField
                  v-model="li.approveRemark"
                  theme="fill"
                  :disabled="
                    benchmarkData.benchmarkStatus!=='DEFEND'
                  "
                  type="input">
                  <span slot="left">{{
                    $T("ssrc.inquiryHall.model.inquiryHall.approveOfRemark").$D(
                      "审核人备注"
                    )
                  }}
                    :
                  </span>
                  <span slot="right" class="srm-icon icon-edit" />
                </SrmInputField>
                <SrmInputField
                  v-if="!benchmarkData.readonly && benchmarkData.reviewedFlag"
                  v-model="li.approvedPrice"
                  theme="fill"
                  :disabled="approveLineDisableFlag"
                  type="number">
                  <span slot="left">{{
                    $T("ssrc.inquiryHall.model.inquiryHall.approvePrice").$D(
                      "基准价审批(元)"
                    )
                  }}
                    :
                  </span>
                  <span slot="right" class="srm-icon icon-edit" />
                </SrmInputField>
              </div>
            </div>
          </div>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 底部 -->
    <div v-if="!benchmarkData.readonly" class="foot">
      <span @click="save">{{
        $T("hipspfm.common.button.save").$D("保存")
      }}</span>
      <span @click="submit">{{
        $T("hipspfm.common.button.submit").$D("提交")
      }}</span>
    </div>
  </div>
</template>

<script>
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import NavHead from "@/components/NavHead";
import {
  getBasicPriceDetailApi,
  saveBasicPriceApi,
  submitBasicPriceApi,
  getBasicPriceHeaderDetailApi,
} from "../api/index";

export default {
  modules: [
    "hipspfm.common",
    "hipspfm.createDelivery",
    "sodr.sendOrder",
    "ssrc.inquiryHall",
    "hipspfm.workFlow",
    "sslm.commonApplication",
    "ssrc.common",
  ],
  name: "aks_ConfirmBasicPrice",
  components: {
    NavHead,
  },
  data() {
    return {
      list: [],
      lineFilePopup: false,
      attachmentUuid: "",
      approvedPriceVal: "",
      page: 0,
      size: 100,
      totalCount: 0,
      benchmarkData: {},
      headerInfo: {},
      reviewHeaderVisible:false,
      reviewHeaderDisable:false,
      approvHeadereDisable:false,
      approveHeaderVisible:false
    };
  },
  computed: {
    benchmarkPriceFlag() {
      return this.list.some((item) => {
        return item.benchmarkPrice;
      });
    },
    reviewLineDisableFlag() {
      return this.benchmarkData.readonly ||
                      Boolean(this.benchmarkData.reviewedFlag) ||
                      !this.benchmarkPriceFlag;
    },
    approveLineDisableFlag() {
      return this.benchmarkData.readonly ||
                      Boolean(!this.benchmarkData.reviewedFlag) ||
                      !this.benchmarkPriceFlag;
    },
    // 头信息
    getHeaderInfoColums() {
      const columnsReview = [
        {
          fieldName: "项目名称",
          fieldCode: "rfxTitle",
          langCode: "ssrc.inquiryHall.model.rfxTitle",
          render: (val, record) => {
            return (
              <SrmListHeader>
                <span>{val}</span>
                <div
                  slot="right"
                >
                  <div class="attachment-upload">
                    <SrmUpload desc-title={this.$T("ssrc.inquiryHall.model.inquiryHall.attachment").$D(
                      "附件"
                    )} attachment-uuid={record.attachmentUuid} />
                  </div>
                </div>
              </SrmListHeader>
            );
          },
          formRow: 0,
        },
        {
          fieldName: "发起人",
          fieldCode: "createdByName",
          langCode: "ssrc.inquiryHall.model.initiator",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: "发起总额(元)",
          fieldCode: "benchmarkPrice",
          langCode: "ssrc.inquiryHall.model.initiatorTotal",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
          formRow: 10,
          formCol: 20,
        },
        {
          fieldName: "发起备注",
          fieldCode: "remark",
          langCode: "ssrc.inquiryHall.model.initiatorRemark",
          render: (val) => {
            return val ? val : "-";
          },
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: "审核总额(元)",
          fieldCode: "reviewedPrice",
          fieldType: "INPUT_NUMBER",
          langCode: "ssrc.inquiryHall.model.reviewedTotal",
          visible: () => {
            const { reviewedBy, approvedBy, benchmarkStatus, reviewedFlag } =
              this.benchmarkData;
            const reviewVisible =
              reviewedBy &&
                (!approvedBy ||
                  approvedBy &&
                    benchmarkStatus === "DEFEND" &&
                    !reviewedFlag) ||
              benchmarkStatus === "INSTANCE" ||
              benchmarkStatus === "REVIEWED";
            this.reviewVisible = reviewVisible;
            return reviewVisible;
          },
          disabled: () => {
            const { readonly, reviewedBy, benchmarkStatus, reviewedFlag } =
              this.benchmarkData;
            const reviewDisable =
              readonly ||
              !reviewedBy ||
              benchmarkStatus !== "DEFEND" ||
              reviewedFlag ||
              this.benchmarkPriceFlag;
            this.reviewDisable = reviewDisable;
            return reviewDisable;
          },
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
          formRow: 30,
        },
        {
          fieldName: "审核备注",
          fieldCode: "approveRemark",
          fieldType: "INPUT",
          langCode: "hipspfm.workFlow.model.approveRemark",
          visible: () => {
            const { reviewedBy, approvedBy, benchmarkStatus, reviewedFlag } =
              this.benchmarkData;
            const reviewVisible =
              reviewedBy &&
                (!approvedBy ||
                  approvedBy &&
                    benchmarkStatus === "DEFEND" &&
                    !reviewedFlag) ||
              benchmarkStatus === "INSTANCE" ||
              benchmarkStatus === "REVIEWED";
            return reviewVisible;
          },
          // eslint-disable-next-line no-unused-vars
          disabled: (val, record) => {
            return (
              this.benchmarkData.readonly || record.benchmarkStatus !== "DEFEND"
            );
          },
          render: (val) => {
            return val ? val : "-";
          },
        },
        {
          fieldName: "审批总额(元)",
          fieldCode: "approvedPrice",
          fieldType: "INPUT_NUMBER",
          langCode: "ssrc.inquiryHall.model.approvedTotal",
          visible: () => {
            const { reviewedFlag } = this.benchmarkData;
            const approveVisible = reviewedFlag;
            this.approveVisible = Boolean(approveVisible);
            return !this.benchmarkData.readonly && Boolean(approveVisible);
          },
          disabled: () => {
            const { readonly, reviewedFlag } = this.benchmarkData;
            const approveDisable =
              readonly || !reviewedFlag || this.benchmarkPriceFlag;
            this.approveDisable = approveDisable;
            return approveDisable;
          },
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
        },
      ];
      const columnsApprove = [
        {
          fieldName: "项目名称",
          fieldCode: "rfxTitle",
          langCode: "ssrc.inquiryHall.model.rfxTitle",
          render: (val, record) => {
            return (
              <SrmListHeader>
                <span>{val}</span>
                <div
                  slot="right"
                >
                  <div class="attachment-upload">
                    <SrmUpload desc-title={this.$T("ssrc.inquiryHall.model.inquiryHall.attachment").$D(
                      "附件"
                    )} attachment-uuid={record.attachmentUuid} />
                  </div>
                </div>
              </SrmListHeader>
            );
          },
          formRow: 0,
        },
        {
          fieldName: "发起人",
          fieldCode: "createdByName",
          langCode: "ssrc.inquiryHall.model.initiator",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: "审核人",
          fieldCode: "reviewedByName",
          langCode: "ssrc.inquiryHall.model.reviewer",
          visible: this.headerInfo.benchmarkStatus === "INSTANCE",
          formRow: 10,
          formCol: 20,
        },
        {
          fieldName: "发起总额(元)",
          fieldCode: "benchmarkPrice",
          langCode: "ssrc.inquiryHall.model.initiatorTotal",
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: "发起备注",
          fieldCode: "remark",
          langCode: "ssrc.inquiryHall.model.initiatorRemark",
          render: (val) => {
            return val ? val : "-";
          },
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: "审核总额(元)",
          fieldCode: "reviewedPrice",
          fieldType: "INPUT_NUMBER",
          langCode: "ssrc.inquiryHall.model.reviewedTotal",
          visible: () => {
            const { reviewedBy, approvedBy, benchmarkStatus, reviewedFlag } =
              this.benchmarkData;
            const reviewVisible =
              reviewedBy &&
                (!approvedBy ||
                  approvedBy &&
                    benchmarkStatus === "DEFEND" &&
                    !reviewedFlag) ||
              benchmarkStatus === "INSTANCE" ||
              benchmarkStatus === "REVIEWED";
            this.reviewVisible = reviewVisible;
            return reviewVisible;
          },
          disabled: () => {
            const { readonly, reviewedBy, benchmarkStatus, reviewedFlag } =
              this.benchmarkData;
            const reviewDisable =
              readonly ||
              !reviewedBy ||
              benchmarkStatus !== "DEFEND" ||
              reviewedFlag ||
              this.benchmarkPriceFlag;
            this.reviewDisable = reviewDisable;
            return reviewDisable;
          },
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: "审核备注",
          fieldCode: "approveRemark",
          fieldType: "INPUT",
          langCode: "hipspfm.workFlow.model.approveRemark",
          visible: () => {
            const { reviewedBy, approvedBy, benchmarkStatus, reviewedFlag } =
              this.benchmarkData;
            const reviewVisible =
              reviewedBy &&
                (!approvedBy ||
                  approvedBy &&
                    benchmarkStatus === "DEFEND" &&
                    !reviewedFlag) ||
              benchmarkStatus === "INSTANCE" ||
              benchmarkStatus === "REVIEWED";
            return reviewVisible;
          },
          // eslint-disable-next-line no-unused-vars
          disabled: (val, record) => {
            return (
              this.benchmarkData.readonly || record.benchmarkStatus !== "DEFEND"
            );
          },
          render: (val) => {
            return val ? val : "-";
          },
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: "审批总额(元)",
          fieldCode: "approvedPrice",
          fieldType: "INPUT_NUMBER",
          langCode: "ssrc.inquiryHall.model.approvedTotal",
          visible: () => {
            const { reviewedFlag } = this.benchmarkData;
            const approveVisible = reviewedFlag;
            this.approveVisible = Boolean(approveVisible);
            return !this.benchmarkData.readonly && Boolean(approveVisible);
          },
          disabled: () => {
            const { readonly, reviewedFlag } = this.benchmarkData;
            const approveDisable =
              readonly || !reviewedFlag || this.benchmarkPriceFlag;
            this.approveDisable = approveDisable;
            return approveDisable;
          },
          render: (val) => {
            // eslint-disable-next-line new-cap
            return this.$options.filters.thousandBitSeparator(val);
          },
        },
      ];
      if (this.headerInfo.benchmarkStatus !== "INSTANCE") {
        return columnsReview;
      }
      return columnsApprove;
    },
  },
  async mounted() {
    this.benchmarkData = this.$route.query.benchmarkData;
    await this.getBasicPriceDetail();
    await this.getBasicPriceHeaderDetail();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.back();
    },
    // 退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 保存
    save() {
      // 校验数据是否必填
      if (this.validate()) {
        this.$notification.open({
          message: this.validate(),
          description: "",
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 2,
        });
        return;
      }
      const params = {
        benchmark: this.headerInfo,
        benchmarkLineList: this.list,
      };
      saveBasicPriceApi(params, this.benchmarkData.benchmarkId).then((res) => {
        if (res.failed && res.message) {
          this.$notification.open({
            message: res.message,
            duration: 1500,
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.saveSuccess").$D(
              "保存成功"
            ),
            duration: 1000,
          });
        }
        this.getBasicPriceHeaderDetail();
        this.getBasicPriceDetail();
      });
    },
    // 提交
    submit() {
    // 校验数据是否必填
      if (this.validate()) {
        this.$notification.open({
          message: this.validate(),
          description: "",
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 2,
        });
        return;
      }
      const params = {
        benchmark: this.headerInfo,
        benchmarkLineList: this.list,
      };
      submitBasicPriceApi(params, this.benchmarkData.benchmarkId).then(
        (res) => {
          if (res.failed && res.message) {
            this.$notification.open({
              message: res.message,
              duration: 1500,
            });
            this.getBasicPriceHeaderDetail();
            this.getBasicPriceDetail();
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.createDelivery.view.message.submitSuccessed"
              ).$D("提交成功"),
              duration: 1000,
            });
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }
      );
    },
    // 校验数据是否必填
    validate() {
      const validateLineApprove = this.list.find((v)=>!v.approvedPrice);
      const validateLineReview = this.list.find((v)=>!v.reviewedPrice);
      if (this.reviewVisible && !this.reviewDisable && !this.headerInfo.reviewedPrice) {
        return this.$T("ssrc.inquiryHall.view.message.headReviewedRequred").$D("头上审核金额必填");
      }
      if (this.approveVisible && !this.approveDisable && !this.headerInfo.approvedPrice) {
        return this.$T("ssrc.inquiryHall.view.message.headApprovedRequred").$D("头上审批金额必填");
      }
      if (!this.reviewLineDisableFlag && validateLineReview) {
        return this.$T("ssrc.inquiryHall.view.message.lineReviewedRequred").$D("行上审核金额必填");
      }
      if (this.benchmarkData.reviewedFlag && !this.approveLineDisableFlag && validateLineApprove) {
        return this.$T("ssrc.inquiryHall.view.message.lineApprovedRequred").$D("行上审批金额必填");
      }
    },
    // 下拉刷新
    async loadRefresh() {
      this.getBasicPriceHeaderDetail();
      await this.getBasicPriceDetail();
    },
    // 上拉加载
    loadMore() {
      if (this.list.length < this.totalCount) {
        this.getBasicPriceHeaderDetail();
        this.getBasicPriceDetail(true);
      }
    },
    // 查询数据
    getBasicPriceDetail(more) {
      this.$loading.show();
      getBasicPriceDetailApi(
        { page: this.page, size: this.size, reviewedFlag: 1, allowEdit: true },
        this.benchmarkData.benchmarkId
      )
        .then((res) => {
          if (res && res.length > 0) {
            if (more) {
              this.list = [ ...this.list, ...res ];
            } else {
              this.list = [ ...res ];
            }
          }
          this.totalCount = res.totalElements;
          this.$loading.hide();
        })
        .catch(() => {
          this.$loading.hide();
        });
    },
    //获取基准价头信息
    getBasicPriceHeaderDetail() {
      const { rfxHeaderId, benchmarkId } = this.benchmarkData;
      getBasicPriceHeaderDetailApi(rfxHeaderId, benchmarkId).then((res) => {
        this.headerInfo = res;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.colorPrimary {
  color: var(--color-other-default-b) !important;
}

.header-card {
  box-sizing: border-box;
  padding: 16px 15px 16px 15px;
}

>>> .srm-scroll {
  height: calc(100vh - 100px) !important;
}

>>> .srm-list-item-card-head-left {
  font-weight: normal !important;
}
>>> .srm-upload{
  padding:0 !important;
}
>>> .srm-upload-icon{
  font-size:16px !important;
  color: #276ef1 !important;
}
>>> .srm-upload-title,>>>.srm-upload-count{
  font-size:12px !important;
  color: #276ef1 !important;
}
.attachment-upload {
  width: 80px;
  height: 20px;
  background: #EFF3FE;
  border-radius: 10px;
  color: #276EF1;
  text-align: center;
  padding: 0 !important;
  font-size: 12px;
  display: flex !important;
  justify-content: flex-start !important;
  padding-left: 5px !important;
  font-weight: normal;
}

.content {
  // height: calc(100vh - 116px);
  font-family: PingFangSC-Regular;
  font-size: 14px;
  background: var(--color-border-default) !important;

  .scrollWrap {
    height: 100%;
  }

  .card {
    padding: 0px 0px 12px 0px;
    color: #666666;
    background: var(--color-bg-default);
    border-bottom: 8px solid var(--color-border-default);

    div {
      display: flex;
      justify-content: space-between;
      padding: 16px 15px 12px 0;
      align-items: center;

      .block {
        width: 6px;
        height: 14px;
        border-radius: 1px;
        background-color: var(--color-other-default-b);
        margin-right: 8px;
      }

      .code {
        left: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        color: var(--color-font-default);
        width: 80vw;
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    ul {
      padding: 0px 15px 8px 15px;

      li {
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 20px;
        padding-bottom: 8px;
        font-family: 'PingFangSC-Regular';

        span {
          text-align: left;
        }

        p {
          width: 50%;
        }
      }

      li:last-child {
        padding-bottom: 0;
      }
    }

    >>> .srm-field-wrapper-container {
      padding: 0 11px;

      .srm-field-wrapper {
        height: 28px;
      }
    }
  }

  .card:last-child {
    border-bottom: 0;
  }
}

.foot {
  font-family: PingFangSC-Medium;
  background: white;
  color: var(--color-other-default-b);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  height: 72px;
  padding: 0 11px;
  position: absolute;
  width: 100%;
  bottom: 0;

  span {
    border: 1px solid var(--color-other-default-b);
    border-radius: 24px;
    height: 48px;
    line-height: 22px;
    width: 48%;
    font-weight: normal;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span:nth-child(even) {
    background: var(--color-other-default-b);
    color: white;
  }
}
</style>
