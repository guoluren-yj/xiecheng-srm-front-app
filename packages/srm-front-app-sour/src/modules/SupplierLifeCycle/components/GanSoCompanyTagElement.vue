<template>
  <div class="company-tag-container">
    <template v-for="tag in TAG_CONFIG">
      <!-- 有值才展示 -->
      <srm-tag v-if="companyTags[tag.key]" :key="tag.key" :type="getTagType(tag.key)"
               @click.native="goOtherInfo(tag.key)">
        <!-- extraTags 中的标签显示 "标签名：值" 格式 -->
        <template v-if="extraTags.includes(tag.key)">
          {{ tag.label }}：{{ companyTags[tag.key] }}
        </template>
        <!-- inBlacklist 只显示标签名 -->
        <template v-else-if="tag.key === 'inBlacklist'">
          {{ tag.label }}
        </template>
        <!-- 其他直接显示值 -->
        <template v-else>
          {{ companyTags[tag.key] }}
        </template>
      </srm-tag>
    </template>
  </div>
</template>

<script>
import { fetchTagsDataApi } from "../api";
import { $T } from "srm-mobile-ui";

const TAG_CONFIG = [
  { key: "registerDate", label: $T("sslm.common.model.registerDate").$D("注册时间") },
  { key: "introduceSource", label: $T("sslm.common.model.introduceSource").$D("引入来源") },
  { key: "levelType", label: $T("sslm.common.model.levelType").$D("供应商类型") },
  { key: "taxIncludeAmountSum", label: $T("sslm.common.model.taxIncludeAmountSum").$D("年度合作金额（含税金额）") },
  { key: "evaluation", label: $T("sslm.common.model.evaluationAttCount").$D("考评单") },
  { key: "abnormalAttCount", label: $T("sslm.common.model.abnormalAttCount").$D("品质异常单（SRM）") },
  { key: "checkAttCount", label: $T("sslm.common.model.checkAttCount").$D("稽核案件（OA）") },
  { key: "relationCheck", label: $T("sslm.common.model.relationCheck").$D("关系排查") },
  { key: "riskReport", label: $T("sslm.common.model.riskReport").$D("风险报告") },
  { key: "inBlacklist", label: $T("sslm.common.model.inBlacklist").$D("黑名单") },
  { key: "topThreeItem", label: $T("sslm.common.model.topThreeItem").$D("历史合作前三物料") },
];

// 需要点击跳转到其他信息的标签
const scrollTag = [ "abnormalAttCount", "checkAttCount", "topThreeItem", "checkAttCount", "riskReport", "relationCheck", "evaluation" ];

// 需要显示 "标签名：值" 格式的标签
const EXTRA_TAGS = [ "registerDate", "taxIncludeAmountSum", "levelType", "topThreeItem" ];

/* eslint-disable */
const levelTypeColorMap = {
  '金牌供应商': "warning",
  '优秀供应商': "purple",
  '良好供应商': "success",
  '一般供应商': "primary",
  '待淘汰供应商': "brown",
};
/* eslint-enable */

export default {
  name: "GanSoCompanyTagElement",
  modules: [ "sslm.common", "hipspfm.common" ],
  props: {
    goToTab: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      TAG_CONFIG,
      extraTags: EXTRA_TAGS,
      companyTags: {},
    };
  },
  mounted() {
    this.fetchTagsData();
  },
  methods: {
    // 点击其他信息标签跳转
    goOtherInfo(key) {
      if (scrollTag.includes(key)) {
        this.goToTab("otherInfo");
      }
    },
    // 获取标签类型
    getTagType(key) {
      const value = this.companyTags[key];

      if (key === "levelType") {
        return levelTypeColorMap[value];
      }

      if (key === "inBlacklist" && value) {
        return "danger";
      }
      if (key === "riskReport" && value) {
        return "warning";
      }
      return "primary";
    },
    async fetchTagsData() {
      const params = {
        companyId: this.$route.query.companyId,
        supplierCompanyId: this.$route.query.supplierCompanyId,
      };
      try {
        const res = await fetchTagsDataApi(params);
        if (!res) {
          return;
        }
        if (!res.failed) {
          this.companyTags = res;
        }
      } catch (err) {
        // 获取标签数据失败
      }
    },
  },
};
</script>

<style scoped>
.company-tag-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  span {
    white-space: wrap;
  }
}
</style>