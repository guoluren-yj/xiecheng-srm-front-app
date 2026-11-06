// 行列表
import { SrmUtil, $T } from "srm-mobile-ui";
import StatusTag from "@/components/StatusTag";
import ListHeader from "@/components/ListHeader";

// changeState说明：0-无变更；1-变更后；2-变更前；
// 没有变更显示黑色，变更后红色，变更前黄色；通过按钮进行切换；有变更默认显示变更后
function changeStateColor(item, fieldCode) {
    // 0无变更
    if (item.changeState === 0) {
        return {
            value: item[fieldCode],
        };
    }
    // 如果changeFiledMap表不存在，默认无变更
    if (!item.changeFiledMap) {
        return {
            value: item[fieldCode],
        };
    }
    let beforeChangeValue = item.changeFiledMap[fieldCode];
    // 如果变更前字段值未定义，视为未变更该字段
    if (typeof beforeChangeValue === "undefined") {
        return {
            value: item[fieldCode],
        };
    }
    // 变更后红色
    if (item.changeState === 1) {
        return {
            color: "var(--color-danger)",
            value: item[fieldCode],
        };
    }
    // 变更前黄色
    return {
        color: "var(--color-warn)",
        value: item.changeFiledMap[fieldCode],
    };
}

// type: 国际化的类型。COUNT：数量；PRICE：价格；金额：AMOUNT；
function changeStateRender(
    item,
    fieldCode,
    fieldName,
    type = "NONE",
    precision
) {
    // state：需要显示的颜色、显示的值
    let state = changeStateColor(item, fieldCode);
    let displayValue = state.value;
    // 是否是价格隐藏，如果是价格隐藏，强制将显示值改为meaning
    let priceHidden = item.linePriceHiddenFlag === 1;
    if (type === "PRICE" || type === "AMOUNT") {
        if (priceHidden) {
            displayValue = item[`${fieldCode}Meaning`];
        }
    }
    if (type === "COUNT") {
        displayValue = SrmUtil.getNumberLocalized(displayValue);
    } else if (type === "PRICE" && !priceHidden) {
        if (precision && item.prSourcePlatform === "SRM") {
            displayValue = SrmUtil.getNumberLocalized(displayValue, item[precision]);
        } else {
            displayValue = SrmUtil.getNumberLocalized(displayValue);
        }
        displayValue = displayValue ? Number(String(displayValue).replace(/,/g, "")) : displayValue;
    } else if (type === "AMOUNT" && !priceHidden) {
        // 仅SRM来源需要金额精度
        if (precision && item.prSourcePlatform === "SRM") {
            displayValue = SrmUtil.getNumberLocalized(displayValue, item[precision]);
        } else {
            displayValue = SrmUtil.getNumberLocalized(displayValue);
        }
    }
    if (displayValue === 0) {
        return (
            <span>
                <span style={{ color: "var(--font-color-field2)" }}>{fieldName}</span>：
                <span style={{ color: state.color }}>{displayValue}</span>
            </span>
        );
    }
    if (!fieldName) {
        return (
            <span
                style={{
                    color: state.color,
                }}
            >
                {displayValue}
            </span>
        );
    }
    return (
        <span>
            <span style={{ color: "var(--font-color-field2)" }}>{fieldName}</span>：
            <span style={{ color: state.color }}>{displayValue || "-"}</span>
        </span>
    );
}

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

