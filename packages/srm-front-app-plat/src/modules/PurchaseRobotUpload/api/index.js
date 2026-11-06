
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取uuid绑定的数据
export const getData = (params) => http.get(`/smbl/v1/${storage.getItem("organizationId")}/robot-task-params/get`, { params });


export const dataUpload = (body) => http.post(`/smbl/v1/ability-for-marmot/${storage.getItem("organizationId")}/data/upload`, body);
