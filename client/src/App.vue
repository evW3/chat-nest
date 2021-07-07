<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
  import EmptyLayout from "./layouts/EmptyLayout";
  export default {
    computed: {
      layout() {
        return (this.$route.meta.layout || "empty") + "-layout";
      }
    },
    components: {
      EmptyLayout
    }
  };
</script>
