<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="container-fluid">
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginLayout",
});
</script>
