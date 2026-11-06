import { SrmUtil } from "srm-mobile-ui";
import Socket from "./Socket";

const manager = {
  // 全部的组件ID，每注册一个组件均放进去，销毁时移除
  ids: {},
  socket: null,
  // 创建一个socket连接，如果已经存在，直接返回
  createSocket(id, processor) {
    if (this.ids[id]) {
      return this.socket;
    }
    this.ids[id] = { id };
    if (this.socket) {
      return this.socket;
    }
    this.socket = new Socket(this.getSocketUrl(processor));
    this.socket.loadSocket();
    return this.socket;
  },
  getSocketUrl() {
    const API_HOST = SrmUtil.getApiBaseUrl();
    const token = SrmUtil.getUserToken();
    let url = "";
    if (API_HOST.indexOf("https") === 0) {
      url = API_HOST.replace("https", "wss");
    } else {
      url = API_HOST.replace("http", "wss");
    }
    url = `${url}/smbl/websocket/mobile/message?processor=chat-processor&access_token=${token}`;
    return url;
  },
  destroySocket(id) {
    if (!this.ids[id]) {
      return false;
    }
    // 移除ID对应的所有监听
    this.socket.removeEventListeners(id);
    this.socket.removeMessageListeners(id);
    this.socket.removeWaitSocketConnect(id);
    delete this.ids[id];
    const ids = Object.keys(this.ids);
    if (!ids.length) {
      // 全部销毁了
      this.socket.destroy();
      this.socket = null;
    }
  },
};

export default manager;
