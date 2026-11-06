<template>
  <srm-scroll-tab v-loading="loading">
    <srm-scroll-tab-item :label="$T('spfm.notice.view.title.tabTitleBaseInfo').$D('公告基础信息')">
      <div @click="showBaseInfoDetail">
        <srm-customize
          need-padding
          :columns="baseInfoColumns"
          code="SMBL.WORKFLOW.NOTICES_APPROVAL.BASE_INFO"
          :data-source="noticeInfo" />
      </div>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('spfm.notice.view.title.tabTitleDetail').$D('公告详情')">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="notice-body-preview" v-html="noticeInfo && noticeInfo.noticeContent && noticeInfo.noticeContent.noticeBody || '-'" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('spfm.notice.view.title.tabTitleAttachment').$D('附件')">
      <div class="notice-attachment-button-container">
        <srm-attachment
          v-if="attachmentUuid"
          :attachment-uuid="attachmentUuid"
          :readonly="true"
          bucket-name="public-bucket" />
      </div>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { SrmCustomize, SrmCustomizeDetail, SrmUtil } from "srm-mobile-ui";
import { getNoticeInfoApi } from "./api/index";
export default {
  modules: [ "spfm.notice" ],
  name: "NoticesApproval",
  components: {
    SrmCustomize,
  },
  props: {
    parameters: {
      type: Object,
      default: () => ({
        noticeId: null,
      }),
    }
  },
  data() {
    return {
      noticeInfo: {},
      attachmentUuid: null,
      loading: false,
    };
  },
  computed: {
    baseInfoColumns() {
      return [
        {
          fieldCode: "groupName",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            <span>{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.title").$D("公告标题"),
          fieldCode: "title",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.noticeTypeMeaning").$D("公告类型"),
          fieldCode: "noticeTypeMeaning",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.noticeCategoryMeaning").$D("公告对象"),
          fieldCode: "noticeCategoryMeaning",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.visibleSupplierIds").$D("可见供应商"),
          fieldCode: "visibleSupplierNames",
          visible: (val, item) => item.noticeCategoryCode === "OGYS",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.visibleUserIds").$D("可见采购方"),
          fieldCode: "visibleUserNames",
          visible: (val, item) => item.noticeCategoryCode === "OCGF",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.visiblePurchaseAgentIds").$D("可见采购员"),
          fieldCode: "visiblePurchaseAgentNames",
          visible: (val, item) => item.noticeCategoryCode === "OBUYER",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.startDate").$D("有效日期从"),
          fieldCode: "startDate",
          render: (val) => val ? SrmUtil.dateFormat(new Date(val), "yyyy-MM-dd") : "-",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.endDate").$D("有效日期至"),
          fieldCode: "endDate",
          render: (val) => val ? SrmUtil.dateFormat(new Date(val), "yyyy-MM-dd") : "-",
        }
      ];
    },
    detailColumns() {
      return [
        {
          fieldName: this.$T("spfm.notice.model.notice.groupName").$D("租户"),
          fieldCode: "groupName",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.title").$D("公告标题"),
          fieldCode: "title",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.noticeTypeMeaning").$D("公告类型"),
          fieldCode: "noticeTypeMeaning",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.noticeCategoryMeaning").$D("公告对象"),
          fieldCode: "noticeCategoryMeaning",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.visibleSupplierIds").$D("可见供应商"),
          fieldCode: "visibleSupplierNames",
          visible: (val, item) => item.noticeCategoryCode === "OGYS",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.visibleUserIds").$D("可见采购方"),
          fieldCode: "visibleUserNames",
          visible: (val, item) => item.noticeCategoryCode === "OCGF",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.visiblePurchaseAgentIds").$D("可见采购员"),
          fieldCode: "visiblePurchaseAgentNames",
          visible: (val, item) => item.noticeCategoryCode === "OBUYER",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.startDate").$D("有效日期从"),
          fieldCode: "startDate",
          render: (val) => val ? SrmUtil.dateFormat(new Date(val), "yyyy-MM-dd") : "-",
        },
        {
          fieldName: this.$T("spfm.notice.model.notice.endDate").$D("有效日期至"),
          fieldCode: "endDate",
          render: (val) => val ? SrmUtil.dateFormat(new Date(val), "yyyy-MM-dd") : "-",
        }
      ];
    },
  },
  mounted() {
    this.getNoticeInfo();
  },
  methods: {
    async getNoticeInfo() {
      if (!this.parameters.noticeId) {
        return;
      }
      this.loading = true;
      const res = await getNoticeInfoApi(this.parameters.noticeId);
      this.noticeInfo = res;
      this.attachmentUuid = res.attachmentUuid;
      this.loading = false;
    },
    showBaseInfoDetail() {
      this.$popup({
        title: this.$T("spfm.notice.view.title.tabTitleBaseInfo").$D("公告基础信息"),
        showHeader: true,
        position: "right",
        showBack: true,
        content:
          <SrmCustomizeDetail
            needPadding
            code="SMBL.WORKFLOW.NOTICES_APPROVAL.BASE_INFO.DETAIL"
            columns={this.detailColumns}
            dataSource={this.noticeInfo}
          />
        ,
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.notice-body-preview {
  margin: 10px 16px;
  width: calc(100% - 32px);
  overflow-x: scroll;
  >>> img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
  >>> a {
    color: var(--color-primary);
  }
}

.notice-attachment-button-container {
  width: 100%;
  position: relative;
  .notice-attachment-button {
    padding: 12px 16px;
    >>> .srm-icon {
      color: var(--color-warn);
      font-size: 20px;
    }
  }
}

</style>