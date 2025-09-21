<template>
  <v-navigation-drawer v-if="!mobile" v-model="model" width="500" temporary location="right">
    <h2 class="pt-2 px-4">{{ title }}</h2>

    <slot />
  </v-navigation-drawer>

  <v-dialog v-else v-model="model" fullscreen>
    <v-card>
      <v-toolbar>
        <v-btn icon="fa-solid fa-close" @click="model = false" />
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>

      <slot />
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

const { smAndDown:mobile } = useDisplay();

const model = defineModel<boolean>();

defineProps<{
  title?: string,
}>();
</script>
