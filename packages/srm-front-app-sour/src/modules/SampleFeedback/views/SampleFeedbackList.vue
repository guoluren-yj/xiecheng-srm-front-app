<template>
  <div style="height: 100vh">
    <nav-head :title="$T('sslm.sample.view.title.sampleCallback').$D('送样申请反馈')" @goBack="goBack" />
    <srm-list :data-set="dataSet" customize-code="SMBL.SAMPLE_DELIVERY_CALLBACK.TABLE_LIST" :columns="getColumns" @itemClick="goToDetail"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import sampleFeedbackListDS from "../datasource";

export default {
  modules: [ "sslm.sample", "smbl.workFlow" ],
  name: "SampleFeedbackList",
  data() {
    return {
      dataSet: new DataSet(sampleFeedbackListDS()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "reqNum",
          fieldType: "EMPTY",
          render: (val, item) => {
            let clsaaStyle;
            //已退回状态展示绿色
            if (item.reqStatus === "RETURNED") {
              clsaaStyle = "srm-span-right-slot-grey";
              //待反馈状态展示黄色
            } else if (item.reqStatus === "PUBLISHED") {
              clsaaStyle = "srm-span-right-slot-warn";
            } else {
              clsaaStyle = "srm-span-right-slot-grey";
            }
            return <SrmListHeader>
              <span>{item.reqNum}</span>
              <span slot="right" class={ clsaaStyle }>{item.reqStatusMeaning}</span>
            </SrmListHeader>;
          }
        },
        {
          formRow: 20,
          fieldName: this.$T("sslm.sample.model.isPurchaseFlagMeaning").$D("送样发起方"),
          fieldCode: "isPurchaseFlagMeaning",
          fieldType: "TEXT"
        },
        {
          formRow: 30,
          fieldName: this.$T("sslm.sample.model.sample.customer").$D("客户"),
          fieldCode: "companyName",
          fieldType: "TEXT"
        }
      ];
    }
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      this.$router.push({
        name: "SampleFeedbackDetail",
        query: { reqId: data.reqId },
      });
    },
    // 退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.srm-span-right-slot-warn {
  margin-right: 15px;
  color: var(--color-warn);
}

.srm-span-right-slot-grey {
  margin-right: 15px;
  color: var(--font-color-disable);
}
</style>
