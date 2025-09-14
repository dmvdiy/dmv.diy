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
      <p>
        DC is home to many spaces that offer community-centered resources and events. While we focus on alternative and DIY events, we want to spotlight other great places to explore. Reach out to us at
        <a href="mailto:dmv.diy.fyi@gmail.com">dmv.diy.fyi@gmail.com</a> if you have recommendations to add!
      </p>

      <h2>Independent Bookstores, Small Press, Etc.:</h2>
      <ul>
        <li><a href="https://www.solidstatebooksdc.com/" target="_blank">Solid State Books</a></li>
        <li><a href="https://www.sankofa.com/" target="_blank">Sankofa Video, Books and Cafe</a></li>
        <li><a href="https://www.loyaltybookstores.com/meettheteam" target="_blank">Loyalty Books and Culture</a></li>
        <li><a href="https://www.mahoganybooks.com/" target="_blank">Mahogany Books</a></li>
        <li><a href="https://pottershousedc.org/bookstore" target="_blank">The Potter's House Books</a></li>
        <li><a href="https://www.bol.coop/" target="_blank">Bol Co-Op</a> DC's first worker owned bookstore!</li>
        <li><a href="https://lostcitybookstore.com/" target="_blank">Lost City Books</a></li>
        <li><a href="https://peoplesbooktakoma.com/" target="_blank">The People’s Book</a></li>
        <li><a href="https://www.jfbooks.org/about" target="_blank">JF Books</a> (specializes in Asian and Asian American works)</li>
        <li><a href="https://www.middleeastbooks.com/pages/about-us" target="_blank">Middle East Books and More</a></li>
        <li><a href="https://littledistrictbooks.com/pages/store-information" target="_blank">Little District Books</a> (specializes in LGBTQ+ works)</li>
        <li><a href="https://stores.comichub.com/fantom_comics" target="_blank">Fantom Comics</a></li>
        <li><a href="https://sunscinema.com/" target="_blank">Sun's Cinema</a> (independent movie theater and bar)</li>
        <li><a href="https://lilacperil.com/?fbclid=PAZXh0bgNhZW0CMTEAAadfUQGElrGS6fEhGe594Lx9TS-HrsazQ8SP9GEVF9IFCx20ykUujb7O2bMOjw_aem_YOR8iA4yK_roI1m5t0CCPg" target="_blank">Lilac Press</a> A DC-based publisher and literary journal that centers local trans authors and poets</li>
      </ul>

      <h2>Spaces that host queer-centered events:</h2>
      <ul>
        <li><a href="https://asyouaredc.com/" target="_blank">As You Are</a> – LGBTQ+ cafe and bar</li>
        <li><a href="https://thedccenter.org/" target="_blank">The DC Center</a> – LGBTQ+ community center</li>
        <li><a href="https://tradebardc.com/" target="_blank">Trade</a> – Gay bar and nightclub</li>
        <li><a href="https://showtime-lounge.res-menu.com/" target="_blank">Showtime Lounge</a> – Dyke Nites (Wednesdays)</li>
        <li><a href="https://www.shakersdc.com/" target="_blank">Shakers</a> – hosts drag shows</li>
        <li><a href="https://pasttensestudio.com/" target="_blank">Past Tense Yoga Studio</a> – free monthly yoga for trans folks (registration required)</li>
      </ul>

      <h2>Mutual Aid Resources:</h2>
      <ul>
        <li><a href="https://linktr.ee/peoplesmediccollectivedmv" target="_blank">People’s Medic Collective</a></li>
        <li><a href="https://www.instagram.com/lacollectiva/" target="_blank">La CollectiVA</a></li>
        <li><a href="https://www.instagram.com/foodnotbombsdc/" target="_blank">DC Food Not Bombs</a></li>
        <li><a href="https://www.instagram.com/goodtroubleco.op/" target="_blank">Good Trouble Cooperative</a></li>
        <li><a href="https://consistentmoneymoving.org/?fbclid=PAZXh0bgNhZW0CMTEAAacj_p6M4QcLo9J6NSnhYWZW471Gtpqm3M-9PtRI_H5d9xx5D2DZyowaEXkprA_aem_7nZDJv1KCgMrVL5yWeUTfg" target="_blank">Consistent Money Moving Project</a></li>
      </ul>

      <h2>More to Explore:-))</h2>
      <ul>
        <li><a href="https://tpss.coop/" target="_blank">Takoma Park Silver Spring Co-op</a></li>
        <li><a href="https://glut.org/" target="_blank">Glut Food Co-op</a></li>
      </ul>
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
