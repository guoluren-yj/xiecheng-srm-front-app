import SrmAppCore from "srm-front-app-core";
import { $T, http, SrmUtil } from "srm-mobile-ui";
import { debounce } from "lodash";
import RichText from '@/components/RichText.vue';
//基于为收货的数据新建收货单-批量提交
export const httpReject = (body) => {
  const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/wIS3apRZEic32lJwVWyJdLvk2I57qictiaDeJrgetzX89E`;
  return http.post(url, body);
};

const handleReject = (params, vm) => {
  httpReject(params).then((res) => {
    if (res && !res.failed) {
      vm.$loading.hide();
      vm.lineDataSet.refresh();
    }
    vm.$loading.hide();
  });
};
//为啥不放在methods里面？ 如果所有的二开方法都写入methods，也就是说即使这个二开方法不使用，仍然会全部被加载到当前实例里面，会增大性能消耗，放在此处
// 需要的时候，在以约定的命名规则动态挂载的当前实例，以供使用；方法命名规则租户编码+原方法名称 驼峰
function zhenYunToDetail(vm) {
  console.log(vm, "vm～hello");
  if (vm.headDataSet.current && vm.headDataSet.current.data["returnedFlag"] === 0) {
    return [
      {
        name: "reject",
        text: vm.$T("smbl.common.view.button.batch.reject").$D("拒收"),
        fill: true,
        visible: vm.getTenantNum === "SRM-CBD",
        callback: () => {
          const sinvRcvTrxLineDTOS = vm.lineDataSet?.selected?.map((item) => item.data);
          vm.$loading.show();
          if (!sinvRcvTrxLineDTOS) {
            vm.prototype.$dialog({
              title: vm.prototype.$T("smbl.common.message.tip").$D("提示"),
              content: vm.prototype.$T("smbl.common.message.showTip").$D("拒收失败，请先勾选收货行"),
              onCancel: () => { },
              onOK: () => { },
            });
            vm.$loading.hide();
            return false;
          }
          debounce(handleReject(sinvRcvTrxLineDTOS, vm), 500);
        },
      },
      {
        name: "delete",
        text: vm.$T("smbl.common.button.delete").$D("删除"),
        type: "danger",
        bordered: true,
        visible: true,
        size: "small",
        disabled: !(vm.lineDataSet.selected && vm.lineDataSet.selected.length > 0),
        callback: () => {
          const sinvRcvTrxLineDTOS = vm.lineDataSet.selected.map((item) => item.data);
          vm.deleteLine(sinvRcvTrxLineDTOS);
        }
      },
      {
        name: "batchEdit",
        text: vm.$T("smbl.common.view.button.batch.editMany").$D("批量编辑"),
        type: "primary",
        fill: true,
        visible: true,
        callback: () => {
          vm.onLineOpenClick();
        }
      }
    ];
  }
  return [ {
    name: "delete",
    text: vm.$T("smbl.common.button.delete").$D("删除"),
    type: "danger",
    bordered: true,
    visible: true,
    size: "small",
    disabled: !(vm.lineDataSet.selected && vm.lineDataSet.selected.length > 0),
    callback: () => {
      const sinvRcvTrxLineDTOS = vm.lineDataSet.selected.map((item) => item.data);
      vm.deleteLine(sinvRcvTrxLineDTOS);
    }
  } ];
}

function lajtValidateHange() {
  return true;
}

const starbucksDetailTitle = (vm) => {
  console.log(vm, "vm～hello");
  const config = {
    header: vm.$T("sinv.receipWorkbench.model.receipt.basicHeaderTitle").$D("基础信息"),
    line: vm.$T("sinv.receipWorkbench.model.receipt.lineTitle").$D("明细行信息"),
    attrment: vm.$T("sinv.receipWorkbench.model.receipt.attachmentInfoTitle").$D("附件信息"),
  };
  return config;
};

const weilongGetColumns = () => {
  return [
    {
      formRow: 100,
      seq: 10,
      fieldCode: "attributeLongtext22",
      fieldName: $T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
      render: (val, item) => {
        return <RichText val={val} />;
      },
    },
  ];
};

//定义方法映射关系
const cuxFunctions = {
  "SRM-CBD": { //⼆开租户的编码
    "getLineButs": zhenYunToDetail, //key 标准方法名称，value二开方法
  },
  "SRM-LDJT": {
    //⼆开租户的编码
    validateHange: lajtValidateHange, //key 标准方法名称，value二开方法
  },
  "SRM-STARBUCKS": {
    onDetailTitleShow: starbucksDetailTitle,
  },
  "SRM-WEILONG": {
    getColumns: weilongGetColumns,
  },
};

export default {
  data() {
    return {
    };
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};
