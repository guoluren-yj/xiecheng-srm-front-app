<template>
  <div ref="siShunSubjectMapping" v-loading="initLoading" class="si-shun-subject-mapping">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('hzero.common.view.title.baseInfo').$D('基础信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T('hipspfm.workFlow.view.message.noBasicInfo').$D('暂无基本信息') }}</span>
        </div>
        <div v-else style="padding-top: 16px;" @click="showHeaderDetail">
          <customize :columns="getHeaderColumns()" :need-padding="true" type="list" :data-source="headerInfo" />
        </div>
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('scux.subjectMappingTable.view.title.detail').$D('单据明细')">
        <div style="padding-top: 16px;">
          <srm-list v-if="lineDataSet" :data-set="lineDataSet" :columns="getRowColumns()"
                    @itemClick="showLineInfoDetail" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible.sync="subjectLineDetailPopup"
               :show-header="true"
               :rounded="false"
               :title="$T('scux.subjectMappingTable.view.title.detail').$D('单据明细')"
               height="100vh"
               position="right">
      <srm-form
        v-if="subjectLineDetailDataSet"
        style="padding-bottom: 100px;"
        :data-set="subjectLineDetailDataSet"
        customize-type="detail"
        :columns="getRowColumns()"
        customize-code=""/>
    </srm-popup>
    <srm-popup :visible.sync="headerDetailPopup"
               :show-header="true"
               :rounded="false"
               :title="$T('hzero.common.view.title.baseInfo').$D('基础信息')"
               position="right">
      <srm-customize-detail :columns="getHeaderColumns()" :need-padding="true" type="detail" :data-source="headerInfo" />
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, SrmCustomizeDetail } from "srm-mobile-ui";
import { subjectLineDataSet, subjectLineDetailDataSet } from "./dataSet/lineDs";

export default {
  modules: [ "scux.subjectMappingTable", "hipspfm.workFlow", "hzero.common" ],
  name: "SiShunSubjectMappingTable",
  components: { SrmCustomizeDetail },
  props: {
    changeReqId: {
      type: [ String, Number ],
      default: "",
    },
  },
  data() {
    return {
      lineDataSet: null,
      subjectLineDetailDataSet: null,
      headerInfo: {},
      subjectLineDetailPopup: false,
      headerDetailPopup: false,
      initLoading: false,
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.subjectMappingTable.model.approveNum").$D("审批单号"),
          fieldCode: "approveNum",
        },
      ];
    },
    getRowColumns() {
      return () => [
        {
          fieldCode: "statusMeaning",
        },
        {
          fieldCode: "invOrganization",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "company",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "updatedByName",
        },
        {
          fieldCode: "lastUpdateDate",
        },
      ];
    },
  },
  async mounted() {
    try {
      this.initLoading = true;
      this.headerInfo = this.changeReqId ? { approveNum: this.changeReqId } : {};
      // 获取审批单号并查询明细
      if (this.changeReqId) {
        this.lineDataSet = new DataSet(subjectLineDataSet(this.changeReqId));
        this.lineDataSet.query();
      }
    } catch (e) {
      this.headerInfo = {};
      this.initLoading = false;
    } finally {
      this.initLoading = false;
    }
  },
  methods: {
    showLineInfoDetail(record) {
      this.subjectLineDetailDataSet = new DataSet(subjectLineDetailDataSet());
      this.subjectLineDetailDataSet.create(record.data, 0);
      this.subjectLineDetailPopup = true;
    },
    showHeaderDetail() {
      this.headerDetailPopup = true;
    },
  },
};
</script>

<style scoped lang="stylus">
.si-shun-subject-mapping {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }
}
</style>
