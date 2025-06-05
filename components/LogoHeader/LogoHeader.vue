<template>
  <div class="logo-button-row">
    <div class="logo-wrapper">
      <img
        src="/css/dmvdiylogo.png"
        alt="DMV DIY Logo"
        class="logo-image"
      />
    </div>
    <div class="submit-wrapper">
      <a
        href="https://form.jotform.com/dmvdiyfyi/dmv-diy-calendar-submission"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/css/dmvdiysubmitbutton.png"
          alt="Submit Event"
          class="submit-button-image"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ logoSrc: string }>();
</script>

<style scoped src="./LogoHeader.css" />