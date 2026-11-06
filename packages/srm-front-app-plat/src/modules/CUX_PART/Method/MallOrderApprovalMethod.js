import SrmAppCore from "srm-front-app-core";
import { http, SrmUtil } from "srm-mobile-ui";
import { isArray } from "lodash";

// 普洛斯 ced-9175
const beforeGLPApprove = async (vm) => {
  const { attributeVarchar10 } = (vm.basicDataSet.toData() || [])[0] || {};
  if (attributeVarchar10) {
    // 存在项目编码才触发接口
    const res = await http.get(
      `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/tic4fSMq4Iq2vL7aVlKC9sjgvYWyAVqzS7SDHIdGutL0`,
      { params: { proCode: attributeVarchar10 } }
    );
    if (
      res &&
      isArray(res) &&
      res.length > 0 &&
      [0, "0", 6, "6", 12, "12"].includes(res[0]?.status)
    ) {
      return vm
        .$T("smbl.workFlow.view.button.approval.glpWarning")
        .$D("审批同意失败，项目已关闭");
    }
    return true;
  }
  return true;
};

//定义方法映射关系
const cuxFunctions = {
  "SRM-GLP": {
    beforeApprove: beforeGLPApprove,
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
