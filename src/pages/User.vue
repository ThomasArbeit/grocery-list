<template>
  <Page title="Mes listes">
    <Button @click="emit('select')">Click me</Button>
  </Page>
</template>

<script setup lang="ts">
import Button from '../components/Button.vue';
import Page from '../components/Page.vue';

const emit = defineEmits<{
  (e: 'select'): void;
}>();

</script>
