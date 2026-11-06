<template>
  <div style="height: 100vh">
    <srm-scroll :scrollable="false" @reachBottom="reachBottom">
      <srm-list
        :data-set="getDataSet"
        :customize-code="getCurrentUnitCode()"
        :columns="getColumns"
        :scrollable="true"
        @itemClick="goToDetail" >
        <srm-flex slot="filter" direction="column" align="start">
          <srm-tab-bar
            :tabs="[
              $T('ssrc.inquiryHall.model.inquiryHall.noParticipation').$D('未参与'),
              $T('ssrc.inquiryHall.button.onGoing').$D('进行中'),
              $T('hzero.common.component.excelExport.hd.m.hd.state.done').$D('已结束'),
              // $T('ssrc.inquiryHall.button.all').$D('全部')
            ]"
            display="justify"
            :active-index="Number(currentTab)"
            @indexChange="onTabIndexChange" />

          <div v-if="currentTab === 0 || currentTab === 1 || currentTab === 2" class="hall-list-second-tab">
            <srm-button :class="['first-button',{'no-active':chooseSecondTabIndex !== 0}]" size="small" type="primary"
                        @click="onSecondTabIndexChange(0)">
              <span v-if="currentTab === 0">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.inviteMe').$D('邀请我的') }}
              </span>
              <span v-if="currentTab === 1">
                {{ $T('ssrc.inquiryHall.model.inquiryHall.needDeal').$D('需要处理') }}
              </span>
              <span v-if="currentTab === 2">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.wonBid').$D('已中标') }}
              </span>
            </srm-button>

            <srm-button :class="[{'no-active':chooseSecondTabIndex !== 1}]" size="small" type="primary" @click="onSecondTabIndexChange(1)">
              <span v-if="currentTab === 0">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.commonOpenInquiry', [bidFlag ?
                  $T("ssrc.common.bid").$D("招标") : $T("ssrc.common.inquiryPrice").$D("询价")]).$D('公开{sourceCategoryName}') }}
              </span>
              <span v-if="currentTab === 1">
                {{ $T('ssrc.inquiryHall.model.inquiryHall.needAttention').$D('需要关注') }}
              </span>
              <span v-if="currentTab === 2">
                {{ $T('ssrc.supplierQuotation.model.supplierQuotation.notWonBid').$D('未中标') }}
              </span>
            </srm-button>

            <srm-button :class="[{'no-active':chooseSecondTabIndex !== 2}]" size="small" type="primary"
                        @click="onSecondTabIndexChange(2)">
              <span v-if="currentTab === 2">
                {{ $T('ssrc.inquiryHall.model.inquiryHall.others').$D('其它') }}
              </span>
            </srm-button>
          </div>
          <srm-blank size="1px" theme="fill"/>
        </srm-flex>
      </srm-list>
    </srm-scroll>

    <srm-popup
      :visible.sync="sourceDetailVisible"
      position="bottom"
      :title="!bidFlag ? $T('ssrc.supplierQuotation.view.message.rfxMatterDetailInstructions').$D('寻源事项说明') : $T('ssrc.supplierQuotation.view.message.bidMatterDetail').$D('招标事项说明')"
      height="55vh" >
      <div class="ssrc-rfx-detail-content-wrap">
        <div class="ssrc-rfx-detail-content">
          {{ currentLineData.newMatterDetail || "" }}
        </div>
        <div class="source-detail-popup-modal-footer-wrap">
          <div style="margin-top: 8px; margin-left: 16px; padding-top: 8px;">
            <srm-checkbox-group v-model="sourceDetailCheckBoxValue" :selection="1" content-selectable @change="sourceDetailCheckboxChange">
              <srm-checkbox
                position="left"
                option="1">
                <span style="margin-left: 8px;">
                  {{ !bidFlag ?
                    $T("ssrc.supplierQuotation.view.message.agreedOfRfx").$D("我已阅读并同意寻源事项说明") :
                    $T("ssrc.supplierQuotation.view.message.agreedOfBid").$D("我已阅读并同意招标事项说明")
                  }}
                </span>
              </srm-checkbox>
            </srm-checkbox-group>
          </div>
          <div class="ssrc-apply-button-list-wrap">
            <srm-button style="margin-right: 12px;" class="ssrc-reply-list-source-matter-modal-button" @click="clearSourceDetail">
              {{ $T("hipspfm.common.button.cancle").$D("取消") }}
            </srm-button>
            <srm-button :disabled="sourceDetailNextDisabledFlag" fill class="ssrc-reply-list-source-matter-modal-button" @click="sourceDetailNextStep">
              {{ $T("ssrc.supplierQuotation.view.button.nextStep").$D("下一步") }}
            </srm-button>
          </div>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>

