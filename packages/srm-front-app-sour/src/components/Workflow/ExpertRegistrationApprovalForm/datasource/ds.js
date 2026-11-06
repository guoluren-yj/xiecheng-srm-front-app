
import { $T } from "srm-mobile-ui";
import { yesOrNoRenderer } from "@/utils/renderer.js";

const promptCode = "ssrc.expert";

const commonConfig = {
  autoQuery: false,
  editable: false,
  paging: false,
  enableQuery: false,
};

// 基本信息
function basicInfoDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "expertName",
        fieldType: "EMPTY",
        render: (val) =>
          <SrmListHeader>
            {$T(`${promptCode}.model.expert.name`).$D("姓名")}: <span>{val}</span>
          </SrmListHeader>
      },
      {
        fieldCode: "genderMeaning",
        fieldType: "TEXT",
        fieldName: $T(`${promptCode}.model.expert.gender`).$D("性别"),
      },
      {
        fieldCode: "birthday",
        fieldName: $T(`${promptCode}.model.expert.birthday`).$D("出生日期"),
      },
      {
        fieldCode: "expertLevelMeaning",
        fieldName: $T(`${promptCode}.model.expert.expertLevel`).$D("专家级别"),
      },
      {
        fieldCode: "expertTypeMeaning",
        fieldName: $T(`${promptCode}.model.expert.expertType`).$D("专家类型"),
      },
      {
        fieldCode: "expertCategoryMeaning",
        fieldName: $T(`${promptCode}.model.expert.expertCategory`).$D("专家类别"),
      },
      {
        fieldCode: "telephone",
        fieldName: $T(`${promptCode}.model.expert.telephone`).$D("固定电话"),
      },
      {
        fieldCode: "mobilephone",
        fieldName: $T(`${promptCode}.model.expert.mobilephone`).$D("移动电话"),
      },
      {
        fieldCode: "mail",
        fieldName: $T(`${promptCode}.model.expert.mail`).$D("邮箱"),
      },
      {
        fieldCode: "countryName",
        fieldName: $T(`${promptCode}.model.expert.country`).$D("国家"),
      },
      {
        fieldCode: "provinceCityName",
        fieldName: $T(`${promptCode}.model.expert.provinceAndCity`).$D("省/市"),
      },
      {
        fieldCode: "idTypeMeaning",
        fieldName: $T(`${promptCode}.model.expert.idType`).$D("证件类型"),
      },
      {
        fieldCode: "idNumber",
        fieldName: $T(`${promptCode}.model.expert.idNumber`).$D("证件号码"),
      },
      {
        fieldCode: "loginName",
        fieldName: $T(`${promptCode}.model.expert.subAccount`).$D("子账户"),
      },
      {
        fieldCode: "registeredDate",
        fieldName: $T(`${promptCode}.model.expert.registeredDate`).$D("注册日期"),
      },
      {
        fieldCode: "remark",
        fieldName: $T(`${promptCode}.model.expert.remark`).$D("备注"),
      },
    ],
  };
}

// 专业领域
function fieldTableDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "fieldCode",
        fieldName: $T(`${promptCode}.view.message.tab.fieldTable`).$D("专业领域"),
      },
      {
        fieldCode: "fieldCodeMeaning",
        fieldName: $T(`${promptCode}.model.expert.fieldCodeMeaning`).$D("领域名称"),
      },
      {
        fieldCode: "firstFieldFlag",
        fieldName: $T(`${promptCode}.model.expert.firstFieldFlag`).$D("首要专精"),
        render: yesOrNoRenderer,
      },
    ],
  };
}

// 专业成果
function achievementTableDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "achvRemark",
        fieldName: $T(`${promptCode}.view.message.tab.achievementTable`).$D("专业成果"),
      },
      {
        fieldCode: "achvAttachmentUuid",
        fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
        fieldType: "UPLOAD",
        showCount: true,
      },
    ],
  };
}

