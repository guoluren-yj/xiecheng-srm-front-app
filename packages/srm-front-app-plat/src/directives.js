import Vue from "vue";

// 点击元素外部触发
Vue.directive("click-outside", {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // 检查点击事件的目标元素是否是该元素自身或其子元素
      if (!(el === event.target || el.contains(event.target))) {
        // 如果不是，调用在指令中传入的表达式
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function (el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});
