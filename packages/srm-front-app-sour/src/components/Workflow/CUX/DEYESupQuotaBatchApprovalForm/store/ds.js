import { SrmUtil } from "srm-mobile-ui";

const formDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  paging: false,
  transport: {
    read: {
      url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/2QaXibIEAyYln2HYugw5qJ3eXwvG57JiclVIHJtzHicoUM`,
      method: "get",
    },
  },
});

const tableDS = () => ({
  autoQuery: false,
  editFlag: false,
  editable: false,
  paging: true,
  pageSize: 5,
  hasMore: true,
  enableQuery: false,
  transport: {
    read: {
      url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/2QaXibIEAyYln2HYugw5qJzgvYWyAVqzS7SDHIdGutL0`,
      method: "get",
    },
  },
});

export {
  formDS,
  tableDS,
};