function taskDs(projectId, projectReqId, reqType) {
    const customizeUnitCodeObj = {
        create: 'SIEC.PROJECT_READ.COST_LIST',
        change: 'SIEC.PROJECT_CHANGE.TASK',
        others: 'SIEC.PROJECT_OTHER_TYPE.COST_LIST'
    }
    return {
        autoQuery: true,
        paging: false,
        editable: false,
        editFlag: false,
        enableQuery: false,
        data: [],
        showTotalCount: false,
        queryParameter: {
            customizeUnitCode: customizeUnitCodeObj[reqType],
        },
        fields: [
            {
                fieldCode: "level",
                fieldType: "EMPTY",
                fieldName: $T("sprm.project.model.common.level").$D("层级"),

            },
            {
                fieldCode: "taskNum",
                fieldName: $T("sprm.project.model.common.taskNum").$D("任务编号"),
            },
            {
                fieldCode: "taskName",
                fieldName: $T("sprm.project.model.common.taskName").$D("任务名称"),
            },
            {
                fieldCode: "cancelStatus",
                lookupCode: 'SIEC.PROJECT_TASK_CANCEL_STATUS',
                fieldName: $T("hzero.common.status").$D("状态"),
            },
            {
                fieldCode: "principalUserId",
                lookupCode: 'SSRC.PREQUAL_USER',
                fieldName: $T("sprm.project.model.common.principalUserId").$D("负责人"),
            },
            {
                fieldCode: "budgetAmount",
                lookupCode: 'NUMBER',
                fieldName: $T("sprm.common.project.budgetAmount").$D("预算金额"),
            },
            {
                fieldCode: "taskExplanation",
                lookupCode: 'NUMBER',
                fieldName: $T("sprm.project.model.common.taskExplanation").$D("任务说明"),
            },
        ],
        transport: {
            read: {
                url: reqType !== 'change' ? `/siec/v1/${SrmUtil.getTenantId()}/project-task/${projectId}` : `/siec/v1/${SrmUtil.getTenantId()}/project-task/req/${projectReqId}`,
                method: "get",
            },
        },
    };
}

function purListDs(projectId, projectReqId, reqType) {
    const customizeUnitCodeObj = {
        create: 'SIEC.PROJECT_READ.PUR_LIST',
        change: 'SIEC.PROJECT_CHANGE.PUR_LIST',
        others: 'SIEC.PROJECT_OTHER_TYPE.PUR_LIST'
    }
    return {
        autoQuery: true,
        pageSize: 5,
        editable: false,
        editFlag: false,
        enableQuery: false,
        data: [],
        showTotalCount: false,
        queryParameter: {
            projectId,
            projectReqHeaderId: projectReqId,
            customizeUnitCode: customizeUnitCodeObj[reqType],
        },
        bodyParameter: {
            projectId, projectReqHeaderId: projectReqId, customizeUnitCode: customizeUnitCodeObj[reqType]
        },
        fields: [
            {
                fieldCode: "virtualLineNum",
                fieldType: "EMPTY",
                fieldName: $T("sprm.common.model.common.lineNumber").$D("行号"),

            },
            {
                fieldCode: "cancelStatus",
                fieldName: $T("hzero.common.status").$D("状态"),
            },
            {
                fieldCode: "itemCode",
                fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
            },
            {
                fieldCode: "itemName",
                fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
            },
            {
                fieldCode: "categoryName",
                fieldName: $T("sprm.common.model.common.categoryName").$D("物料分类"),
            },
            {
                fieldCode: "model",
                fieldName: $T("sprm.common.model.common.itemModel").$D("型号"),
            },
            {
                fieldCode: "specifications",
                fieldName: $T("sprm.common.model.common.itemSpecs").$D("规格"),
            },
            {
                fieldCode: "demandDate",
                fieldType: "DATE",
                fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
            },
            {
                fieldCode: "quantity",
                fieldType: "NUMBER",
                fieldName: $T(`sprm.common.model.common.purchaseQuantity`).$D("数量"),
            },
            {
                fieldCode: "estimatedUnitPrice",
                fieldType: "NUMBER",
                fieldName: $T(`sprm.project.model.common.secondaryTaxInUnitPrice`).$D("预估单价(含税)"),
            },
            {
                fieldCode: "estimatedLineAmount",
                fieldType: "NUMBER",
                fieldName: $T(`sprm.common.model.common.taxIncludedLineAmount`).$D("行金额"),
            },
            {
                fieldCode: "level",
                fieldName: $T("sprm.project.model.common.level").$D("层级"),
            },
            {
                fieldCode: "taskNum",
                fieldName: $T("sprm.project.model.common.taskNum").$D("任务编号"),
            },
            {
                fieldCode: "uomName",
                fieldName: $T("sprm.common.model.common.secondaryUomId").$D("单位"),
            },
            {
                fieldCode: "sourceDocument",
                fieldName: $T("sprm.common.model.common.sourceDocumentAndLineNum").$D("来源单号-行号"),
            },
            {
                fieldCode: "remark",
                fieldName: $T("sprm.common.model.common.remark").$D("备注"),
            },
        ],
        transport: {
            read: {
                url: reqType !== 'change' ? `/siec/v1/${SrmUtil.getTenantId()}/project-task/purchase-item/query` : `/siec/v1/${SrmUtil.getTenantId()}/project-task/req/purchase-item/query`,
                method: "POST",
            },
        },
    };
}

