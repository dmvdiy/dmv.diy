<script setup lang="ts">
useHead({
  title: 'dmv.diy',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'dmv.diy',
      content: '',
    },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/css/favicon.png' },
    { rel: 'alternate', type: 'application/rss+xml', title: 'dmv.diy RSS Feed', href: '/feed.xml' }
  ],
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=default%2Ces2015%2Ces6%2Ces5',
      crossorigin: 'anonymous',
    },
  ],
})

const key = ref(Date.now())
const route = useRoute()

watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    key.value = Date.now()
  }
})

onMounted(() => {
  key.value = Date.now()
})
</script>

<template>
  <App :key="key" />
</template>
