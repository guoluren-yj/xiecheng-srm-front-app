<template>
  <div>
    <srm-scroll-tab :customize-code="getCustomizeUnitCode('scrollTabs')">
      <!-- 基础信息 -->
      <srm-scroll-tab-item
        :label="$T('ssrc.common.view.message.basicInfos').$D('基础信息')"
        code="basicInfo">
        <srm-list
          :data-set="headerDs"
          :scrollable="false"
          :columns="getBasicInfoColumns()"
          :customize-code="getCustomizeUnitCode('basicInfoForm')" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('ssrc.clarify.view.title.clarifyText').$D('澄清函正文')"
        code="clarifyText">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="ssrc-clarify-text" v-html="safeHtmlContent" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('ssrc.clarify.view.title.relatedQuestionTable').$D('关联问题表格')"
        code="relatedQuestion">
        <srm-list
          :data-set="relatedQuestionDs"
          :scrollable="false"
          :columns="getRelatedQuestionColumns"
          :customize-code="getCustomizeUnitCode('relatedQuestion')" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { headerDS, relatedQuestionDS } from "./datasource/ds.js";
import { DataSet, SrmListHeader, SrmUtil } from "srm-mobile-ui";
import { isEmpty, isArray } from "lodash";

import { getHeaderInfo } from "./api";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.clarify", "ssrc.common", "smbl.common", "scux.ssrc" ],
  name: "RfxClarificationLetterApprovalForm",
  props: {
    changeReqId: { // 澄清头id
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      headerDs: new DataSet(headerDS({ clarifyId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode("basicInfoForm") })),
      relatedQuestionDs: new DataSet(relatedQuestionDS({ clarifyId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode("relatedQuestion") })),
    };
  },
  computed: {
    safeHtmlContent() {
      if (this.headerDs.current) {
        const context = this.headerDs.current.get("context");
        if (!context) {
          return "";
        }
        return this.replacePrivateBucket(context);
      }
      return "";
    },
    // 关联问题表格-列
    getRelatedQuestionColumns() {
      let sourceType = "";
      if (this.headerDs.current) {
        sourceType = this.headerDs.current.get("sourceType");
      }
      return [
        {
          fieldName: this.$T("ssrc.clarify.view.clarification.clarificationTitle").$D("问题描述"),
          fieldCode: "description",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              {val}
            </SrmListHeader>
        },
        {
          fieldName:  this.$T("ssrc.clarify.view.clarification.clarificationNo").$D("澄清类型"),
          fieldCode: "clarifyTypeMeaning",
          fieldType: "TEXT",
          visible: ![ "RFP", "RFI" ].includes(sourceType),
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.clarify.view.clarification.clarificationCompany").$D("问题编号"),
          fieldCode: "issueFinalNum",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 20,
        },
        {
          fieldName:  this.$T("ssrc.clarify.view.clarification.clarificationPublishDate").$D("提交时间"),
          fieldCode: "submittedDate",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.clarify.view.clarification.submittedByUserName").$D("提交人"),
          fieldCode: "submittedByUserName",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.clarify.view.clarification.clarificationPublisher").$D("供应商"),
          fieldCode: "supplierCompanyName",
          fieldType: "TEXT",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.clarify.view.clarification.problemAnnex").$D("问题附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          title: this.$T("smbl.common.view.button.viewUpload").$D("查看附件"),
          showCount: true,
          formRow: 50,
          formCol: 10,
        },
      ];
    },
  },
  async mounted() {
    this.fetchInitData();
  },
  methods: {
    // 查询数据
    async fetchInitData() {
      this.$loading.show();
      getHeaderInfo({
        clarifyId: this.changeReqId,
        customizeUnitCode: this.getCustomizeUnitCode("basicInfoForm"),
      }).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: this.$T("smbl.common.message.request.error").$D("请求失败"),
            description: res.message,
            class: "notification"
          });
          this.$loading.hide();
        } else {
          this.relatedQuestionDs.addQueryParameter("sourceId", res.sourceId);
          this.relatedQuestionDs.addQueryParameter("sourceType", res.sourceType);
          this.headerDs.create(res, 0);
          this.relatedQuestionDs.query();
        }
      }).finally(() => this.$loading.hide());
    },
    // 基础信息-列
    getBasicInfoColumns() {
      return [
        {
          fieldName: this.$T("ssrc.clarify.model.clarify.title").$D("标题"),
          fieldCode: "title",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              {val}
            </SrmListHeader>
        },
        {
          fieldName:  this.$T("ssrc.clarify.model.clarify.clarifyNum").$D("澄清单号"),
          fieldCode: "clarifyNum",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.clarify.model.clarify.sourceNum").$D("寻源单号"),
          fieldCode: "sourceNum",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.common.company").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName:  this.$T("ssrc.clarify.model.clarify.context").$D("澄清函文件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
          title: this.$T("smbl.common.view.button.viewUpload").$D("查看附件"),
          showCount: true,
          formRow: 40,
          formCol: 10,
        },
      ];
    },
    // 个性化编码
    getCustomizeUnitCode(codeName) {
      if (!codeName || isEmpty(codeName)) {
        return null;
      }
      // 个性化编码集合
      const codeMap = new Map([
        [ "scrollTabs", "SMBL.WORKFLOW.CLARIFY_RELEASE_APPROVAL.SCROLL_TABS" ], // 标签页
        [ "basicInfoForm", "SMBL.WORKFLOW.CLARIFY_RELEASE_APPROVAL.BASIC_INFO_FORM" ], // 基础信息
        [ "relatedQuestion", "SMBL.WORKFLOW.CLARIFY_RELEASE_APPROVAL.RELATED_QUESTION_TABLE" ], // 关联问题
      ]);

      let currentUnitCode = null;

      if (typeof codeName === "string") {
        currentUnitCode = codeMap.get(codeName);
      }

      if (isArray(codeName)) {
        const codeSet = new Set();
        codeName.forEach((unitCode) => {
          codeSet.add(codeMap.get(unitCode));
        });

        currentUnitCode = codeSet.size ? [ ...codeSet ].join(",") : null;
      }

      return currentUnitCode;
    },
    // 处理富文本中的图片
    replacePrivateBucket(context) {
      if (context) {
        const accessToken = window.localStorage.getItem("user-token");
        const bucketName = "private-bucket";
        const imgReg = new RegExp(/<img\b.*?(?:>|\/>)/g);
        const newContext = context.replace(imgReg, (item) => {
          const matchResult = item.match(
            /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])+([\S]+[.]*[\w\-\\@?^=%&/~\\+#])/
          );
          if (matchResult && matchResult[0]) {
            const newUrl = `${SrmUtil.getApiBaseUrl()}/hfle/v1/${SrmUtil.getTenantId()}/files/redirect-url?bucketName=${bucketName}&access_token=${accessToken}&url=${encodeURIComponent(
              matchResult[0]
            )}`;
            return item.replace(
              /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&:/~\\+#]*[\w\-\\@?^=%&/~\\+#])+([\S]+[.]*[\w\-\\@?^=%&/~\\+#])/,
              newUrl
            );
          }
          return item;
        });
        return newContext;
      }
      return context;
    }
  },
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-item-card-head .srm-list-item-card-head-left {
  font-weight: 600 !important;
}
.ssrc-clarify-text {
  padding: 15px;
  overflow: auto;
  line-height: 1.5
  >>> p {
    margin-top: 0;
    margin-bottom: 1em;
  }
}
</style>