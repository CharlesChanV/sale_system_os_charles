<template>
  <div class="index-container">
    <!-- <version-information /> -->
    <div v-if="!showData" class="welcome">
      <text>欢迎你使用线上销售系统</text>
    </div>
    <DataShow v-else />
  </div>
</template>

<script>
  // import VersionInformation from './components/VersionInformation'
  import DataShow from './components/DataShow'
  import { mapGetters } from 'vuex'
  export default {
    name: 'Index',
    components: { DataShow },
    computed: {
      ...mapGetters({
        role: 'acl/role',
      }),
    },
    mounted() {
      console.log(this.role)
      if (
        this.role.includes('ROLE_super_admin') ||
        this.role.includes('ROLE_sale_admin') ||
        this.role.includes('ROLE_store_admin')
      ) {
        this.showData = true
      }
    },
    data() {
      return {
        showData: false,
      }
    },
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
