<template>
  <div class="header-c">
    <img src="/css/dmvdiylogo.png" class="logo" />
    <div class="text-block">
      <div class="title">DC Metro Area Community Calendar</div>
      <div class="links">About | Resources | Submit</div>
    </div>
    <div class="buttons">
      <img src="/css/dmvdiysubmitbutton.png" class="btn" />
    </div>
  </div>
</template>

<style scoped>
.header-c {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.logo { height: 100px; }

.text-block {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.title {
  font-size: 1.6rem;
  font-weight: bold;
}

.links {
  margin-top: 0.25rem;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.btn { height: 80px; }
</style>
