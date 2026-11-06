import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 查询用户详情
export const getUserConfig = () => {
    const url = `/iam/hzero/v1/users/self/detail`;
    return http.get(url);
}