import { isEmpty, isArray, } from "lodash";
import { DataSet, SrmUtil, } from "srm-mobile-ui";

import { getBiddingSignMessage } from "../utils/commonString";

import { allDS } from "../datasource/allDS";
import { inviteDS, openBiddingDS, } from "../datasource/unParticipationDS";
import { processingDS, attentionDS, } from "../datasource/onGoingDS";
import { bidded, unBidding, finOthersDS, } from "../datasource/finishedDS";

import IndexColumns from "../mixins/IndexColumns";

import {
  saveConfirmMatter,
  fetchConfigSheet,
  quotationInsertExpens,
  fetchNewQuotationConfigSheet,
  supplierBiddingHallSignIn,
} from "../api";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.queryRfq", "smbl.common", "ssrc.bidHall", "ssrc.supQuoSumQuery", "ssrc.common", "smbl.inquiryHall", "hipspfm.common", "ssrc.supplierQuotation", "hzero.common", "ssrc.biddingHall", ],
  name: "HallList",
  components: {},
  mixins: [ IndexColumns ],
  props:{
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      organizationId: SrmUtil.getOrganizationId(),
      currentTab: 0,
      chooseSecondTabIndex: 0,
      implementationType:"",
      implementationValue:"",
      fieldSource:"",
      allDataSet: new DataSet(allDS(this.documentType)), // 全部
      inviteDateSet: new DataSet(inviteDS(this.documentType)), // 未参与-邀请我的
      openBiddingDateSet: new DataSet(openBiddingDS(this.documentType)), // // 未参与-公开招标
      processingDataSet: new DataSet(processingDS(this.documentType)), // 进行中- 需要处理
      attentionDataSet: new DataSet(attentionDS(this.documentType)), // 进行中 - 需要关注
      finSuccessDataSet: new DataSet(bidded(this.documentType)), // 完成- 招标成功
      finFailedDataSet: new DataSet(unBidding(this.documentType)), // 完成-未中标
      finOthersDataSet: new DataSet(finOthersDS(this.documentType)), // 完成-其它
      bidFlag: this.documentType === "BID",
      sourceDetailCheckBoxValue: [],
      sourceDetailVisible: false, // pop-up visible
      sourceDetailNextDisabledFlag: this.sourceDetailCheckBoxValue?.[0] !== "1",
      currentLineData: {},
      serviceChargeFlag: false,
      newQuotationFlag: false,
    };
  },
  computed:{
    getDataSet() {
      if (this.currentTab === 0) {
        if (this.chooseSecondTabIndex === 0) {
          return this.inviteDateSet;
        }
        if (this.chooseSecondTabIndex === 1) {
          return this.openBiddingDateSet;
        }
      } else if (this.currentTab === 1) {
        if (this.chooseSecondTabIndex === 0) {
          return this.processingDataSet;
        } else if (this.chooseSecondTabIndex === 1) {
          return this.attentionDataSet;
        }
      } else if (this.currentTab === 2) {
        if (this.chooseSecondTabIndex === 0) {
          return this.finSuccessDataSet;
        } else if (this.chooseSecondTabIndex === 1) {
          return this.finFailedDataSet;
        } else if (this.chooseSecondTabIndex === 2) {
          return this.finOthersDataSet;
        }
      } else if (this.currentTab === 3) {
        return this.allDataSet;
      }
      return null;
    },
    //获取列表字段
    getColumns() {
      if (this.documentType === "RFX") {
        return this.getRfxColumns();
      } else if (this.documentType === "BID") {
        return this.getRfxColumns();
      }
      return null;
    },
  },
  activated() {
    const { tabName, } = this.$route?.params || {};
    let defaultTabIndex = 0;
    if (tabName === "onGoing") {
      defaultTabIndex = 1;
      this.onTabIndexChange(defaultTabIndex);
      return;
    }

    this.getDataSet.refresh();
  },
  mounted() {
    const { tabName, } = this.$route?.params || {};

    let defaultTabIndex = 0;
    if (tabName === "onGoing") {
      defaultTabIndex = 1;
    }

    this.onTabIndexChange(defaultTabIndex);
    this.fetchServiceChargeConfig();
  },
  deactivated() {
    clearTimeout(this.timer);
  },
  methods: {
    async fetchNewQuotation(data) {
      let newQuotationFlag = false;
      const {
        rfxHeaderId,
      } = data || {};
      if (!rfxHeaderId) {
        return;
      }

      const param = {
        organizationId: this.organizationId,
        rfxHeaderId,
      };

      let result = await fetchNewQuotationConfigSheet(param);
      if (result !== 1 && result !== 0) {
        return "-1";
      }

      if (result === 1) {
        newQuotationFlag = true;
      }
      return newQuotationFlag;
    },
    reachBottom() {
      if (!this.getDataSet) {
        return;
      }

      this.getDataSet.loadMore();
    },
    // 查询配置表--是否展示标书下载节点
    async fetchServiceChargeConfig() {
      let data = null;

      data = await fetchConfigSheet({
        organizationId: this.organizationId,
        configCode: "ssrc_expenses_online_payment_blacklist",
        data: {
          tenantNum: SrmUtil.getUserInfo().tenantNum,
        },
      });
      if (data && data.failed) {
        return;
      }
      if (!(!isEmpty(data) && isArray(data) && data[0].id)) {
        this.serviceChargeFlag = true;
      }
    },
    sourceDetailCheckboxChange(value) {
      const sourceDetailNextDisabledFlag = value?.[0] !== "1";
      this.sourceDetailNextDisabledFlag = sourceDetailNextDisabledFlag;

      this.sourceDetailCheckBoxValue = value;
      this.$forceUpdate();
    },
    refreshCurrentTable() {
      this.getDataSet.refresh();
    },
    clearSourceDetail() {
      this.sourceDetailVisible = false;
      this.sourceDetailCheckBoxValue = [];
      this.sourceDetailNextDisabledFlag = true;
      this.currentLineData = {};
    },
    async sourceDetailNextStep() {
      this.sourceDetailVisible = false;

      const {
        tenantId,
        rfxHeaderId,
        supplierCompanyId,
      } = this.currentLineData || {};

      if (!tenantId || !rfxHeaderId || !supplierCompanyId) {
        return;
      }

      const data = {
        tenantId,
        rfxHeaderId,
        supplierCompanyId,
        organizationId: this.organizationId,
      };

      let result = null;
      result = await saveConfirmMatter(data);
      if (result && result.failed) {
        return;
      }

      this.timer = setTimeout(() => {
        this.onParticipate();
      }, 350);
    },
    // 报价查询
    onQuotationQueryDirect(item) {
      const {
        rfxHeaderId,
        quotationHeaderId,
        quotationHeaderRecordId,
      } = item || {};

      if (!rfxHeaderId || !quotationHeaderId) {
        return;
      }

      let nextPageName = "QueryQuotation";
      if (this.bidFlag) {
        nextPageName = "QueryBidding";
      }

      this.$router.push({
        name: nextPageName,
        query: {
          rfxHeaderId,
          quotationHeaderId,
          quotationHeaderRecordId,
          documentType: this.documentType,
          // pageType: "QUOTATION_QUERY",
        },
      });
    },
    // bidding hall
    async biddingHallOperation(item) {
      const { rfxLineSupplierId, rfxHeaderId } = item || {};

      const disabledBiddingHall = this.disabledToBiddingHall(item);
      if (disabledBiddingHall) {
        return;
      }

      if (!rfxHeaderId || !rfxLineSupplierId) {
        return;
      }

      const data = {
        querys: {
          customizeUnitCode: this.getCurrentUnitCode(),
        },
        organizationId: this.organizationId,
        rfxLineSupplierId,
        rfxHeaderId,
      };

      let result = await supplierBiddingHallSignIn(data);
      if (result && result.failed) {
        this.notificationError(result);
        return;
      }
      if (!result || isEmpty(result)) {
        return;
      }

      this.afterSignInOrValidation(result);
    },
    // bidding sign in operate
    afterSignInOrValidation(result = {}) {
      const {
        biddingSignInFlag,
        supplierNumberPlate, // 号牌
      } = result || {};

      if (!biddingSignInFlag && !supplierNumberPlate) {
        this.directionToBiddingHall(result); // 无签到，无号牌，直接进入
        return;
      }

      const message = getBiddingSignMessage({ result });

      this.$dialog({
        title: this.$T("ssrc.biddingHall.view.modal.title.confirmEnterBiddingPlace").$D("确认进入竞价现场"),
        content: message,
        onOk: () => this.delayDirectionToBiddingHall(result),
        onCancel: this.refreshCurrentTable,
      });
    },
    delayDirectionToBiddingHall(data = {}) {
      this.timer = setTimeout(() => {
        this.directionToBiddingHall(data);
      }, 400);
    },
    directionToBiddingHall(data = {}) {
      const { rfxLineSupplierId, biddingTarget } = data || {};

      if (!rfxLineSupplierId || !biddingTarget) {
        return;
      }

      this.$router.push({
        name: "BiddingHallSupplier",
        query: {
          rfxLineSupplierId,
          biddingTarget,
        },
      });
    },
    disabledToBiddingHall(item = {}) {
      const {
        biddingTarget,
        biddingUnitPriceRule,
        quotationOrderType,
      } = item || {};

      const disabled = biddingTarget === 'UNIT_PRICE' &&
          biddingUnitPriceRule === 'WHOLE_BATCH' &&
          quotationOrderType === 'PARALLEL';

      return !disabled;
    },
    // 报价
    async onQuotationDirect(item, operation) {
      const {
        quotationHeaderId,
        rfxHeaderId,
        supplierCompanyId,
        supplierTenantId,
        prequalLineStatus, // 预审申请未提交，不可报价
        bidBondFlag, // 失败原因是未缴纳保证金费
      } = item || {};

      if (operation === "QUOTATION") {
        if (prequalLineStatus === "NEW") {
          this.$notification.open({
            duration: 1000,
            message: this.$T("ssrc.supplierQuotation.view.message.notSubmitPre").$D("预审申请未提交，不可报价"),
          });
          return;
        }

        if (bidBondFlag) {
          const message = this.serviceChargeFlag ?
            this.$T("ssrc.common.view.errorOperateForQuotationBidFilePleaseConcatUsers").$D("报价失败，失败原因是未缴纳保证金费，请及时缴纳。若已缴纳，请联系采购方人员及时确认") :
            this.$T("ssrc.common.view.errorOperateForQuotationBidFilePleaseConcat").$D("操作失败，失败原因是未缴纳保证金，请缴纳后联系采购方修改缴纳状态");
          this.$notification.open({
            duration: 1000,
            message,
          });
          return;
        }
      }

      if (!quotationHeaderId) {
        return;
      }

      const newQuotationFlag = await this.fetchNewQuotation(this.currentLineData);
      if (newQuotationFlag === "-1") {
        return;
      }

      if (newQuotationFlag === true && this.serviceChargeFlag === true) {
        const params = {
          organizationId: this.organizationId,
          data: [
            {
              sourceId: rfxHeaderId,
              expensesType: "DEPOSIT",
              supplierTenantId,
              supplierCompanyId,
              sourceMobileEndFlag: 1,
            },
          ],
        };
        const fileResult = await quotationInsertExpens(params);
        if (fileResult && fileResult.failed) {
          return;
        }
        this.directionQuotationPage(item);
      } else {
        this.directionQuotationPage(item);
      }
    },
    directionQuotationPage(item) {
      const {
        quotationHeaderId,
        roundFlag,
      } = item || {};
      if (!quotationHeaderId) {
        return;
      }

      let nextPageName = "QuotationApply";
      if (this.bidFlag) {
        nextPageName = "QuotationBidding";
      }

      this.$router.push({
        name: nextPageName,
        query: {
          quotationHeaderId,
          documentType: this.documentType,
          roundFlag, // 可能不会使用
          pageType: "QUOTATION", // 预留
        },
      });
    },
    // 参与
    async onParticipate() {
      const {
        rfxHeaderId,
        supplierCompanyId,
        supplierTenantId,
      } = this.currentLineData || {};

      const newQuotationFlag = await this.fetchNewQuotation(this.currentLineData);
      if (newQuotationFlag === "-1") {
        return;
      }

      const params = {
        organizationId: this.organizationId,
        data: [
          {
            sourceId: rfxHeaderId,
            expensesType: "TENDER_FEE",
            supplierTenantId,
            supplierCompanyId,
            sourceMobileEndFlag: 1,
          },
        ],
      };

      if (this.serviceChargeFlag === true) {
        quotationInsertExpens(params).then((res) => {
          if (res && res.failed) {
            return;
          }
          this.directionToParticipate();
        });
      } else {
        this.directionToParticipate();
      }
    },
    directionToParticipate(otherParams) {
      const {
        rfxHeaderId,
        supplierCompanyId,
        supplierTenantId,
      } = this.currentLineData || {};
      if (!rfxHeaderId || !supplierCompanyId) {
        return;
      }

      let nextPageName = "DetailApply";
      if (this.bidFlag) {
        nextPageName = "DetailBidding";
      }

      this.$router.push({
        name: nextPageName,
        query: {
          rfxHeaderId,
          supplierCompanyId,
          supplierTenantId,
          documentType: this.documentType,
          pageType: "PARTICIPATE",
          ...otherParams || {},
        },
      });
      this.clearSourceDetail();
    },
    onBeforeParticipate(item) {
      const { showMatterFlag, matterDetail, } = item || {};

      this.currentLineData = item || {};

      if (showMatterFlag) {
        if (matterDetail) {
          this.currentLineData.newMatterDetail = matterDetail.replace(/<[^>]+>/g, "");
        }

        this.sourceDetailVisible = true;
      } else {
        this.onParticipate();
      }
    },
    // 一级tab切换
    onTabIndexChange(index) {
      this.chooseSecondTabIndex = 0;
      this.currentTab = index;
      this.getDataSet.refresh();
    },
    // 二级tab切换
    onSecondTabIndexChange(index) {
      this.chooseSecondTabIndex = index;
      this.getDataSet.refresh();
    },
    // 明细
    goToDetail(item) {
      const { data } = item;
      const { supplierCompanyId, rfxHeaderId, supplierTenantId, } = data || {};
      if (!supplierCompanyId || !rfxHeaderId) {
        return;
      }

      let nextPageName = "DetailApply";
      if (this.bidFlag) {
        nextPageName = "DetailBidding";
      }

      this.$router.push({
        name: nextPageName,
        query: {
          rfxHeaderId,
          supplierCompanyId,
          supplierTenantId,
          pageType: "DETAIL",
          documentType: this.documentType,
        },
      });
    },
    getUnitCodePrefix() {
      let prefix = "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY";

      if (this.bidFlag) {
        prefix = "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID";
      }

      return prefix;
    },
    // 获取当前组编码 个性化只配置了筛选器，其它的没有
    getCurrentUnitCode() {
      let currentCode = "";

      const codePrefix = this.getUnitCodePrefix();

      if (this.currentTab === 0) {
        if (this.chooseSecondTabIndex === 0) {
          currentCode = `${codePrefix}.UNRELEASED`;
        }
        if (this.chooseSecondTabIndex === 1) {
          currentCode = `${codePrefix}.OPENED`;
        }
      } else if (this.currentTab === 1) {
        if (this.chooseSecondTabIndex === 0) {
          currentCode = `${codePrefix}.LIST_HANDLE`;
        }
        if (this.chooseSecondTabIndex === 1) {
          currentCode = `${codePrefix}.LIST_ATTENTION`;
        }
      } else if (this.currentTab === 2) {
        if (this.chooseSecondTabIndex === 0) {
          currentCode = `${codePrefix}.LIST_SUGGEST`;
        }
        if (this.chooseSecondTabIndex === 1) {
          currentCode = `${codePrefix}.LIST_SUGGEST_FAILED`;
        }
        if (this.chooseSecondTabIndex === 2) {
          currentCode = `${codePrefix}.LIST_OTHERS`;
        }
      } else if (this.currentTab === 3) {
        currentCode = `${codePrefix}.LIST_ALL`;
      }

      return currentCode;
    },
    notificationError(result) {
      this.$notification.open({
        message: result?.message,
        description: "",
        class: "notification"
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

.hall-list-second-tab {
  width 375px;
  height 40px;

  .first-button {
    margin-top 8px;
    margin-left 15px;
    margin-right 8px;
  }

  .second-button {
    margin-top 8px;

  }

  .no-active {
    background white;
    color #333333;
  }
}

.ssrc-rfx-detail-content-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
}

.ssrc-rfx-supplier-apply-list-title {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}

.ssrc-rfx-supplier-apply-list-header {
  max-width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.ssrc-apply-list-columns-status-wrap {
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.ssrc-rfx-detail-content {
  max-height: 210px;
  min-height: 150px;
  overflow-y: auto;
  padding: 12px;
}

.source-detail-popup-modal-footer-wrap {
  height: 120px;
  border-top: 1px solid #F6F6F6;
  margin-top: 8px;
}

.ssrc-apply-button-list-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-item: center;

  .ssrc-reply-list-source-matter-modal-button {
    border-radius: 24px;
    width: 40%;
    height: 48px;
  }
}

</style>

