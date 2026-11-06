import { $T } from "srm-mobile-ui";
import ResultQueryChangeCompare from "./components/ResultQueryChangeCompare";

const open3SBIOComparisonPop = (rfxHeaderId, that) => {
  const findProcessInstanceId = (parent) => {
    if (!parent) {
      return false;
    }
    if (parent && parent.processInstanceId) {
      return parent.processInstanceId;
    }
    return findProcessInstanceId(parent.$parent);
  };
  const processInstanceId = findProcessInstanceId(that?.$parent);
  that.$popup({
    title: $T("sscux.ssrc.view.3sbio.cuxChangeComparison").$D("变更对比"),
    showHeader: true,
    showBack: true,
    content: <ResultQueryChangeCompare rfxHeaderId={rfxHeaderId} processInstanceId={processInstanceId} />,
  });
};

export {
  open3SBIOComparisonPop
};