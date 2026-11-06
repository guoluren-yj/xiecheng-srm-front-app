import { SrmUtil } from "srm-mobile-ui";

const organizationId = SrmUtil.getTenantId();

function commonDs() {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    selection: Infinity,
  };
}

function dynamicDS(params) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    fields: [],
    bodyParameter: {
      ...params
    },
    transport: {
      read: {
        url: `/sslm/v1/${organizationId}/model-data/listTableData`,
        method: "post",
      },
      destroy: {
        url: `/sslm/v1/${organizationId}/model-data/listTableData`,
        method: "delete",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        const newdata = data.map((e) => ({ ...e, _itemStatus:"" }));
        return newdata;
      },
    }
  };
}

function dynamicBySourceDS(params) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    data: [],
    fields: [],
    bodyParameter: {
      ...params
    },
    transport: {
      read: {
        url: `/sslm/v1/${organizationId}/model-settings/bySource`,
        method: "get",
      },
      destroy: {
        url: `/sslm/v1/${organizationId}/model-settings/bySource`,
        method: "delete",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        const newdata = data.map((e) => ({ ...e, _itemStatus:"" }));
        return newdata;
      },
    }
  };
}

export {
  commonDs,
  dynamicDS,
  dynamicBySourceDS,
};