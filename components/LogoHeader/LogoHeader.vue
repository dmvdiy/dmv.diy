<template>
  <div class="header-c">
    <div class="left-section">
      <router-link to="/" class="logo-link">
        <img src="/css/dmvdiylogo.png" class="logo" />
      </router-link>
      <div class="text-block">
        <div class="title">DC Metro Area Community Calendar</div>
        <div class="links">
          <router-link to="/about" class="nav-link">About</router-link>
          <span class="separator">|</span>
          <router-link to="/resources" class="nav-link">Resources</router-link>
          <span class="separator">|</span>
          <a href="https://form.jotform.com/dmvdiyfyi/dmv-diy-calendar-submission" class="nav-link">Submit</a>
        </div>
      </div>
    </div>
    <div class="buttons">
      <a href="https://form.jotform.com/dmvdiyfyi/dmv-diy-calendar-submission">
        <img src="/css/dmvdiysubmitbutton.png" class="btn" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoHeader'
}
</script>

<style scoped src="./LogoHeader.css" />