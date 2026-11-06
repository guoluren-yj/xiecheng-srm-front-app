<template>
  <div class="time-adjust-content">
    <srm-form customize-type="detail" :data-set="formDs" :columns="columns" />
    <div class="button-container">
      <srm-button bordered size="x-large" type="danger" class="cancel-button" @click="$emit('close')">
        {{ $T("hzero.common.button.cancel").$D("取消") }}
      </srm-button>
      <srm-button fill size="x-large" class="confirm-button" @click="onOk">
        {{ $T("hzero.common.button.confirm").$D("确认") }}
      </srm-button>
    </div>
  </div>
</template>

<script>
import { isNil } from "lodash";
import { DataSet } from "srm-mobile-ui";
import { adjustTime } from "../api";
import { emptyFormDS } from "../datasource/detailDS";
import moment from "moment";
export default {
  modules: [ "sqam.common", "entity.roles", "hzero.common", "entity.company", "entity.business", "entity.organization", "entity.supplier", "entity.item", "sodr.sendOrder", "entity.order", "sodr.common", "sqam.quoteIncomingInspection", "sslm.siteInvestigateReport", "sslm.purchaserEvaluation", "sslm.purchaserEvaluationDetail", "sslm.evaluationQuery", "hipspfm.common", "smbl.common" ],
  name: "TimeAdjustContent",
  props: {
    headerDs: {
      type: Object,
      required: true,
      default: () => {}
    },
  },
  data() {
    return {
      formDs: new DataSet(emptyFormDS()),
    };
  },
  computed: {
    columns() {
      const problemStatus = this.headerDs.current?.get("problemStatus");
      return [
        {
          fieldCode: "icaDemandDate",
          fieldType: "DATE_PICKER",
          fieldName: this.$T("sqam.common.model.timeAdjustment.icaDemandDate").$D("ICA要求时间"),
          timePicker: true,
          required: [ "PUBLISHED" ].includes(problemStatus),
          disabled: ![ "PUBLISHED" ].includes(problemStatus)
        },
        {
          fieldCode: "pcaDemandDate",
          fieldType: "DATE_PICKER",
          fieldName: this.$T("sqam.common.model.timeAdjustment.pcaDemandDate").$D("PCA要求日期"),
          required: true,
          errorMessage: this.$T("sqam.common.view.message.pcaDemandDateCannotBeforeIca").$D("PCA要求日期不能早于ICA要求日期"),
          validator: (val, record) => moment(record.get("icaDemandDate")).isBefore(val, "second"),
          options: {
            format: "YYYY-MM-DD",
            valueFormat: "YYYY-MM-DD HH:mm:ss"
          }
        },
        {
          fieldCode: "adjustmentRemark",
          fieldType: "TEXT_AREA",
          fieldName: this.$T("sqam.common.model.timeAdjustment.adjustmentRemark").$D("调整说明"),
          required: true,
        }
      ];
    }
  },
  created() {
    // toData获取的是引用，所以这里需要复制一份
    const copyData = Object.assign({}, this.headerDs?.current?.toData() || {});
    this.formDs.create(copyData);
  },
  methods: {
    async onOk() {
      const validateRes = await this.formDs.validate();
      if (!validateRes) {
        return;
      }
      this.$loading.show();
      const res = await adjustTime(this.formDs.current.toData()).catch((err) => {
        throw err;
      }).finally(() => {
        this.$loading.hide();
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        this.$emit("close", true);
      } else {
        this.$notification.open({ message: res.message });
      }
    }
  },
};
</script>

<style lang="stylus">
.time-adjust-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .button-container {
    padding: 12px 15px;

    .cancel-button {
      width: calc(50% - 6px);
      margin-right: 12px;
    }

    .confirm-button {
      width: calc(50% - 6px);
    }
  }
}
</style>