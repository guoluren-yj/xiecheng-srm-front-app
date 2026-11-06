import SrmConfirm from "./SrmConfirm";

export default {
  install: function (Vue) {
    //通过VUE原型注册一个方法
    //让所有的实例共享这个方法
    Vue.prototype.$confirm = (option = {}) => {
      //生成一个Vue的子类，同时也是这个子类也就是组件
      const Constructor = Vue.extend(SrmConfirm);
      //实例化一个对象
      const instance = new Constructor();
      //将这个实例挂载到我创建的div上
      //并将此div加入全局挂载点的内部

      instance.$mount(document.createElement("div"));
      document.body.appendChild(instance.$el);
      instance.visible = true;
      instance.inputValue = "";
      instance.title = option.title;
      instance.okText = option.okText;
      instance.required = option.required || false;
      instance.onOk = option.onOk;
      instance.onCancel = option.onCancel;
      instance.cancelText = option.cancelText;
      instance.closable = option.closable || false;
      instance.showOk = typeof option.showOk === "undefined" ? true : option.showOk;
      instance.showCancel = typeof option.showOk === "undefined" ? true : option.showCancel;
    };
  }
};
