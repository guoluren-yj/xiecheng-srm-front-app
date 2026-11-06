<template>
  <srm-popup :visible.sync="popFlag" width="100%" height="100%" :title="$T('sslm.siteInvestigateReport.modal.mange.maintainScoreInfo').$D('编辑评分人信息')">
    <srm-list v-if="dataSet" :data-set="dataSet" :columns="getColumns" />
    <srm-bottom-handler v-if="editable" :btn-arr="bottomButtons"/>
  </srm-popup>
</template>

<script>
import { scorerMaintainDS } from "../datasource/ScorerMaintainDS";
import { saveScorerApi } from "../api/index";
import { DataSet, SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common", "sslm.commonApplication" ],
  name: "ScorerMaintainView",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    targetLineId: null,
    infoIds: {
      type: Array,
      default: null,
    },
    evalHeaderId: null,
    editable: false,
  },
  data() {
    return {
      dataSet: null,
      popFlag: false,
    };
  },
  computed: {
    getColumns() {
      let colunms = [ {
        fieldCode: "respUserId",
      }, {
        fieldCode: "realName",
      }, {
        fieldCode: "respWeight",
      }, ];
      if (this.editable) {
        colunms.push({
          fieldCode: "delete",
          fieldType: "EMPTY",
          render: (val, item, v, record) => <srm-flex justify="end" style="padding: 0px 15px;">
            <srm-button size="mid" bordered type="danger" onClick={() => {
              this.deleteItem(record);
            }}>{this.$T("smbl.common.button.delete").$D("删除")}</srm-button>
          </srm-flex>,
        });
      }
      return colunms;
    },
    bottomButtons() {
      return [
        {
          title: this.$T("smbl.common.view.add").$D("新建"),
          handler: () => {
            this.dataSet.create({}, 0);
          },
        },
        {
          title: this.$T("smbl.common.view.save").$D("保存"),
          fill: true,
          handler: () => {
            let siteEvalLineResps = [];
            this.dataSet.records.forEach((element) => {
              siteEvalLineResps.push({
                ...element.data,
                evalHeaderId: this.evalHeaderId,
              });
            });
            let params = {
              evalLineIds: this.infoIds,
              siteEvalLineResps
            };
            this.$loading.show();
            saveScorerApi(params).then((res) => {
              if (!res.failed) {
                this.popFlag = false;
              }
            }).finally(() => {
              this.$loading.hide();
            });
          },
        }
      ];
    },
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.dataSet = new DataSet(scorerMaintainDS(this.editable));
        this.dataSet.editFlag = false;
        // this.dataSet.reset();
        this.popFlag = true;
        this.dataSet.transport.read = null;
        if (this.targetLineId) {
          this.dataSet.transport.read = {
            url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-line-resps/${this.targetLineId}`,
            method: "get",
          };
          this.dataSet.refresh();
        }
      }
    },
    popFlag(newVal) {
      if (!newVal) {
        this.$emit("input", false);
      }
    }
  },
  beforeMount() {
  },
  methods: {
    createAction() {
      this.index = this.index + 1;
      this.dataSet.create({ index: this.index }, 0);
    },
    deleteItem(record) {
      this.dataSet.removeRecords([ record ]);
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>