<script setup lang="ts">
import {RouterView} from 'vue-router'
</script>

<template>
    <body class="app-container">
      <div class="content-container">
        <RouterView />
      </div>
    </body>
</template>

<style scoped>


.app-container {
  display: flex;
  height: 100vh;
  margin: 0px;
}

.sidebar {
  width: 80px;
  flex-shrink: 0;
}

.content-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #0c0c0c;
  color: #ffffff;
}

.logged-in {
  margin-left: 80px; /* Adjust for sidebar width */
}

</style>
