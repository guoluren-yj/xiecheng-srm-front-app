// 状态颜色
export const getStatusCodeColor = (code) => {
  let bgcColor;
  switch (code) {
  case "VALID":
  case "APPROVAL_SUCCESS":
  case "APPROVE_SUCCESS":
  case 1: // 启用
    // 绿色
    bgcColor = "success";
    break;
  case "NEW":
  case "TO_BE_VALID":
  case "APPROVALING":
  case "APPROVING":
    // 橙色
    bgcColor = "warn";
    break;
  case "EXPIRE":
  case "IN_VALID":
  case "WITHDRAW":
  case "NONE":
    // 灰色
    bgcColor = "gray";
    break;
  case "APPROVAL_REJECTED":
  case "APPROVE_REJECT":
  case 0:
    // 红色
    bgcColor = "danger";
    break;
  default:
  }
  return bgcColor;
};
