<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <div class="phone-tips">{{ $T("smbl.wideArea.view.title.phones").$D("请拨打平台电话 400-116-0808 了解更多详情") }}</div>
    <div v-loading="loading" class="main-info">
      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item :label="$T('smbl.wideArea.view.title.baseInfo').$D('基础信息')" @click.native="showLineDetail">
          <customize :need-padding="true" :data-source="baseInfo" :columns="getBaseInfoColumns" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('smbl.wideArea.view.title.baseInfo').$D('基础信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" :data-source="baseInfo" :columns="getBaseInfoColumns" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import {
  getDetailApi,
} from "../api";

export default {
  modules: [ "smbl.wideArea" ],
  name: "FindBusinessDetail",
  components: {
  },
  data() {
    return {
      visible: false, //行信息弹窗
      loading: true,
      baseInfo: {}, //基础信息
      companyArea: "", // 地区信息
    };
  },
  computed: {
    // 基础信息
    getBaseInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => <div class="company-name">{item.companyName}</div>
        },
        {
          fieldName: this.$T("smbl.wideArea.model.companyType").$D("公司类型"),
          fieldCode: "companyTypeMeaning",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.registeredCapitalWithUnit").$D("注册资本"),
          fieldCode: "registeredCapital",
          render: (val) => val ? val + this.$T("smbl.wideArea.model.ten.thousand").$D("万") : "-"
        },
        {
          fieldName: this.$T("smbl.wideArea.model.creationDate").$D("成立日期"),
          fieldCode: "buildDate",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.businessRound").$D("经营范围"),
          fieldCode: "businessScope",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.legalPerson").$D("法人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.socialCreditCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.businessNature").$D("经营性质"),
          fieldCode: "businessNature",
          render: (val, record) => {
            let result = [];
            if (record.manufacturerFlag) {
              result.push(this.$T("smbl.wideArea.modal.manufacturer").$D("制造商"));
            }
            if (record.traderFlag) {
              result.push(this.$T("smbl.wideArea.modal.trader").$D("贸易商"));
            }
            if (record.traderFlag) {
              result.push(this.$T("smbl.wideArea.modal.servicer").$D("服务商"));
            }
            if (record.agentFlag) {
              result.push(this.$T("smbl.wideArea.modal.agent").$D("代理商"));
            }
            if (record.integrationFlag) {
              result.push(this.$T("smbl.wideArea.modal.integration").$D("集成商"));
            }
            if (record.contractorFlag) {
              result.push(this.$T("smbl.wideArea.modal.contractor").$D("承包商"));
            }
            return result.toString();
          }
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.industries").$D("行业类型"),
          fieldCode: "industries",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.categoryName").$D("主营品类"),
          fieldCode: "industryCategories",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.serviceArea").$D("服务范围"),
          fieldCode: "serviceArea",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.officialWebsite").$D("官网"),
          fieldCode: "website",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.email").$D("邮箱"),
          fieldCode: "email",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.localArea").$D("所在地区"),
          fieldCode: "companyArea",
          render: (val) => val ? val : this.companyArea,
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.address").$D("地址"),
          fieldCode: "address",
        },
      ];
      return columns;
    },
  },
  async mounted() {
    const {
      companyId,
      companyArea,
    } = this.$route.query;
    this.companyArea = companyArea;
    this.getBaseInfo(companyId);
  },
  methods: {
    // 查看行详情
    showLineDetail() {
      // this.visible = !this.visible;
    },
    // 获取基本信息
    getBaseInfo(companyId) {
      const params = {
        companyId: companyId || 1068023,
      };
      getDetailApi(params).then((res = {}) => {
        this.baseInfo = res || {};
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}

.phone-tips {
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
  padding: 8px 20px;
  background: #EFF3FE;
}

.company-name {
  font-weight: 600;
  position: relative;
  &:before {
    content: "";
    width: 1.867vw;
    height: 2.667vw;
    background: var(--color-primary)
    position: absolute;
    left: -4vw;
    top: 5px;
  }
}

.no-data {
  width: 100%;
  height: 300px;
  line-height: 300px;
  text-align: center;
}
</style>