function supplierDs(projectId, projectReqId, reqType) {
    const customizeUnitCodeObj = {
        create: 'SIEC.PROJECT_READ.PUR_LIST',
        change: 'SIEC.PROJECT_CHANGE.SUPPLIER',
        others: 'SIEC.PROJECT_OTHER_TYPE.SUPPLIER'
    }
    return {
        autoQuery: true,
        pageSize: 5,
        editable: false,
        editFlag: false,
        enableQuery: false,
        data: [],
        showTotalCount: true,
        queryParameter: {
            customizeUnitCode: customizeUnitCodeObj[reqType],
        },
        fields: [
            {
                fieldCode: "supplierCompanyCode",
                fieldName: $T("entity.supplier.supplierCompanyNum").$D("供应商编码"),
            },
            {
                fieldCode: "displaySupplierName",
                fieldName: $T("sprm.project.model.common.displaySupplierName").$D("供应商名称"),
            },
            {
                fieldCode: 'contact',
                fieldName: $T("hzero.common.roles.contacts").$D("联系人"),
            },
            {
                fieldCode: "internationalTelCode",
                fieldName: $T("sprm.common.model.common.internationalTelCode").$D("国别码"),
            },
            {
                fieldCode: 'contactPhone',
                fieldName: $T("sprm.project.model.common.contactPhone").$D("联系电话"),
            },
            {
                fieldCode: "contactEmail",
                fieldName: $T("sprm.project.model.common.contactEmail").$D("联系人邮箱"),
            }
        ],
        transport: {
            read: {
                // ${SRM_SIEC}/v1/${organizationId}/project-task/purchase-item/query
                url: reqType !== 'change' ? `/siec/v1/${SrmUtil.getTenantId()}/project/${projectId}/supplier/query` : `/siec/v1/${SrmUtil.getTenantId()}/project-req/${projectReqId}/supplier/query`,
                method: "POST",
                data: { projectId, projectReqHeaderId: projectReqId, customizeUnitCode: customizeUnitCodeObj[reqType] }
            },
        },
    };
}

