<template>
  <div class="index-container">
    <!-- <version-information /> -->
    <!-- <div class="welcome"><text>欢迎你使用线上销售系统</text></div> -->
    <DataShow />
  </div>
</template>

<script>
  // import VersionInformation from './components/VersionInformation'
  import DataShow from './components/DataShow'
  export default {
    name: 'Index',
    components: { DataShow },
  }
</script>
<style>
  .welcome {
    margin-top: 300px;
    font-size: 35px;
    font-weight: bold;
    color: rgba(165, 165, 165, 0.712);
    text-align: center;
    vertical-align: center;
  }
</style>
