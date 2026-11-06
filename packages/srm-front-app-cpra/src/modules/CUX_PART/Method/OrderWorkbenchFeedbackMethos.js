import SrmAppCore from "srm-front-app-core";
import { amountRender } from "../../OrderWorkbench/components/utils";

//为啥不放在methods里面？ 如果所有的二开方法都写入methods，也就是说即使这个二开方法不使用，仍然会全部被加载到当前实例里面，会增大性能消耗，放在此处
// 需要的时候，在以约定的命名规则动态挂载的当前实例，以供使用；方法命名规则租户编码+原方法名称 驼峰
function dzrHandleAmountRender() {
  return (val, item, field) =>
    amountRender(val, item, field, { bySourceCode: false });
}

//定义方法映射关系
const cuxFunctions = {
  "SRM-DZR": {
    //⼆开租户的编码
    handleAmountRender: dzrHandleAmountRender, //key 标准方法名称，value二开方法
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
