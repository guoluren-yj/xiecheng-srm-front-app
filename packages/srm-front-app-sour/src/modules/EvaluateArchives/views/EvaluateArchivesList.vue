<!-- <template> -->
<!--  <div style="height: 100vh"> -->
<!--    <srm-tab-bar display="justify" :tabs="[ -->
<!--      $T('sslm.supplierDocManage.model.evalDocManage.reviewFileManage').$D('考评档案管理'), -->
<!--      $T('sslm.common.view.title.archiveFilling').$D('考评档案填制') -->
<!--    ]" :active-index.sync="activeIndex"> -->
<!--      &lt;!&ndash;      <srm-tab-item :label="$T('sslm.supplierDocManage.model.evalDocManage.reviewFileManage').$D('考评档案管理')"> &ndash;&gt; -->
<!--      &lt;!&ndash;      </srm-tab-item> &ndash;&gt; -->
<!--      &lt;!&ndash;      <srm-tab-item :label="$T('sslm.common.view.title.archiveFilling').$D('考评档案填制')"> &ndash;&gt; -->
<!--      &lt;!&ndash;      </srm-tab-item> &ndash;&gt; -->
<!--    </srm-tab-bar> -->
<!--    <evaluate-archives-manage-list v-if="activeIndex === 0"/> -->
<!--    <evaluate-archives-fill-list v-else/> -->
<!--  </div> -->
<!-- </template> -->

<!-- <script> -->

<!-- import EvaluateArchivesFillList from "./EvaluateArchivesFillList"; -->
<!-- import EvaluateArchivesManageList from "./EvaluateArchivesManageList"; -->

<!-- export default { -->
<!--  modules: [ "sslm.common", "sslm.supplierDocManage" ], -->
<!--  name: "EvaluateArchivesList", -->
<!--  components: { EvaluateArchivesFillList, EvaluateArchivesManageList }, -->
<!--  data() { -->
<!--    return { -->
<!--      activeIndex: 0, -->
<!--    }; -->
<!--  } -->
<!-- }; -->
<!-- </script> -->

<template>
  <div style="height: 100vh">
    <evaluate-archives-manage-list/>
  </div>
</template>

<script>

import EvaluateArchivesManageList from "../components/EvaluateArchivesManageList";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common" ],
  name: "EvaluateArchivesList",
  components: { EvaluateArchivesManageList },
};
</script>
