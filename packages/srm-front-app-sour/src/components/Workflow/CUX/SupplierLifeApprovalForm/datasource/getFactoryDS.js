/*
 * @Date: 2022-11-21 20:25:46
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

export const getFactoryDS = () => ({
  editable: false,
  enableQuery: false,
  fields:[
    {
      fieldCode:"factoryName",
      fieldName:$T("scux.supplierQuery.modal.factoryList.name").$D("工厂名称"),
    },
    {
      fieldCode:"factoryAddress",
      fieldName:$T("scux.supplierQuery.modal.factoryList.address").$D("工厂地址"),
    },
    {
      fieldCode:"factoryTypeMeaning",
      fieldName:$T("scux.supplierQuery.modal.factoryList.type").$D("工厂类型"),
    },
    {
      fieldCode:"factoryStatusMeaning",
      fieldName:$T("scux.supplierQuery.modal.factoryList.status").$D("工厂状态"),
    },
  ],
});