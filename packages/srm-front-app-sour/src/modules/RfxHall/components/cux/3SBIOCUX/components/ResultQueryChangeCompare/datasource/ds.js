import { SrmUtil } from "srm-mobile-ui";

const lineTableDs = (rfxHeaderId, processInstanceId) => ({
  autoQuery: true,
  editable: false,
  editFlag: false,
  enableQuery: false,
  selection: Infinity,
  bodyParameter: {
    rfxHeaderId,
    processInstanceId
  },
  transport: {
    read: {
      url: `marmot/v1/${SrmUtil.getTenantId()}/marmot-api/R8OlPWPr1ZFtibSpLWrazj48ibwsJpMEqfJkwiaS8OiaWGCkIeFHA6ZWGP6stibkzFbGp`,
      method: "post",
    },
  },
});

const historyDs = (resultId) => ({
  autoQuery: true,
  editable: false,
  editFlag: false,
  enableQuery: false,
  selection: Infinity,
  bodyParameter: {
    resultId
  },
  transport: {
    read: {
      url: `marmot/v1/${SrmUtil.getTenantId()}/marmot-api/R8OlPWPr1ZFtibSpLWrazj4oFk4U9kgAhDyf4RYic0dxN7FhXOEUkf9KgT80dHhZ8d`,
      method: "post",
    },
  },
});

export {
  lineTableDs,
  historyDs,
};