const benefitEstimationDs = (projectId, projectReqId, reqType) => ({
    pageSize: 5,
    dataToJSON: 'all',
    autoQuery: true,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
        {
            fieldCode: "benefitIndex",
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.benefitIndex").$D(
                "效益指标"
            ),
            render: (val, item) => {
                return (
                    <ListHeader showTitle>
                        <span>{item.benefitIndexMeaning || item.benefitIndex}</span>
                    </ListHeader>
                );
            },
        },
        {
            fieldCode: "indexType",
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.indexType").$D("指标类型"),
            render: (val, item) => item.indexTypeMeaning || item.indexType
        },
        {
            fieldCode: "isCoreIndex",
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.isCoreIndex").$D("是否核心指标"),
            render: (val) => {
                if (val === null || val === "" || typeof val === "undefined") {
                    return val;
                }
                return val ?
                    $T("smbl.common.view.yes").$D("是") :
                    $T("smbl.common.view.no").$D("否");
            },
        },
        {
            fieldCode: "historyActivityReference",
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.historyActivityReference").$D("历史活动参考"),

        },
        {
            fieldCode: 'historyExpenses',
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.historyExpenses").$D("历史花费（元）"),
        },
        {
            fieldCode: 'historyBenefitReachSituation',
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.historyBenefitReachSituation").$D("历史效益达成情况"),
        },
        {
            fieldCode: 'thisExpenses',
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.thisExpenses").$D("本次花费（元）"),
        },
        {
            fieldCode: 'thisBenefitEvaluation',
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.thisBenefitEvaluation").$D("本次效益预估"),
        },
        {
            fieldCode: 'remark',
            fieldType: "TEXT",
            fieldName: $T("scux.shiyue.modal.benefitEstimation.remark").$D("备注"),
        },
    ],
    queryParameter: {
        projectId,
        projectReqHeaderId: projectReqId,
    },
    bodyParameter: {
        projectId, projectReqHeaderId: projectReqId,
        operationType: reqType === 'create' ? '1' : '2',
    },
    transport: {
        read: {
            url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/XMpWsAMRpicRnMbHgdRmIuRJTiaGwh2Mfa4nmg4q4XNgT3c4wSEGKiaSChEabK7ltuy`,
            method: "POST",
        },
    },
});

//
const benefitReviewDs = (projectId, projectReqId, reqType) => {
    return {
        pageSize: 5,
        dataToJSON: 'all',
        autoQuery: true,
        editable: false,
        editFlag: false,
        enableQuery: false,
        fields: [
            {
                fieldCode: 'benefitIndex',
                fieldType: "TEXT",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.benefitIndex").$D("效益指标"),
                render: (val, item) => {
                    return (
                        <ListHeader showTitle>
                            <span>{item.benefitIndexMeaning || item.benefitIndex}</span>
                        </ListHeader>
                    );
                },
            },
            {
                fieldCode: 'indexType',
                fieldType: "TEXT",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.indexType").$D("本次效益预估"),
                render: (val, item) => item.indexTypeMeaning || item.indexType
            },
            {
                fieldCode: 'isCoreIndex',
                fieldType: "TEXT",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.isCoreIndex").$D("是否核心指标"),
                render: (val) => {
                    if (val === null || val === "" || typeof val === "undefined") {
                        return val;
                    }
                    return val ?
                        $T("smbl.common.view.yes").$D("是") :
                        $T("smbl.common.view.no").$D("否");
                },
            },
            {
                fieldCode: 'evaluation',
                fieldType: "NUMBER",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.evaluation").$D("预估数据"),
            },
            {
                fieldCode: 'actual',
                fieldType: "NUMBER",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.actual").$D("实际数据"),
            },
            {
                fieldCode: 'difference',
                fieldType: "NUMBER",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.difference").$D("差异"),
            },
            {
                fieldCode: 'differenceReasons',
                fieldType: "TEXT",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.differenceReasons").$D("差异原因"),
            },
            {
                fieldCode: 'reachSituation',
                fieldType: "TEXT",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.reachSituation").$D("达成情况"),
            },
            {
                fieldCode: 'remark',
                fieldType: "TEXT",
                fieldName: $T("scux.shiyue.modal.benefitEstimation.remark").$D("备注"),
            },
        ],
        queryParameter: {
            projectId,
            projectReqHeaderId: projectReqId,
        },
        bodyParameter: {
            projectId, projectReqHeaderId: projectReqId,
            operationType: reqType === 'create' ? '1' : '2',
        },
        transport: {

            read: {
                url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/XMpWsAMRpicRnMbHgdRmIuauXw1UTtfsJnacSiab8DNpITiahDph05Jw6ZvrFaHxk0u`,
                method: "POST",
            },
        },
    }
};

export { taskDs, purListDs, supplierDs, benefitReviewDs, benefitEstimationDs };
