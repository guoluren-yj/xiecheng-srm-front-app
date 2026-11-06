/**
 * 本地开发，动态菜单配置文件，applications存放调试阶段，子应用入口路径
 * includeArray存放keep alive 路由
 * @type {({route: string, name: string}|{route: string, name: string})[]}
 */
const applications = [
  /**
   * 审批表单验证，我们为您提供工作流表单验证界面，审批工作台可能不在当前服务
   * 如果验证开发的审批表单是否正常，可替换mobileFormUrl为当前开发的工作流审批表单路径，
   * 若当前界面验证正常，审批工作台可正常展示，开发完成后将mobileFormUrl组件通过remoteConfig.js曝露
   * 出去供审批工作台服务调用即可
   * eg：当前例子曝漏出去的配置为"./OrderApproval":"./src/components/Workflow/OrderApprovalFormNew/OrderApproval.vue"
   * 工作流表单配置，移动端url配置则为/appCpra/OrderApprovalFormNew?poHeaderId=${poHeaderId}
   * appCpra(请使用对应服务联邦模式简称，当前以协同为例，勿直接copy)
   */
  {
    name: "审批表单验证",
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/MallRequestApproveForm/MallRequestApproval?requestId=18767")}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/MallOrderApproveForm/MallOrderApproval?orderId=129484")}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/MallRequestApproveForm/MallRequestApproval?requestId=22387")}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/MallOrderApproveForm/MallOrderApproval?orderId=111335")}`,
    route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent(
      "/MallBatchApproveForm/MallBatchApprove?batchNum=BP2024073000000004"
    )}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/CUX/MallBatchApproveForm/YX_MallBatchApprove?orderId=111335")}`,
    // route: `ApprovalFormVerify?mobileFormUrl=${encodeURIComponent("/CUX/MallOrderApproveForm/YX_MallOrderApproval?orderId=111335")}`,
  },
  {
    name: "审批工作台",
    route: "ApprovalList",
  },
  {
    name: "商品工作台（采）",
    route: "CommodityWorkbenchPurchaserList",
  },
  {
    name: "领用商品图片上传",
    route: "WuLing_CommodityWorkbench/List",
  },
  {
    name: "商品预览-公共",
    route: "skuPreview",
  },
  {
    name: "智能客服",
    route: "CustomerService",
  },
  {
    name: "寻商问品",
    route: "FindBusinessList",
  },
  {
    name: "待办事项",
    route: "MyTodoList",
  },
  {
    name: "我的工作流",
    route: "MyWorkFlowList",
  },
  {
    name: "供应商缴费明细（壳子跳转使用）",
    route: "SupplierPaymentDetail",
  },
  {
    name: "缴费记录(供)",
    route: "SupplierPaymentRecordList",
  },
  {
    name: "广域寻源",
    route: "WideAreaSourceList",
  },
  {
    name: "子账户管理",
    route: "SubAccountSiteList",
  },
  {
    name: "采购助手文件上传",
    route: "purchaseRobotUpload",
  },
  {
    name: "供应商订阅缴费记录(采)",
    route: "SupplierSubscriptionPaymentRecordList",
  },
  {
    name: "外部链接页面",
    route:
      "/Link?url=%2Fmarmot%2Fv1%2Fmarmot-site-api%2FSDSP_SDAA_REPORT%3FprojectId%3D40%26rid%3D161%26hideTitle%3Dtrue%26srmProxyUser%3D32509%26access_token%3D%7BaccessToken%7D",
  },
  {
    name: "在线沟通",
    route: "ChatRoom",
  },
  {
    name: "问答助手",
    route: "PurchaseRobot",
  },
  {
    name: "星巴克审批工作台",
    route: "StarBucks_ApprovalList",
  },
  {
    name: "AI 助理",
    route: "AiAssistant",
  },
];

const includeArray = [
  "ApprovalList",
  "CustomerService",
  "FindBusinessList",
  "FindBusinessSearch",
  "MyTodoList",
  "MyWorkFlowList",
  "WideAreaSourceList",
  "SubAccountList",
  "ChatRoom",
  "AiAssistant",
];
export { includeArray, applications };
