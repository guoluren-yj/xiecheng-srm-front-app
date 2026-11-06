/*
 * @Description: 协议审批二开方法
 * @Date: 2026-04-01 11:22:11
 * @Author: MYT<yitian.mao@going-link.com>
 * @Version: 1.0.0
 * @Copyright: Copyright (c) 2021, ZhenYun
 */

import SrmAppCore from "srm-front-app-core";

import { intelligentReviewSearch } from "../DataSource/api";

function junshiFetchIntelligentPreReviewResult(vm) {
  const { changeReqId } = vm;
  intelligentReviewSearch({ pcHeaderId: changeReqId }).then((res) => {
    if (!res || res?.failed) {
      return;
    }
    vm.aiResultData = res;
  });
}

//定义方法映射关系
const cuxFunctions = {
  "SRM-JUNSHI": {
    fetchIntelligentPreReviewResult: junshiFetchIntelligentPreReviewResult,
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
