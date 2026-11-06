<template>
  <div ref="changeOrder" v-loading="initLoading" class="change-order-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.changeOrder.view.panel.basic').$D('基础信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("scux.changeOrder.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;" @click="showHeaderDetail">
          <srm-form
            :columns="getHeaderColumns"
            :data-set="basicInfoDataSet"
            :data-source="headerInfo"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.changeOrder.view.panel.detail').$D('变更明细')">
        <srm-list
          v-if="LineDataSet"
          :data-set="LineDataSet"
          :columns="lineColumns"
          @itemClick="showLineInfoDetail"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible.sync="headerDetailPopup"
               :show-header="true"
               :rounded="false"
               :title="$T('scux.changeOrder.view.panel.basic').$D('基础信息')"
               height="80%"
               position="right">
      <srm-form
        v-if="basicInfoDataSet"
        :data-set="basicInfoDataSet"
        customize-type="detail"
        :columns="getHeaderColumns"
        customize-code=""/>
    </srm-popup>
    <srm-popup :visible.sync="orderLineDetailPopup"
               :show-header="true"
               :rounded="false"
               :title="$T('scux.changeOrder.view.panel.detail').$D('变更明细')"
               height="100vh"
               position="right">
      <srm-form
        v-if="orderLineDetailDataSet"
        style="padding-bottom: 100px;"
        :data-set="orderLineDetailDataSet"
        customize-type="detail"
        :columns="lineColumns"
        customize-code=""/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { queryHeaderInfo, queryMapIdpValue } from "./api";
import { orderLineDataSet, orderHeaderDataSet, orderLineDetailDataSet } from "./dataSource/detail";

export default {
  modules: [ "scux.changeOrder" ],
  name: "SiShunChangeOrderApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      basicInfoDataSet: null,
      LineDataSet: null,
      orderLineDetailDataSet: null,
      initLoading: false,
      isChangeQuantityOrDate: false,
      orderLineDetailPopup: false,
      headerDetailPopup: false,
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "changeHeaderNum",
        },
        {
          fieldCode: "changeTypeMeaning",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "approveEmployeeName",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldCode: "lineStatusMeaning",
        },
        {
          fieldCode: "displayPoNum",
        },
        {
          fieldCode: "displayLineNum",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "boxGauge",
        },
        {
          fieldCode: "splitTypeMeaning",
        },
        {
          fieldCode: "quantity",
        },
        {
          fieldCode: "supplierNum",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "expDomesticDeliveryDate",
        },
        {
          fieldCode: "freezeFlagMeaning",
        },
        {
          fieldCode: "earlyArrivalFlagMeaning",
        },
        this.isChangeQuantityOrDate && {
          fieldCode: "refusalReason1Meaning",
        },
        this.isChangeQuantityOrDate && {
          fieldCode: "refusalReason2Meaning",
        },
        this.isChangeQuantityOrDate && {
          fieldCode: "refusalRemark",
        },
        {
          fieldCode: "changeReasonMeaning",
        },
        this.isChangeQuantityOrDate && {
          fieldCode: "removedFlagMeaning",
        },
        {
          fieldCode: "lineRemark",
        },
      ];
    },
    getLookupMaps() {
      return {
        refusalReason1Map: this.refusalReason1Map,
        refusalReason2Map: this.refusalReason2Map,
      };
    },
  },
  created() {
    this.fetchLookupData();
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.getHeaderInfo();
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.initLoading = false;
      }
    }
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        refusalReason1Map: "SCUX.SODR.REJECT_REASON_1",
        refusalReason2Map: "SCUX.SODR.REJECT_REASON_2",
      }).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        Object.entries(res).forEach(([ key, data ]) => {
          this[key] = Object.fromEntries(
            data.map(({ value, meaning } = {}) => [ value, meaning ])
          );
        });
      }
    },
    async getHeaderInfo() {
      const params = {
        changeHeaderId: this.changeReqId,
        page: 0,
        size: 10,
      };
      const headerInfoRes = await queryHeaderInfo(params);
      this.headerInfo = headerInfoRes;
      this.isChangeQuantityOrDate = [ "QUANTITY", "DELIVERY_DATE" ].includes(headerInfoRes.changeType);
      this.basicInfoDataSet = new DataSet(orderHeaderDataSet(this.getLookupMaps));
      this.basicInfoDataSet.create(this.headerInfo, 0);
      this.LineDataSet = new DataSet(orderLineDataSet(this.changeReqId, this.getLookupMaps, headerInfoRes?.changeType));
      this.LineDataSet.query();
    },
    showLineInfoDetail(record) {
      this.orderLineDetailDataSet = new DataSet(orderLineDetailDataSet(this.getLookupMaps, this.headerInfo?.changeType));
      this.orderLineDetailDataSet.create(record.data, 0);
      this.orderLineDetailPopup = true;
    },
    showHeaderDetail() {
      this.headerDetailPopup = true;
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>