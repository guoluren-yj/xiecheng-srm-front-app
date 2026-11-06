import Vue from "vue";
//移动组件库
import SrmMobileUi from "srm-mobile-ui";
import "srm-mobile-ui/src/style/srm-mobile-ui.css";
import "srm-mobile-ui/packages/icon-font/iconfont.css";
import "srm-mobile-ui/packages/icon-font/iconfont";
const object = {
  SrmMobileUi,
  Vue,
};
import SrmAppCore from "srm-front-app-core";

import { Toast, Indicator, Dialog, Actionsheet, Notify, Previewer } from "hips";
Vue.use(Toast).use(Indicator).use(Dialog).use(Actionsheet).use(Notify).use(Previewer);

import "./directives"; // 加载自定义指令

import NavHead from "@/components/NavHead";
Vue.component(NavHead.name, NavHead);

import SrmConfirm from "@/components/SrmConfirm/index";
Vue.use(SrmConfirm);

import { buildImgUrl, changeNav, refreshScroll, handlerScroll } from "./utils/index";
Vue.prototype.buildImgUrl = buildImgUrl;
Vue.prototype.$changeNav = changeNav;
Vue.prototype.$refreshScroll = refreshScroll;
Vue.prototype.$handlerScroll = handlerScroll;

import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

SrmAppCore.beforeStart(object);
SrmAppCore.start(object);
