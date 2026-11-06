<template>
 <div>
  <srm-input-field v-if="editFlag === 'table'" v-model="val" @inputChange="(val) => handleNumberChange(val, item.benchmarkLineId)" />
  <srm-text-field v-if="editFlag !== 'table'" >{{ val }}</srm-text-field>
 </div>
</template>
  
<script>
  export default {
    props: {
      val:'',
      editFlag:'',
      item: {},
      handleNumberChange:()=>{},
    },
    data(){
      return {
      }
    },
    mounted(){
    },
    methods: {
    }
  };
  </script>
