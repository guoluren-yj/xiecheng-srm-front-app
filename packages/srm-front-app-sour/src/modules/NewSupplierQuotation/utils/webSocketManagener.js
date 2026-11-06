
import { isFunction, isString } from 'lodash';
import SockJs from "sockjs-client";

import { SrmUtil } from "srm-mobile-ui";

import { getSRMAccessCode } from "../api";

/**
 * 标志这 socket 的状态
 * unInit:  没有初始化
 * error:   出现错误(建立连接)
 * init:    初始化成功
 * close:   关闭
 * @type {{init: number, error: number, close: number, unInit: number}}
 */
const SocketStatus = {
  unInit: 0,
  error: 2,
  close: 4,
  init: 32,
  count: 5,
};

class WebSocketManagener {

  eventManagener = {};

  socketStatus = SocketStatus.unInit;

  count = 0;

  // 心跳包的定时器
  heartbeatPackageTimer;

  componentWillUnmount() {
    if (this.heartbeatPackageTimer !== undefined) {
      clearInterval(this.heartbeatPackageTimer);
      this.heartbeatPackageTimer = undefined;
    }
  }

  /**
   * 发送心跳包
   */
  intervalHeartbeatPackage() {
    if (!this.socket) {
      this.initWebSocket();
    } else if (this.socket.readyState !== 1) {
      if (this.count > SocketStatus.count) {
        this.destroyWebSocket();
      } else {
        this.initWebSocket();
      }
    } else {
      this.socket.send("hzero-hi");
    }
  }

  handleSocketOpen() {
    this.socketStatus = SocketStatus.init;
    this.heartbeatPackageTimer = setInterval(this.intervalHeartbeatPackage, 45000);
    this.count = 0;
  }

  handleEmit(key, res) {
    if (!key) {
      return;
    }
    const handle = this.eventManagener[key];

    if (typeof handle === "function") {
      handle(res);
    }
  }

  /**
   * 当webSocket返回信息时执行
   * @param {Object} message 返回对象
   */
  handleSocketMessage(message) {
    const res = JSON.parse(message.data || {});
    if (res) {
      const { key } = res || {};
      this.handleEmit(key, res);
    }
  }

  aaa() {

  }

  /**
   * 关闭webSocket连接
   */
  destroyWebSocket() {
    try {
      this.socket.close();
      this.socket = null;
    } catch (e) {

    }

    this.socketStatus = SocketStatus.close;
    if (this.heartbeatPackageTimer !== undefined) {
      clearInterval(this.heartbeatPackageTimer);
      this.heartbeatPackageTimer = undefined;
    }
  }

  /**
   * 监听到 websocket 关闭连接
   */
  handleSocketClose() {
    this.socketStatus = SocketStatus.close;
    // if (this.heartbeatPackageTimer !== undefined) {
    //   clearInterval(this.heartbeatPackageTimer);
    //   this.heartbeatPackageTimer = undefined;
    // }
    if (!this.heartbeatPackageTimer) {
      this.heartbeatPackageTimer = setInterval(this.intervalHeartbeatPackage, 45000);
    }
    this.count += 1;
  }

  /**
   * 增加监听事件
   */
  addListener(type, handler) {
    if (isString(type) && isFunction(handler)) {
      this.eventManagener[type] = handler;
    }
  }

  /**
   * 移除监听事件
   */
  removeListener(type, handler) {
    if (isString(type) && isFunction(handler)) {
      this.eventManagener[type] = () => { };
    }
  }

  /**
   * 移除所有监听事件
   */
  removeAllListeners(type) {
    if (isString(type)) {
      this.eventManagener[type] = null;
    }
  }

  /**
   * 建立 webSocket 连接
   */
  async initWebSocket() {
    const API_HOST = SrmUtil.getApiBaseUrl();
    const accessToken = SrmUtil.getUserToken();
    const _sac = await getSRMAccessCode();

    try {
      if (this.socket) {
        this.destroyWebSocket();
      }
      let url = `${API_HOST}/hpfm/sock-js/`;
      // const { tenantNum } = getCurrentTenant() || {};
      // // 深信租户服特殊逻辑
      // if (tenantNum === 'SRM-SANGFOR') {
      //   const { protocol, host } = window.location;
      //   url = `${protocol}//${host}/hpfm/sock-js`;
      // }

      this.socket = _sac ?
        new SockJs(`${url}?_sac=${accessToken}&access_token=${accessToken}`)
        :
        new SockJs(`${url}?access_token=${accessToken}`);
      if (this.socket) {
        this.socket.onopen = this.handleSocketOpen;
        this.socket.onmessage = (res) => this.handleSocketMessage(res);
        this.socket.onclose = this.handleSocketClose;
      }
    } catch (err) {
      // 不在页面显示websocket连接失败
      // console.error(
      //   intl.get('hzero.common.notification.error.webSocket').d('webSocket连接失败!')
      // );
      this.socketStatus = SocketStatus.error;
      this.socket = {
        close: () => {},
      };
    }
  }

  sendMessage(service, key, data) {
    if (this.socketStatus === SocketStatus.init) {
      this.socket.send(
        JSON.stringify({
          service,
          key,
          message: JSON.stringify(data),
        })
      );
    }
  }
}

const webSocketManagener = new WebSocketManagener();

export default webSocketManagener;
