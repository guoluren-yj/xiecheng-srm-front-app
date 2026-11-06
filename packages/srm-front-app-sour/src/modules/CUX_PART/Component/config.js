import WeiLongExtendSrmScrollTabItem from "./WeiLongExtendSrmScrollTabItem.vue";
import XxjtPriceScoreElement from "./XxjtPriceScoreElement.vue";
export default {
  "SRM-WEILONG": { //⼆开租户的编码
    "ExtendSrmScrollTabItem": WeiLongExtendSrmScrollTabItem, //key 标准组件名称，value二开组件对象
  },
  "SRM-XXJT": { // 审批表单 二开组件 暂不支持
    "PriceScoreElement": XxjtPriceScoreElement,
  },
};