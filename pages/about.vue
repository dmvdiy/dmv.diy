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
      <h1>About</h1>
      
      <h2>Who Are We?</h2>
      <p>
        This site is run by a small group of volunteers based in and around DC. We are lucky to live in a metropolitan area that is diverse and has so many creative resources.
      </p>
      <p>
        We strongly believe that strengthening community networks through mutual aid, support, and solidarity, are the only path forward to weathering current crises and those to come.
      </p>

      <h2>Project Purpose</h2>
      <p>
        Social media like Instagram and Facebook have long served as a useful medium for sharing events and interacting with community, but the rise in surveillance on these platforms and Meta's role in supporting the further erosion of our rights makes it necessary for communities to create their own open-source alternatives.
      </p>
      <p>
        Our ethos is rooted in the desire for a free internet in which data about our everyday lives is not fed into building out the infrastructure of surveillance and carceral systems.
      </p>
      <p>
        This site is meant to function as an evergreen version of the physical message boards (they still exist!) at coffee shops and community hubs. Currently, we accept events on a submissions basis, but we have the capacity to add additional calendars to our site to be maintained by others. Our calendar is based on Google API due to lack of a better alternative (let us know if you find one…)
      </p>

      <h2>Stance on AI</h2>
      <p>
        All of our events are posted to the site manually, even though this process can be time-intensive. We do not support the use of generative AI or data scraping on this site for the following reasons:
      </p>
      <ul>
        <li>AI does not create anything new, it only regenerates</li>
        <li>Its output is based on low-paid labor overseas</li>
        <li>AI is extractive and  <a href="https://capitalbnews.org/ai-data-centers-south-carolina-black-communities/" target="_blank">has real life consequences for historically marginalized communities</a> who are much more likely to suffer its externalities due to longtime racial planning policies</li>
        <li>Environmental footprint</li>
      </ul>
      <p>
        In summary, while we could concede that AI has utility, the risks/costs associated with AI far outweighs its utility to save time on simple tasks. 
      </p>
      <p>
        If you submit to us and we suspect that AI was used in generating your flyer or event info, we will not post it. 
      </p>
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
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

ul {
  padding-left: 1.5rem;
  list-style: disc;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.5rem;
}
</style>
