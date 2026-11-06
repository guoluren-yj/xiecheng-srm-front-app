import { http } from "srm-mobile-ui";

const getDetailApi = (params) => {
  const url = `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/QlHPWXukDvQ2eItY24d3QmHRKCyA1FZ2I8mxawp0M9AMll8uKAZSs4BSz8OjUq9W`;

  return http.get(url, { params });
};

export { getDetailApi };
