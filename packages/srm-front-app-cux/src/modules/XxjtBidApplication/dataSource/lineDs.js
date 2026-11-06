import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    // queryParameter: {
    //   ...params
    // },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.targetClass"
        ).$D("标的分级"),
        fieldCode: "targetClassMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.targetClassScope"
        ).$D("分级适用范围"),
        fieldCode: "targetClassScope",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.professQualification"
        ).$D("专业资质"),
        fieldCode: "professQualification",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.lastYearRevenue"
        ).$D("上年营业收入大于等于(万元)"),
        fieldCode: "lastYearRevenue",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.achievement"
        ).$D("近三年业绩数量"),
        fieldCode: "achievement",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.registeredCapital"
        ).$D("注册资金(万元)"),
        fieldCode: "registeredCapital",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.industryRanking"
        ).$D("行业排名"),
        fieldCode: "industryRanking",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.enterpriseNature"
        ).$D("企业性质"),
        fieldCode: "enterpriseNatureMeaning",
        fieldType: "TEXT",
      },
      {
        fieldName: $T(
          "scux.bidApplication.model.bidApplication.enterpriseCertification"
        ).$D("体系认证"),
        fieldCode: "enterpriseCertificationMeaning",
        fieldType: "TEXT",
      },
    ],
    // transport: {
    //   read: {
    //     url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/judq9RDFJl0tISzwTN1mq4clicACBFRUMgKib6F2ylRhA?targetInfoId={targetInfoId}&targetCode={targetCode}`,
    //     method: "get",
    //   },
    // },
  };
}

export { lineInfoDs };
