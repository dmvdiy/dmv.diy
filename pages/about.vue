<script setup lang="ts">
useHead({
  title: 'About - dmv.diy',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'About dmv.diy - Community events and resources in the DMV area',
    },
  ],
  link: [{ rel: 'icon', type: 'image/png', href: '/css/favicon.png' }],
})
</script>

<template>
  <div class="page-container">
    <LogoHeader />
    <div class="content">
      <img src="/css/undercon.gif" alt="Under Construction" />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>