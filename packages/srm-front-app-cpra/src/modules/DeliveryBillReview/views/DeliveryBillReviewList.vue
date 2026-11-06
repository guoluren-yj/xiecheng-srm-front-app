<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.DELIVERY_BILL_REVIEW.LIST"
              :columns="getColumns()"
              :buttons="getButtons()"
              @itemClick="toDetail">
      <srm-flex slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="scanCode">
          <em class="srm-icon icon-scan"/>
        </srm-button>
      </srm-flex>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import indexDS from "../datasource/indexDS";
import scanCode from "@/mixin/scanCode";
import { adoptApi, rejectApi } from "../api/index";
import SrmAppCore from "srm-front-app-core";

export default {
  modules: [ "hipspfm.common", "hipspfm.deliveryApproved", "sinv.deliveryReview", "sinv.common", "validation.message", "hipspfm.invoiceInspection" ],
  name: "DeliveryBillReviewList",
  mixins: [ scanCode ],
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
    };
  },
  methods: {
    //退出子应用
    goBack() {
      this.$router.back();
    },
    getColumns() {
      return [ {
        formRow: 0,
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <span>{item.asnNum}</span>
        </SrmListHeader>
      }, {
        fieldCode: "supplierCompanyName",
      }, {
        fieldCode: "creationDate",
      }, {
        fieldCode: "organizationName",
      } ];
    },
    //跳转评分详情
    toDetail(item) {
      const { data: { asnHeaderId } } = item;

      this.$router.push({
        name: "DeliveryBillReviewDetail",
        query: { asnHeaderId }
      });
    },
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.common.message.reject").$D("拒绝"),
          type: "warn",
          visible: () => true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList, data, list) => {
            this.clickReject(checkedList, list);
          },
        },
        {
          text: this.$T("hipspfm.common.message.pass").$D("通过"),
          fill: true,
          visible: () => true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList, data, list) => {
            this.clickAdopt(checkedList, list);
          },
        }
      ];
    },
    // 点击通过
    clickAdopt(checkedList, list) {
      const that = this;

      this.$dialog({
        content: this.$T("validation.message.refuseDeliveryBill").$D("是否通过该送货单") + "？",
        closable: false,
        onOk() {
          that.adoptList(checkedList, list);
        }
      });
    },
    //确认通过
    adoptList(checkedList) {
      this.chooseParams = checkedList.map((item) => {
        const { data: { asnHeaderId, objectVersionNumber, _token } } = item;

        return {
          asnHeaderId: asnHeaderId,
          objectVersionNumber: objectVersionNumber,
          _token: _token
        };
      });
      this.$loading.show();
      adoptApi(this.chooseParams).then((res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T(
              "hipspfm.common.view.validation.approvelSuccess"
            ).$D("审批通过成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.dataSet.refresh();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    //点击拒绝
    clickReject(checkedList, list) {
      const that = this;

      this.$dialog({
        content:
          this.$T(
            "hipspfm.deliveryApproved.validation.message.refusesDeliveryBill"
          ).$D("是否拒绝该送货单?"),
        closable: false,
        onOk() {
          that.rejectList(checkedList, list);
        }
      });
    },
    //确认拒绝
    rejectList(checkedList) {
      this.chooseParams = checkedList.map((item) => {
        const { data: { asnHeaderId, objectVersionNumber, _token } } = item;

        return {
          asnHeaderId: asnHeaderId,
          objectVersionNumber: objectVersionNumber,
          _token: _token
        };
      });
      this.$loading.show();
      rejectApi(this.chooseParams).then((res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D(
              "审批拒绝成功"
            ),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.dataSet.refresh();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    scanCode() {
      let that = this;
      SrmAppCore.scanQrCode(function (result) {
        if (result) {
          console.info("扫码结果:", result);
          that.dataSet.setQueryParameter({
            ...that.dataSet.queryParameter,
            "asnNum": result
          });
          that.dataSet.refresh();
        }
      }, function (error) {
        that.$notification.open({
          message: that.$T("hipspfm.invoiceInspection.view.message.scanAbnormal").$D("扫码异常") + (error ? JSON.stringify(error) : ""),
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.round-btn {
  line-height normal;
  pointer-events auto;

  .srm-icon {
    font-size 28px;
  }
}

.round-btn-box {
  background transparent;
  padding-bottom 80px;
  padding-right 15px;
}
</style>
