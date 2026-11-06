<template>
  <!-- 专家评分 -->
  <section>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <ul style="padding: 16px 15px;"
            @click="openPopup('basicInfo', {code: getMainCustomizeCode('basicInfoDetail'), columns: getColumns('basicInfoDetail'), data: headInfo})">
          <customize
            :data-source="headInfo"
            :columns="getColumns('basicInfo')"
            :code="getMainCustomizeCode('basicInfo')"
            type="list"
            :need-padding="false"/>
        </ul>
      </srm-scroll-tab-item>
      <!-- 评分明细 -->
      <srm-scroll-tab-item :label="getLanguageDefine('scoreInfo')">
        <ul v-for="(item, index) of scoreInfoDataSet.data" :key="index">
          <customize
            :style="{'padding': item.scoreDetails && item.scoreDetails.length>0 ? '16px 15px 10px 15px' : '16px 15px'}"
            :data-source="item"
            :columns="getColumns('scoreInfo')"
            :code="getCustomizeCode('scoreInfo')"
            type="list"
            :need-padding="false"/>
          <div v-if="item.scoreDetails && item.scoreDetails.length>0">
            <div v-for="(res, j) of item.scoreDetails" :key="scoreInfoDataSet.data.length + j">
              <customize
                v-if="res.sumScoreMeaning !== '0.00'"
                :style="{'padding': j !== item.scoreDetails.length -1 ? '0px 0px 10px 15px':'0px 0px 16px 15px'}"
                :data-source="res"
                :columns="getColumns('scoreInfoPeople')"
                type="list"
                :need-padding="false"/>
            </div>
          </div>
          <srm-blank v-if="index !== scoreInfoDataSet.data.length -1" size="mid" theme="fill"/>
        </ul>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="headInfo.rfxStatus === 'CLOSED' || headInfo.rfxStatus === 'CHECK_PENDING' || headInfo.rfxStatus === 'FINISHED'" :label="$T('ssrc.inquiryHall.model.library.attachmentUuid').$D('附件')">
        <div class="customize-card">
          <customize :need-padding="true" :data-source="headInfo" :columns="getProcessAttachmentColumns" />
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visibleDetailPopup"
               :show-header="false"
               height="100%">
      <customize-detail
        :need-padding="true"
        :code="infoDetailPopup.code"
        :data-source="infoDetailPopup.data"
        :columns="infoDetailPopup.columns"/>
    </srm-popup>
    <!-- 过程附件弹框 -->
    <process-attachment-pop ref="processAttachComRef" />
  </section>
</template>

<script>
import { getBasicInfoApi, fetchEvaluateSummary } from "../../api/ExpertScore";
import { scoreInfoDs } from "../../datasource/ExpertScoreDs";
import { DataSet, $T } from "srm-mobile-ui";
import ProcessAttachmentPop from "../commonPop/ProcessAttachmentPop";

