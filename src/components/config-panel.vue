<template>
    <v-navigation-drawer v-if="!mobile" width="500" temporary v-model="model" location="right">
      <h2 class="pt-2 px-4">{{ title }}</h2>

      <slot></slot>
    </v-navigation-drawer>

    <v-dialog v-else fullscreen v-model="model">
      <v-card>
        <v-toolbar>
          <v-btn icon="fa-solid fa-close" @click="model = false"/>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>

        <slot></slot>
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
