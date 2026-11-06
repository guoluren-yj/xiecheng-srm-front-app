import { $T } from "srm-mobile-ui";
import SrmAppCore from "srm-front-app-core";
import { http, SrmUtil } from "srm-mobile-ui";
// import { debounce } from "lodash";
//基于为收货的数据新建收货单-批量提交
// 确认
export const sureAsnInfoApi = (node, headParams, params) => {
  const asnHeaderList = [ params ];
  const url = `/slod/v1/${SrmUtil.getTenantId()}/delivery/${node}/sync/external?${headParams.join("&")}`;
  return http.post(url, { asnHeaderList });
};

const handleConfirm = async (vm) => {
  try {
    if (!vm.commonDataSet.validate() || !vm.asnLineDataSetByHandle.validate()) {
      return;
    }
    vm.$loading.show();
    const res = await sureAsnInfoApi(vm?.commonInfo?.node, [
      `customizeUnitCode=${vm?.uiTemp}`,
      "cuszTplPageCode=DELIVERY_WORKBENCH.DETAIL",
      `cuszTplStageCode=${vm?.commonInfo?.tab.toUpperCase()}`,
      `cuszTplTemplateCode=${vm?.tempInfo?.templateCode}`,
      `cuszTplVersion=${vm?.tempInfo?.templateVersion}`,
    ],
    {
      ...vm?.commonDataSet?.toData()[0],
      deliveryLineDTOList: vm?.asnLineDataSetByHandle?.toData() && vm?.asnLineDataSetByHandle?.toData()?.length > 0 ? vm?.asnLineDataSetByHandle?.toData() : vm?.asnLineDataSetByAll?.toData(),
    });
    if (res && res.failed) {
      vm.$notification.open({
        message: res.message,
        duration: 1000,
      });
      vm.$loading.hide();
    } else {
      vm.$loading.hide();
      vm.$notification.open({
        message: $T("slod.common.view.message.optionSuccess").$D("操作成功"),
        duration: 1000,
      });
      vm.$router.back();
    }
  } finally {
    vm.$loading.hide();
  }
};

//为啥不放在methods里面？ 如果所有的二开方法都写入methods，也就是说即使这个二开方法不使用，仍然会全部被加载到当前实例里面，会增大性能消耗，放在此处
// 需要的时候，在以约定的命名规则动态挂载的当前实例，以供使用；方法命名规则租户编码+原方法名称 驼峰
function zhenYunToDetail(vm) {
  console.log(vm, "vm～hello");
  return [
    {
      text: vm.$T("slod.common.view.button.reject").$D("拒绝"),
      type: "danger",
      bordered: true,
      handler: () => {
        vm.reject();
      }
    },
    {
      text: vm.$T("slod.common.view.button.sure").$D("确认"),
      fill: true,
      handler: () => {
        // debounce(handleConfirm(vm), 500);
        handleConfirm(vm);
      }
    },
  ];
}

//定义方法映射关系
const cuxFunctions = {
  "SRM-FE": { //⼆开租户的编码
    "getLineButsFe": zhenYunToDetail, //key 标准方法名称，value二开方法
  }
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
