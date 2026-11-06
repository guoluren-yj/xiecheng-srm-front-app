/**
 *
 * @date: 2022-04-12
 * @author: yuyu.chang@going-link.com
 * 联邦模式，组件曝露，远程调用配置
 */

/**
 * 联邦模式打包是曝露域名，线上打包使用环境变量，线下自定义
 * @type {string}
 */
const mobileSrmHost = process.env.VUE_APP_SRM_HOST;
/**
 * 组件曝露
 * @type {{}}
 */
const exposes = {
  "./MallBatchApprove": "./src/components/Workflow/MallBatchApproveForm/MallBatchApprove.vue",
  "./MallOrderApproval": "./src/components/Workflow/MallOrderApproveForm/MallOrderApproval.vue",
  "./MallRequestApproval": "./src/components/Workflow/MallRequestApproveForm/MallRequestApproval.vue",
  "./YX_MallBatchApprove": "./src/components/Workflow/CUX/MallBatchApproveForm/YX_MallBatchApprove.vue",
  "./YX_MallOrderApproval": "./src/components/Workflow/CUX/MallOrderApproveForm/YX_MallOrderApproval.vue",
  "./ZYT_MallOrderApproval": "./src/components/Workflow/CUX/MallOrderApproveForm/ZYT_MallOrderApproval.vue",
  "./ZYT_MallRequestApproval": "./src/components/Workflow/CUX/MallRequestApproveForm/ZYT_MallRequestApproval.vue",
  "./NoticesApproval": "./src/components/Workflow/NoticesApprovalForm/NoticesApproval.vue",
  "./skuPreview": "./src/modules/SkuPreview/views/SkuPreview.vue",
  "./StandardFormTest":"./src/components/Workflow/StandardFormTestForm/StandardFormTest.vue",
  "./EcSkuShelfApprove": "./src/components/Workflow/EcSkuShelfApproveForm/EcSkuShelfApprove.vue",
  "./SkuUnShelfApprove": "./src/components/Workflow/SkuUnShelfApproveForm/SkuUnShelfApprove.vue",
};

/**
 * 远程调用配置
 * @type {{}}
 */
const remotes = {
  appPlat: `appPlat@${mobileSrmHost}/appPlat/PlatRemoteEntry.js`,
  appCpra: `appCpra@${mobileSrmHost}/appCpra/CpraRemoteEntry.js`,
  appSour: `appSour@${mobileSrmHost}/appSour/SourRemoteEntry.js`,
  appCux: `appCux@${mobileSrmHost}/appCux/CuxRemoteEntry.js`,
};

module.exports = {
  exposes,
  remotes,
  mobileSrmHost
};