export default {
  modules: [ "ssrc.queryRfq", "ssrc.inquiryHall", "smbl.common", "hipspfm.common", "smbl.inquiryHall", "ssrc.common" ],
  name: "ExpertScore",
  components: {
    ProcessAttachmentPop,
  },
  props: {
    rfxHeaderId: {
      type: String,
    },
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      // 基础信息
      headInfo: {},
      // 评分明细
      scoreInfoDataSet: new DataSet(scoreInfoDs()),
      visibleDetailPopup: false,
      infoDetailPopup: {},
    };
  },
  // 获取字段
  computed: {
    getColumns() {
      return (title) => {
        let nameList = [];
        switch (title) {
        case "basicInfo" :
          nameList = this.documentType === "BID" ? [ "rfxNumHead", "companyName", "secondarySourceCategoryMeaning", "sourceMethodMeaning", "expertScoreTypeMeaning", "openBidOrderMeaning" ] : [ "rfxNumHead", "companyName", "sourceCategoryMeaning", "sourceMethodMeaning", "expertScoreTypeMeaning", "openBidOrderMeaning" ];
          break;
        case "basicInfoDetail" :
          nameList = this.documentType === "BID" ? [ "rfxNum", "companyName", "secondarySourceCategoryMeaning", "sourceMethodMeaning", "expertScoreTypeMeaning", "openBidOrderMeaning" ] : [ "rfxNum", "companyName", "sourceCategoryMeaning", "sourceMethodMeaning", "expertScoreTypeMeaning", "openBidOrderMeaning" ];
          break;
        case "scoreInfo" :
          nameList = [ "supplierCompanyName", "summaryScoreMeaning" ];
          break;
        case "scoreInfoPeople" :
          nameList = [ "scoreInfoPeople" ];
          break;
        default:
          nameList = [ ];
          break;
        }
        let columns = nameList.map((res) => ({
          ...this.getFieldInfo(res)
        }));
        return columns;
      };
    },
    //过程附件查看
    getProcessAttachmentColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxHeaderId",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            <span>{ this.$T("ssrc.inquiryHall.view.button.examine").$D("过程附件查看") }：</span>
            <span style="color: var(--color-other-default-b);"
              on-click={(e) => {
                e.stopPropagation();
                this.$refs.processAttachComRef.getProcessAttachmentDetailInfo(item);
              }}>
              { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
            </span>
          </SrmFlex>,
        }
      ];
    },
  },
  async mounted() {
    if (this.rfxHeaderId) {
      try {
        this.$loading.show();
        await this.fetchData();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    async fetchData() {
      await getBasicInfoApi(this.rfxHeaderId, {
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.EXPERT_SCORE_BASEINFO",
        organizationId: window.sessionStorage.getItem("organizationId"),
        sourceFrom: "RFX",
      }).then((res) => {
        this.headInfo = { ...res };
        this.$loading.hide();
      });
      this.fetchEvaluateSummary();
    },
    async fetchEvaluateSummary() {
      await fetchEvaluateSummary({
        sourceHeaderId: this.rfxHeaderId,
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.EXPERT_SCORE_BASEINFO",
        sourceFrom: "RFX",
      }).then((res) => {
        if (res && !res.failed) {
          // 因移动端和pc端相差较大，逻辑复杂，动的话需要大改，因此去组装数据修复汇总字段
          const supplierList = this.filterSupplierList(this.headInfo, res) || [];
          this.scoreInfoDataSet.setData(supplierList);
          this.scoreInfoDataSet.refresh();
        }
      });
    },
    // 获取有效打分专家数据
    filterSupplierList(data = {}, summaryDTO = {}) {
      const mapDataKeys = Object.keys(summaryDTO.evaluateSummaryMap || {});
      let evaluateSummaryList = !mapDataKeys.length ? [] : summaryDTO.evaluateSummaryMap[mapDataKeys[0]];

      // 获取 evaluateExperts 中的所有 evaluateExpertId
      const allExpertIds = Object.values(data.evaluateExperts)
        .flat()
        .map((expert) => expert.evaluateExpertId);
      // 遍历 supplierList 并过滤 scoreDetails 中不匹配的 evaluateExpertId
      const res =
           (data?.supplierList || [])
             .map((supplier) => {
               // 过滤掉 scoreDetails 中不在 allExpertIds 列表中的 evaluateExpertId
               const scoreDetails = (supplier?.scoreDetails || []).filter((detail) =>
                 allExpertIds.includes(detail?.evaluateExpertId)
               );
               supplier.scoreDetails = scoreDetails;
               // 过滤出 evaluateSummaryList 中与 supplier.quotationHeaderId 相同的元素
               const index = evaluateSummaryList.findIndex((es) => es.quotationHeaderId === supplier.quotationHeaderId);
               if (index > -1 && evaluateSummaryList[index]) {
                 supplier.sumPassStatus = evaluateSummaryList[index].sumPassStatus;
               }

               return supplier;
             })
             .filter((supplier) => supplier.scoreDetails.length > 0); // 过滤掉没有 scoreDetails 的 supplier
      return res;
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "basicInfo": $T("ssrc.inquiryHall.view.inquiryHall.headerBaseInfo").$D("基础信息"),
        "scoreInfo": $T("ssrc.inquiryHall.view.inquiryHall.scoreDetail").$D("评分明细"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
      };
      return codeList[code] || "";
    },
    // 获取 个性化配置
    getMainCustomizeCode(code) {
      const codeList = {
        // 基础信息
        basicInfo:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.ES.BASICINFO.BID" : "SMBL.NEW_BID_HALL.ES.BASICINFO.RFX",
        basicInfoDetail:this.documentType === "BID" ? "SMBL.NEW_BID_HALL.ES.BASICINFO.DETAIL.BID" : "SMBL.NEW_BID_HALL.ES.BASICINFO.DETAIL.RFX",
      };
      return codeList[code] || "";
    },
    openPopup(name, item) {
      switch (name) {
      case "":
        break;
      default:
        this.visibleDetailPopup = true;
        this.infoDetailPopup = {
          ...item,
        };
        break;
      }
    },
    // 获取字段
    getFieldInfo(code) {
      const columnList = [
        {
          fieldCode: "rfxNumHead",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmListHeader>
              <span style="font-weight: normal !important">
                { this.documentType === "BID" ? $T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : $T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号")}：{item.rfxNum ? item.rfxNum : "-"}
              </span>
            </SrmListHeader>
        },
        {
          fieldCode: "rfxNum",
          fieldName: this.documentType === "BID" ? $T("smbl.inquiryHall.model.inquiryHallBidNum").$D("招标书编号") : $T("ssrc.inquiryHall.model.inquiryHall.inquiryHallRfxNum").$D("询价单编号"),
          formRow: 1,
        },
        {
          fieldCode: "companyName",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.companyName").$D("公司"),
          formRow: 2,
        },
        {
          fieldCode: "sourceCategoryMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          formRow: 3,
        },
        {
          fieldCode: "secondarySourceCategoryMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceCategoryMeaning").$D("寻源类别"),
          formRow: 3,
        },
        {
          fieldCode: "sourceMethodMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.sourceMethodMeaning").$D("寻源方式"),
          formRow: 3,
        },
        {
          fieldCode: "expertScoreTypeMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.expertScoreType").$D("专家评分"),
          formRow: 4,
        },
        {
          fieldCode: "openBidOrderMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.openBidOrderMeaning").$D("评标步制"),
          formRow: 4,
        },
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, item) =>
            <SrmListHeader>
              {$T("ssrc.inquiryHall.view.message.supplierCompanyName").$D("供应商名称")}：{item.supplierCompanyName}
            </SrmListHeader>
        },
        {
          fieldCode: "summaryScoreMeaning",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.summaryScore").$D("汇总"),
          formRow: 2,
          render: (val, item) => item.sumPassStatus || val,
        },
        {
          fieldCode: "scoreInfoPeople",
          fieldType: "EMPTY",
          visible: (val, item) => item.sumScoreMeaning === "0.00" ? 0 : 1,
          render: (val, item) =>
            <SrmFlex>
              {item.team === "TECHNOLOGY" ? $T("ssrc.inquiryHall.view.message.tab.technicalGroup").$D("技术组") : $T("ssrc.inquiryHall.view.message.tab.businessGroup").$D("商务组")}-{item.expertName}：{item.sumScoreMeaning}
            </SrmFlex>
        },
      ];
      return columnList.find((v) => v.fieldCode === code);
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-item-card-head-left {
  max-width: 100% !important;
}
</style>