import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import SrmAppCore from "srm-front-app-core";
import { isEmpty } from "lodash";
import { toBeSubmittedDs } from "../../CUX/GEISHI_MyOrder/dataSource/index";
import { STATUS_COLOR_MAP } from "../../OrderWorkbench/components/utils/index";
import CreateDocumnet from "../../CUX/GEISHI_MyOrder/views/CreateDocumnet.vue";
import { reSyncBatch } from "../../CUX/GEISHI_MyOrder/api/index";

const getVal = (val) => (typeof val === "string" && val.length ? val : null);

// 处理筛选参数
const beforeQuery = (ds, params) => {
  const { tempKey } = params;
  if (tempKey) {
    const [supplierId, supplierCompanyId] = tempKey.split("-");
    params["supplierId"] = getVal(supplierId);
    params["supplierCompanyId"] = getVal(supplierCompanyId);
  }
};

// 待签署-五菱项目埋点
function underSignDs() {
  return {
    autoQuery: false,
    selection: 20,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    // filterCustomizeCode: getFilterCode(type),
    queryParameter: {
      customizeUnitCode: "SODR.WORKSPACE_TOBESIGNED.LIST",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    enableSelect: (item) =>
      item.dataSet.selection === item.dataSet.selected.length
        ? item.dataSet.selected.includes(item)
        : true,
    fastQueryField: {
      fieldCode: "multiPoNum",
      fieldType: "TEXT",
      fieldName: $T("sodr.workspace.model.common.orderNum").$D("订单编号"),
    },
    events: {
      beforeQuery,
    },
    transport: {
      read: {
        method: "get",
        url: "/spuc/v1/{tenantId}/po-header-signs",
      },
    },
  };
}

//为啥不放在methods里面？ 如果所有的二开方法都写入methods，也就是说即使这个二开方法不使用，仍然会全部被加载到当前实例里面，会增大性能消耗，放在此处
// 需要的时候，在以约定的命名规则动态挂载的当前实例，以供使用；方法命名规则租户编码+原方法名称 驼峰
function wulingHandleSigncolumns(vue) {
  if (vue.currentTab === "wulingSign") {
    return [
      {
        fieldCode: "displayPoNum",
        fieldType: "EMPTY",
        render: (val, item) => (
          <SrmListHeader>
            <span>{item.displayPoNum}</span>
            <SrmButton
              rect
              plain
              slot="right"
              style={{ fontWeight: "bold" }}
              type="warn"
            >
              待签署
            </SrmButton>
          </SrmListHeader>
        ),
      },
      {
        fieldCode: "custItemName",
        fieldName: $T("").$D("标的/项目名称"),
        render: (val, item) =>
          item.sourceCode === "SRM" ? (
            <span>物料及耗材一批</span>
          ) : (
            item.attributeLongtext11
          ),
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("").$D("币种"),
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("").$D("供应商"),
      },
      {
        fieldCode: "agentName",
        fieldName: $T("").$D("采购员"),
      },
      {
        fieldCode: "amount",
        fieldName: $T("").$D("不含税统计"),
      },
      {
        fieldCode: "approvedDate",
        fieldName: $T("").$D("审批完成时间"),
        render: (val, item) =>
          item.sourceCode === "SRM" ? item.submittedDate : item.erpCreationDate,
      },
    ];
  }
}

function wulingBefotMount(vue) {
  vue.currentTabIdx = 3;
  vue.currentTab = "wulingSign";
  vue.dataSet = { ...vue.dataSet, wulingSign: new DataSet(underSignDs()) }; // 五菱项目ds
  vue.tabs.splice(3, 0, {
    label: "待签署",
    code: "wulingSign",
  }); // 在指定位置插入元素
}

function wulingBottomRender(vue) {
  const { dataSet, currentTab } = vue;
  const { wulingSign } = dataSet;
  const { selection, selected, records, totalCount } = wulingSign || {};
  const showSelectAll = currentTab !== "wulingSign";
  let selectAllFlag =
    (selection === selected.length || selected.length === records.length) &&
    selected.length > 0;
  vue.showSelectAll = showSelectAll;
  if (showSelectAll) {
    return null;
  }
  function selectAll(val) {
    if (val) {
      let shouldSelectLength = selection - selected.length;
      if (shouldSelectLength > 0) {
        for (const item of records) {
          const index = selected.indexOf(item);
          if (index < 0) {
            wulingSign.select(item);
            shouldSelectLength = shouldSelectLength - 1;
          }
          selectAllFlag = selection === selected.length;
          if (shouldSelectLength === 0) {
            break;
          }
        }
      }
    } else {
      wulingSign.unSelectAll();
    }
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <SrmCheckbox
        style={{ marginRight: "8px" }}
        value={selectAllFlag}
        cancelable
        onInput={selectAll}
        contentSelectable
      >
        <div>全选</div>
      </SrmCheckbox>
      {selected.length}/{totalCount}
    </div>
  );
}

/**
 * 盖世相关埋点
 */
function gaishiBefotMount(vue) {
  vue.visibleFlag = true;
  vue.currentTab = "toBeSubmitted";
  vue.dataSet = {
    ...vue.dataSet,
    toBeSubmitted: new DataSet(toBeSubmittedDs("toBeSubmitted")),
  };
  vue.tabs.unshift({
    label: $T("sodr.workspace.view.tabPane.toBeSubmitted").$D("待提交"),
    code: "toBeSubmitted",
  }); // 在指定位置插入元素
}

function gaishiHandleSigncolumns(vue) {
  if (vue.currentTab === "toBeSubmitted") {
    return [
      {
        fieldCode: "displayPoNum",
        fieldType: "EMPTY",
        render: (val, item) => {
          const statusCode = item.statusCode;
          return (
            <SrmListHeader>
              <span>{item.displayPoNum}</span>
              <SrmButton
                rect
                plain
                slot="right"
                style={{ fontWeight: "bold" }}
                type={STATUS_COLOR_MAP[statusCode]}
              >
                {item.statusCodeMeaning}
              </SrmButton>
            </SrmListHeader>
          );
        },
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
      },
      {
        fieldCode: "agentName",
        fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldName: $T("sodr.workspace.model.common.taxIncludeAmount").$D(
          "总金额(含税)",
        ),
      },
      {
        fieldCode: "amount",
        fieldName: $T("sodr.workspace.model.common.amount").$D(
          "总金额(不含税)",
        ),
      },
      {
        fieldCode: "erpCreatedName",
        fieldName: $T("sodr.workspace.model.common.realName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("sodr.workspace.model.common.creationTime").$D(
          "创建时间",
        ),
      },
    ];
  }
}

function gaishiGetBottomButtons(vue) {
  const disabledResync = vue.getCurrentDs.selected.every(
    (i) => i.data.exportErpFlag === "FAIL" || i.data.syncStatus === "FAIL",
  );
  return [
    {
      title: $T("sodr.workspace.model.receivedOrder.create.document").$D(
        "引用单据创建",
      ),
      // eslint-disable-next-line no-return-assign
      handler: () => {
        vue.$router.push({
          name: "CreateDocumnet",
        });
      },
    },
    {
      type: "success",
      disabled: isEmpty(vue.getCurrentDs.selected) || !disabledResync,
      title: $T(
        "sodr.workspace.model.receivedOrder.create.resynchronize",
      ).$D("重新同步"),
      handler: async () => {
        const { selected } = vue.getCurrentDs;
        const selectedData = selected.map((i) => {
          return i.data;
        });
        console.log("selectedData", selectedData);
        const res = await reSyncBatch({
          data: selectedData,
        });
        if (res && res.failed) {
          vue.$notification.open({
            message: res.message,
          });
        } else {
          vue.getCurrentDs.query();
          vue.$notification.open({
            message: $T("sodr.workspace.view.message.resyncLoadingTip").$D(
              "正在重新同步订单数据，请稍后查看同步状态布",
            ),
          });
        }
      },
    },
  ];
}

function gaishiGetAllDs() {
  return {
    editable: true,
  };
}

//定义方法映射关系
const cuxFunctions = {
  "SRM-WULING": {
    befotMount: wulingBefotMount,
    handleGetcolumns: wulingHandleSigncolumns,
    bottomRender: wulingBottomRender,
  },
  "SRM-GAISHI": {
    befotMount: gaishiBefotMount,
    handleGetcolumns: gaishiHandleSigncolumns,
    getBottomButtons: gaishiGetBottomButtons,
    getAllDs: gaishiGetAllDs,
  },
};

export default {
  data() {
    return {};
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};
