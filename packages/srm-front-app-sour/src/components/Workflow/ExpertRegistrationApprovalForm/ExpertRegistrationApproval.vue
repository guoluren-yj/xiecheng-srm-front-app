<template>
  <!-- 专家注册申请审批 -->
  <div>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-form :data-set="basicInfoDataSet" :columns="getBasicColumns()" :customize-code="getCustomizeCode('basicInfoCode')" />
      </srm-scroll-tab-item>
      <!-- 专业领域 -->
      <srm-scroll-tab-item :label="getLanguageDefine('fieldTable')">
        <srm-list
          :data-set="fieldTableDataSet"
          :columns="getFieldTableColumns()"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <!-- 专业成果 -->
      <srm-scroll-tab-item :label="getLanguageDefine('achievementTable')">
        <srm-list
          :data-set="achievementTableDataSet"
          :columns="getAchievementTableColumns()"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <!-- 职业履历 -->
      <srm-scroll-tab-item :label="getLanguageDefine('careerPortfolioTable')">
        <srm-list
          :data-set="careerPortfolioTableDataSet"
          :columns="getCareerPortfolioTableColumns()"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <!-- 教育经历 -->
      <srm-scroll-tab-item :label="getLanguageDefine('eduExperienceTable')">
        <srm-list
          :data-set="eduExperienceTableDataSet"
          :columns="getEduExperienceTableColumns()"
          :scrollable="false"/>
      </srm-scroll-tab-item>
      <!-- 银行信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('bankInfoTable')">
        <srm-list
          :data-set="bankInfoTableDataSet"
          :columns="getBankInfoTableColumns()"
          :scrollable="false"
          :customize-code="getCustomizeCode('bankInfoCode')"/>
      </srm-scroll-tab-item>
      <!-- 附件列表 -->
      <srm-scroll-tab-item :label="getLanguageDefine('attachmentTable')">
        <srm-list
          :data-set="attachmentTableDataSet"
          :columns="getExpertAttachmentColumns()"
          :scrollable="false"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { isArray, isEmpty } from "lodash";

import {
  basicInfoDS,
  fieldTableDS,
  achievementTableDS,
  careerPortfolioTableDS,
  eduExperienceTableDS,
  bankInfoTableDS,
  attachmentTableDS
} from "./datasource/ds.js";
import { getExpertRegisDetailData } from "./api/index.js";

