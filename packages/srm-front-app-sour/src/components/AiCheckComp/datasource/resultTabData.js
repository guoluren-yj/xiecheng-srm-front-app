import { $T } from "srm-mobile-ui";

export function resultTableDS() {
  return {
    transport: {},
    selection: Infinity,
    enableQuery: false,
    paging: false,
    primaryKey: "recordId",
    fields: [
      {
        fieldCode: "headerRow",
        fieldType: "string",
      },
      {
        fieldName: $T("smbl.checkRules.model.checkStatus").$D("审核状态"),
        fieldCode: "approveStatus",
        fieldType: "string",
      },
      {
        fieldName: $T("smbl.checkRules.model.ruleName").$D("审核规则名称"),
        fieldCode: "ruleName",
        fieldType: "string",
      },
      {
        fieldName: $T("smbl.checkRules.model.checkScope").$D("审核范围"),
        fieldCode: "displayName",
        fieldType: "string",
      },
      {
        fieldName: $T("smbl.checkRules.model.ruleStrength").$D("规则强度"),
        fieldCode: "ruleControlStrategy",
        fieldType: "string",
      },
      {
        fieldName: $T("smbl.checkRules.model.ruleRequirements").$D("规则要求"),
        fieldCode: "ruleDetail",
        fieldType: "string",
      },
      {
        fieldName: $T("smbl.checkRules.model.matchResult").$D("匹配结果"),
        fieldCode: "executeResult",
        fieldType: "string",
      },
    ],
    events: {},
  };
}
