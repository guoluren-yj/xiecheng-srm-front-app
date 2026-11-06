// 行列表
import { SrmUtil, $T } from "srm-mobile-ui";

export const getStatusColor = (value) => {
    if (["REJECTED", "SEND_BACK", "CANCELLED", "CLOSED"].includes(value)) {
        return "red";
    } else if (
        ["SUBMIT_SYNC", "EXCUTED", "ASSIGNED", "APPROVED", "SUBMITTED", "FINISHED"].includes(value)
    ) {
        return "green";
    }
    return "yellow";

};


function listDs(budgetHeaderId, budgetTemplateCode) {
    return {
        autoQuery: true,
        editable: false,
        enableQuery: false,
        editFlag: false,
        showTotalCount: false,
        data: [],
        pageSize: 5,
        fields: [
            {
                fieldCode: "errorFlag",
                fieldName: $T(`sbdm.common.model.common.validResult`).$D("校验结果"),

            },
            {
                fieldCode: "lineNum",
                fieldName: $T(`sbdm.common.model.common.budgetLineNum`).$D("预算行号"),
            },
            {
                fieldCode: "budgetLineDesc",
                fieldName: $T(`sbdm.common.model.common.budgetDesc`).$D("预算说明"),
            },
            {
                fieldCode: "budgetLineStatus",
                fieldName: $T(`sbdm.common.model.common.status`).$D("状态"),
            },
            {
                fieldCode: "origBudgetAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.origBudgetAmount`).$D("预算总额"),
            },
            {
                fieldCode: "occupiedAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.occupiedAmount`).$D("已占用金额"),
            },
            {
                fieldCode: "appliedAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.appliedAmount`).$D("已核销金额"),
            },
            {
                fieldCode: "budgetBalanceAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.budgetBalanceAmount`).$D("预算余额"),
            },
            {
                fieldCode: "currencyCode",
                fieldName: $T(`sbdm.common.model.common.currencyCode`).$D("币种"),
            },
            {
                fieldCode: "adjustAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.adjustAmount`).$D("调整金额"),
            },
            {
                fieldCode: "adjustedAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.adjustedAmount`).$D("调整后金额"),
            },
        ],
        queryParameter: {
            budgetHeaderId,
            budgetTemplateCode,
        },
        transport: {
            read: {
                url: `/sbdm/v1/${SrmUtil.getTenantId()}/budget-line/detail?budgetHeaderId=${budgetHeaderId}&budgetTemplateCode=${budgetTemplateCode}`,
                method: "get",
            },
        },
    };
}

function occupiedListDs(budgetLineId, othersParams) {
    return {
        autoQuery: false,
        editable: false,
        enableQuery: false,
        editFlag: false,
        showTotalCount: false,
        data: [],
        pageSize: 5,
        fields: [
            {
                fieldCode: "documentNum",
                fieldName: $T(`sbdm.common.model.common.documentNum`).$D("据编码-行号"),

            },
            {
                fieldCode: "documentTypeMeaning",
                fieldName: $T(`sbdm.common.model.common.documentType`).$D("单据类型"),
            },
            {
                fieldCode: "documentDate",
                fieldName: $T(`sbdm.common.model.common.documentDate`).$D("占用时间"),
            },
            {
                fieldCode: "amount",
                fieldName: $T(`sbdm.common.model.common.occupiedOrAppliedAmount`).$D("占用/核销金额"),
            },
            {
                fieldCode: "incomingIdentityMeaning",
                fieldName: $T(`sbdm.common.model.common.incomingIdentityMeaning`).$D("传入标识"),
            },
            {
                fieldCode: "lotNum",
                fieldName: $T(`sbdm.common.model.common.lotNum`).$D("批次编码"),
            },
            {
                fieldCode: "parentDocumentNum",
                fieldName: $T(`sbdm.common.model.common.parentDocumentNum`).$D("上游单据编码"),
            },
            {
                fieldCode: "operatorName",
                fieldName: $T(`sbdm.common.model.common.parentDocumentNum`).$D("上游单据编码"),
            },
            {
                fieldCode: "origBudgetAmount",
                fieldType: 'NUMBER',
                fieldName: $T(`sbdm.common.model.common.operatorName`).$D("操作人"),
            },
        ],
        queryParameter: {
            budgetLineId,
            ...(othersParams || {})
        },
        transport: {
            read: {
                url: `/sbdm/v1/${SrmUtil.getTenantId()}/budget-line/occupy-detail-view/${budgetLineId}`,
                method: "get",
            },
        },
    };
}

export { listDs, occupiedListDs };