export default {
  modules: [ "hzero.common", "ssrc.expert", "hipspfm.common", "smbl.common" ],
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    }
  },
  data() {
    return {
      basicInfoDataSet: new DataSet(basicInfoDS()), // 基本信息
      fieldTableDataSet: new DataSet(fieldTableDS()), // 专业领域
      achievementTableDataSet: new DataSet(achievementTableDS()), // 专业成果
      careerPortfolioTableDataSet: new DataSet(careerPortfolioTableDS()), // 职业履历
      eduExperienceTableDataSet: new DataSet(eduExperienceTableDS()), // 教育经历
      bankInfoTableDataSet: new DataSet(bankInfoTableDS()), // 银行信息
      attachmentTableDataSet: new DataSet(attachmentTableDS()) // 附件列表
    };
  },
  beforeMount() {
    if (!this.changeReqId) {
      return;
    }
    this.$loading.show();
    getExpertRegisDetailData(this.changeReqId, {
      customizeUnitCode: this.getCustomizeCode([
        "basicInfoCode",
        "bankInfoCode"
      ]),
    }).then((res) => {
      if (res && !res.failed) {
        const {
          expertReq = {},
          expertFieldReqs = [],
          expertAchvReqs = [],
          expertCareerReqs = [],
          expertEducationReqs = [],
          expertBankReqs = [],
          expertAttachmentReqs = [],
        } = res;
        this.basicInfoDataSet.create(expertReq || {});
        this.fieldTableDataSet.setData(expertFieldReqs || []);
        this.achievementTableDataSet.setData(expertAchvReqs || []);
        this.careerPortfolioTableDataSet.setData(expertCareerReqs || []);
        this.eduExperienceTableDataSet.setData(expertEducationReqs || []);
        this.bankInfoTableDataSet.setData(expertBankReqs || []);
        this.attachmentTableDataSet.setData(expertAttachmentReqs || []);
      }
    }).finally(() => {
      this.$loading.hide();
    });
  },
  methods: {
    // 获取 多语言配置
    getLanguageDefine(key) {
      const promptCode = "ssrc.expert";
      const languageList = {
        "basicInfo": $T(`${promptCode}.view.message.tab.basicInfo`).$D("基本信息"),
        "fieldTable": $T(`${promptCode}.view.message.tab.fieldTable`).$D("专业领域"),
        "achievementTable": $T(`${promptCode}.view.message.tab.achievementTable`).$D("专业成果"),
        "careerPortfolioTable": $T(`${promptCode}.view.message.tab.careerPortfolioTable`).$D("职业履历"),
        "eduExperienceTable": $T(`${promptCode}.view.message.tab.educationExperienceTable`).$D("教育经历"),
        "bankInfoTable": $T(`${promptCode}.view.message.tab.bankInfoTable`).$D("银行信息"),
        "attachmentTable": $T(`${promptCode}.view.message.tab.attachmentTable`).$D("附件")
      };
      return languageList[key] || key;
    },
    // 获取个性化code
    getCustomizeCode(codeName) {
      if (!codeName || isEmpty(codeName)) {
        return null;
      }

      const codeListMap = new Map([ // 个性化code集合
        // 基本信息
        [ "basicInfoCode", "SMBL.WORKFLOW.EXPERT_REGISTRATION_APPLICATION.DETAIL_HEADER_INFO" ],
        // 银行信息
        [ "bankInfoCode", "SMBL.WORKFLOW.EXPERT_REGISTRATION_APPLICATION.DETAIL_BANK_TABLE" ],
      ]);
      let currentUnitCode = null;
      if (typeof codeName === "string") {
        currentUnitCode = codeListMap.get(codeName);
      }

      if (isArray(codeName)) {
        const codeSet = new Set();
        codeName.forEach((unitCode) => {
          codeSet.add(codeListMap.get(unitCode));
        });

        currentUnitCode = codeSet.size ? [ ...codeSet ].join(",") : null;
      }

      return currentUnitCode;
    },
    // 基本信息
    getBasicColumns() {
      return [
        {
          fieldCode: "expertName",
          formRow: 10,
        },
        {
          fieldCode: "genderMeaning",
          formRow: 20,
        },
        {
          fieldCode: "birthday",
          formRow: 30,
        },
        {
          fieldCode: "expertLevelMeaning",
          formRow: 40,
        },
        {
          fieldCode: "expertTypeMeaning",
          formRow: 50,
        },
        {
          fieldCode: "expertCategoryMeaning",
          formRow: 60,
        },
        {
          fieldCode: "telephone",
          formRow: 70,
        },
        {
          fieldCode: "mobilephone",
          formRow: 80,
        },
        {
          fieldCode: "mail",
          formRow: 90,
        },
        {
          fieldCode: "countryName",
          formRow: 100,
        },
        {
          fieldCode: "provinceCityName",
          formRow: 110,
        },
        {
          fieldCode: "idTypeMeaning",
          formRow: 120,
        },
        {
          fieldCode: "idNumber",
          formRow: 130,
        },
        {
          fieldCode: "loginName",
          formRow: 140,
        },
        {
          fieldCode: "registeredDate",
          formRow: 150,
        },
        {
          fieldCode: "remark",
          formRow: 160,
        },
      ];
    },
    // 专业领域
    getFieldTableColumns() {
      return [
        {
          fieldCode: "fieldCode",
        },
        {
          fieldCode: "fieldCodeMeaning",
        },
        {
          fieldCode: "firstFieldFlag",
        },
      ];
    },
    // 专业成果
    getAchievementTableColumns() {
      return [
        {
          fieldCode: "achvRemark",
        },
        {
          fieldCode: "achvAttachmentUuid",
        },
      ];
    },
    // 职业履历
    getCareerPortfolioTableColumns() {
      return [
        {
          fieldCode: "startDate",
        },
        {
          fieldCode: "endDate",
        },
        {
          fieldCode: "workUnit",
        },
        {
          fieldCode: "position",
        },
        {
          fieldCode: "highestDegree",
        },
      ];
    },
    // 教育经历
    getEduExperienceTableColumns() {
      return [
        {
          fieldCode: "startDate",
        },
        {
          fieldCode: "endDate",
        },
        {
          fieldCode: "educationInstitution",
        },
        {
          fieldCode: "educationExperience",
        },
        {
          fieldCode: "degree",
        },
        {
          fieldCode: "certificateLicense",
        },
        {
          fieldCode: "certificateNum",
        },
        {
          fieldCode: "highestDegree",
        },
      ];
    },
    // 银行信息
    getBankInfoTableColumns() {
      return [
        {
          fieldCode: "bankCode",
        },
        {
          fieldCode: "bankName",
        },
        {
          fieldCode: "bankFirm",
        },
        {
          fieldCode: "bankBranchName",
        },
        {
          fieldCode: "bankAccountName",
        },
        {
          fieldCode: "bankAccountNum",
        },
        {
          fieldCode: "masterFlag",
        },
        {
          fieldCode: "enabledFlag",
        },
        {
          fieldCode: "remark"
        }
      ];
    },
    // 附件
    getExpertAttachmentColumns() {
      return [
        { fieldCode: "attachmentName" },
        { fieldCode: "remark" },
        { fieldCode: "realName" },
        { fieldCode: "uploadDate" },
        // {
        //   fieldCode: "attachmentUrl",
        //   render: (_, record) =>
        //     <srm-button size="mid" type="primary" plain onClick={() => {
        //       SrmUtil.previewFile({
        //         fileName: record.attachmentName,
        //         fileUrl: record.attachmentUrl,
        //         bucketName: SrmUtil.getDefaultBucketName(),
        //       });
        //     }}>{this.$T("hzero.common.button.view").$D("查看")}</srm-button>,
        // },
        {
          fieldCode: "attachmentUrl",
          render: (_, record) => <srm-button size="mid" type="primary" plain onClick={() => {
            this.$downloadFile(record.attachmentUrl);
          }}>{this.$T("smbl.common.view.button.download").$D("下载")}</srm-button>,
        }
      ];
    },
  }
};
</script>