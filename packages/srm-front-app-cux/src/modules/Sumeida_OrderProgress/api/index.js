
import { http, httpCatch } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取订单执行进度列表
export const getOrderProgressListApi = (params) => {
    const url = `/scux/v1/${storage.getItem('organizationId')}/sanjiang-supply-details/agency/list`;
    return http.get(url, {params});
}

