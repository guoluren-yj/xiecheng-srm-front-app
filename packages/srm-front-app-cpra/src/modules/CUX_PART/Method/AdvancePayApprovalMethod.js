import SrmAppCore from "srm-front-app-core";
import RichText from '@/components/RichText.vue';

const weilongGetColumns = () => {
  return [
    {
      formRow: 100,
      formCol: 10,
      fieldCode: "attributeLongtext22",
      fieldName: "备注",
      render: (val, item) => {
        return <RichText val={val} />;
      },
    },
  ];
};

//定义方法映射关系
const cuxFunctions = {
  "SRM-WEILONG": {
    getColumns: weilongGetColumns,
  },
};

export default {
  data() {
    return {};
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};
