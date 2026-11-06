import SrmAppCore from "srm-front-app-core";
import { SrmUtil } from "srm-mobile-ui"; // SrmUtil
import { Exception } from "../../../utils/index";
import { http } from "srm-mobile-ui";
// import { updateCuxDavco } from "./cuxService.js";


//为啥不放在methods里面？ 如果所有的二开方法都写入methods，也就是说即使这个二开方法不使用，仍然会全部被加载到当前实例里面，会增大性能消耗，放在此处
// 需要的时候，在以约定的命名规则动态挂载的当前实例，以供使用；方法命名规则租户编码+原方法名称 驼峰
const saveDavcoAttribute = (vm) => {
    // const { cuxDom } = vm.parameters;
    const {
        headerInfoDs,
        detailInfoDs,
        stageInfoDs,
        templateInfo,
        stageCode,
        nodeCode,
        parameters,
    } = vm;
    const { cuxDom } = parameters || {};
    if (cuxDom !== "chooseApprover") {
        return true;
    }
    // 获取头信息
    const getHeaderInfo = () => {
        const header = headerInfoDs.current;
        const headerFlag = headerInfoDs?.validate();
        if (headerFlag) {
            const {
                adjustValidityDate = {},
                validityDate = {},
                ...other
            } = header.toData();
            return {
                ...other,
                ...adjustValidityDate,
                ...validityDate,
            };
        }
        return false;
    };
    // 获取基础信息
    const getDetailInfo = () => {
        const lineFlag = detailInfoDs.validate();
        if (lineFlag) {
            return {
                itemAuthReqLineVOList: detailInfoDs.toData(),
            };
        }
        return false;
    };
    // 获取阶段信息
    const getStageInfo = () => {
        const lineFlag = stageInfoDs.validate();
        if (lineFlag) {
            return {
                itemAuthReqHeaderAttVOList: stageInfoDs.toData(),
            };
        }
        return false;
    };
    const headerInfo = getHeaderInfo();
    const detailInfo = getDetailInfo();
    const stageInfo = getStageInfo();
    if (!headerInfo || !detailInfo || !stageInfo) {
        return false;
    }
    const postData = {
        ...headerInfo,
        ...detailInfo,
        ...stageInfo,
    };
    console.log(templateInfo);
    const { templateCode, templateVersion, useTemplateCusz } = templateInfo;
    const customizeCode = [
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.BASEINFO",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.BASEINFO_DETAIL",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.DETAILINFO",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.DETALIINFO_DETAIL",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.NODEINFO",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.NODEINFO_DETAIL",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.SAMPLE",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.SAMPLE_DETAIL",
    ];
    const customizedStr = `?customizeUnitCode=${customizeCode.join("%2C")}`;
    const queryParam = useTemplateCusz ?
        `&cuszTplTemplateCode=${templateCode}&cuszTplVersion=${templateVersion}&cuszTplPageCode=${nodeCode}&cuszTplStageCode=${stageCode}&pageCode=${nodeCode}&stageCode=${stageCode}` :
        "";
    return new Promise((resolve, reject) => {
        const saveInfoApi = (params) => {
            console.log(params);
            const url = `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/bsclc3nnnqEpibsshHePJSuHNOc5cCJs6sYqIu2eQ5OGIFibhLm9IHbSk9ezrpLaUf${customizedStr}${queryParam}`;
            return http.put(url, params);
        };
        saveInfoApi({ ...postData }).then((res) => {
            if (res && res.failed) {
                // eslint-disable-next-line new-cap
                Exception(vm, res?.message, []);
                reject(false);
            } else {
                resolve(true);
            }
        });
    });

}


// saveMaterialDataForSojo: 双杰电器二开:保存头行信息
const saveMaterialDataForSojo = (vm) => {
    const {
        headerInfoDs,
        detailInfoDs,
        stageInfoDs,
        templateInfo,
        stageCode,
        nodeCode,
    } = vm;
    console.log(vm)
    // 获取头信息
    const getHeaderInfo = () => {
        const header = headerInfoDs.current;
        const headerFlag = headerInfoDs?.validate();
        if (headerFlag) {
            const {
                adjustValidityDate = {},
                validityDate = {},
                ...other
            } = header.toData();
            return {
                ...other,
                ...adjustValidityDate,
                ...validityDate,
            };
        }
        return false;
    };
    // 获取基础信息
    const getDetailInfo = () => {
        const lineFlag = detailInfoDs.validate();

        if (lineFlag) {
            return {
                itemAuthReqLineVOList: detailInfoDs.toData(),
            };
        }
        return false;
    };
    // 获取阶段信息
    const getStageInfo = () => {
        const lineFlag = stageInfoDs.validate();

        if (lineFlag) {
            return {
                itemAuthReqHeaderAttVOList: stageInfoDs.toData(),
            };
        }
        return false;
    };
    const headerInfo = getHeaderInfo();
    const detailInfo = getDetailInfo();
    const stageInfo = getStageInfo();
    if (!headerInfo || !detailInfo || !stageInfo) {
        return false;
    }
    console.log(headerInfo, detailInfo, stageInfo, templateInfo, 'testbyPeng')
    const postData = {
        ...headerInfo,
        ...detailInfo,
        ...stageInfo,
    };
    const { templateCode, templateVersion, useTemplateCusz } = templateInfo;
    const customizeCode = [
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.BASEINFO",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.BASEINFO_DETAIL",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.DETAILINFO",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.DETALIINFO_DETAIL",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.NODEINFO",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.NODEINFO_DETAIL",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.SAMPLE",
        "SMBL.MATERIAL.CERTIFICATION.WORKBENCH.SAMPLE_DETAIL",
    ];
    const customizedStr = `?customizeUnitCode=${customizeCode.join("%2C")}`;
    const queryParam = useTemplateCusz ?
        `&cuszTplTemplateCode=${templateCode}&cuszTplVersion=${templateVersion}&cuszTplPageCode=${nodeCode}&cuszTplStageCode=${stageCode}&pageCode=${nodeCode}&stageCode=${stageCode}` :
        "";
    return new Promise((resolve, reject) => {
        const saveInfoApi = (params) => {
            const url = `smdm/v1/${SrmUtil.getTenantId()}/item-auth-req-headers/save${customizedStr}${queryParam}`;
            return http.put(url, params);
        };
        saveInfoApi({ ...postData }).then((res) => {
            if (res && res.failed) {
                // eslint-disable-next-line new-cap
                Exception(vm, res?.message, []);
                reject(false);
            }
            resolve(true);
        });
    });
}

//定义方法映射关系
const cuxFunctions = {
    "SRM-DAVCO": {
        saveMaterialData: saveDavcoAttribute,
    },
    "SRM-SOJO": {
        saveMaterialData: saveMaterialDataForSojo,
    },
};

export default {
    beforeCreate() {
        console.log(this, cuxFunctions);
        //抽取一个通用方法，规则构建基于标准二开的埋点方法
        SrmAppCore.buildCuxFunction(this, cuxFunctions);
    },
};