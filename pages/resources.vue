<script setup lang="ts">
useHead({
  title: 'Resources - dmv.diy',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'Community resources in the DMV area',
    },
  ],
})
</script>

<template>
  <div class="page-container">
    <LogoHeader />
    <div class="content">
      <h1>Resources</h1>
      <p>Content coming soon...</p>
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
}

h1 {
  margin-bottom: 1rem;
}
</style>