// 职业履历
function careerPortfolioTableDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "startDate",
        fieldName: $T(`${promptCode}.model.expert.startDate`).$D("时间从"),
      },
      {
        fieldCode: "endDate",
        fieldName: $T(`${promptCode}.model.expert.endDate`).$D("时间至"),
      },
      {
        fieldCode: "workUnit",
        fieldName: $T(`${promptCode}.model.expert.workUnit`).$D("工作单位"),
      },
      {
        fieldCode: "position",
        fieldName: $T(`${promptCode}.model.expert.position`).$D("职位"),
      },
      {
        fieldCode: "highestDegree",
        fieldName: $T(`${promptCode}.model.expert.professionalTitle`).$D("职称"),
      },
    ],
  };
}

// 教育经历
function eduExperienceTableDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "startDate",
        fieldName: $T(`${promptCode}.model.expert.startDate`).$D("时间从"),
      },
      {
        fieldCode: "endDate",
        fieldName: $T(`${promptCode}.model.expert.endDate`).$D("时间至"),
      },
      {
        fieldCode: "educationInstitution",
        fieldName: $T(`${promptCode}.model.expert.educationInstitution`).$D("学校学院或其他机构"),
      },
      {
        fieldCode: "educationExperience",
        fieldName: $T(`${promptCode}.model.expert.educationExperience`).$D("教育经历"),
      },
      {
        fieldCode: "degree",
        fieldName: $T(`${promptCode}.model.expert.degree`).$D("学位"),
      },
      {
        fieldCode: "certificateLicense",
        fieldName: $T(`${promptCode}.model.expert.certificateLicense`).$D("执照、许可或资格"),
      },
      {
        fieldCode: "certificateNum",
        fieldName: $T(`${promptCode}.model.expert.certificateNum`).$D("证书编号"),
      },
      {
        fieldCode: "highestDegree",
        fieldName: $T(`${promptCode}.model.expert.highestDegree`).$D("最高学历"),
      },
    ]
  };
}

// 银行信息
function bankInfoTableDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "bankCode",
        fieldName: $T(`${promptCode}.model.expert.bankCode`).$D("银行代码"),
      },
      {
        fieldCode: "bankName",
        fieldName: $T(`${promptCode}.model.expert.bankName`).$D("银行名称"),
      },
      {
        fieldCode: "bankFirm",
        fieldName: $T(`${promptCode}.model.expert.bankFirmMeaning`).$D("联行行号"),
      },
      {
        fieldCode: "bankBranchName",
        fieldName: $T(`${promptCode}.model.expert.bankBranchName`).$D("开户行名称"),
      },
      {
        fieldCode: "bankAccountName",
        fieldName: $T(`${promptCode}.model.expert.bankAccountName`).$D("账户名称"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldName: $T(`${promptCode}.model.expert.bankAccountNum`).$D("银行账户"),
      },
      {
        fieldCode: "masterFlag",
        fieldName: $T(`${promptCode}.model.expert.masterFlag`).$D("主账户"),
        render: yesOrNoRenderer,
      },
      {
        fieldCode: "enabledFlag",
        fieldName: $T(`${promptCode}.model.expert.enabledFlag`).$D("启用"),
        render: yesOrNoRenderer,
      },
      {
        fieldCode: "remark",
        fieldName: $T(`${promptCode}.model.expert.remark`).$D("备注"),
      }
    ]
  };
}

// 附件列表
function attachmentTableDS() {
  return {
    ...commonConfig,
    fields: [
      {
        fieldCode: "attachmentName",
        fieldName: $T(`${promptCode}.model.expert.attachment.name`).$D("附件名称"),
      },
      {
        fieldCode: "remark",
        fieldName: $T(`${promptCode}.model.expert.attachment.remark`).$D("附件说明"),
      },
      {
        fieldCode: "realName",
        fieldName: $T(`${promptCode}.model.expert.realName`).$D("上传人"),
      },
      {
        fieldCode: "uploadDate",
        fieldName: $T(`${promptCode}.model.expert.uploadDate`).$D("上传时间"),
      },
      {
        fieldCode: "attachmentUrl",
        fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
      }
    ]
  };
}

export {
  basicInfoDS,
  fieldTableDS,
  achievementTableDS,
  careerPortfolioTableDS,
  eduExperienceTableDS,
  bankInfoTableDS,
  attachmentTableDS
};