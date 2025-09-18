<template>
  <v-container class="py-8 px-6 h-100" fluid>
  
    <h2>All Supported Keyboards</h2>

    <p class="py-4 d-none d-md-flex">
      This page is automatically generated from keyboards currently in QMK.
      Default firmware files are up-to-date with the latest version of QMK.
    </p>

    <v-row no-gutters>
      <v-text-field ref="searchField" density="comfortable" min-width="50%"
      class="py-2" v-model="search" label="Search" prepend-inner-icon="fa-solid fa-search" variant="outlined"
      hide-details single-line clearable/>
      <v-spacer></v-spacer>
      <v-btn class="my-2" size="large" variant="tonal" prepend-icon="fa-solid fa-filter" @click="drawer=true" :disabled="!isFinished">
        <span v-if="!mobile">Filter</span>
        <template v-slot:append v-if="filterCount">
          <v-badge
            color="orange"
            :content="filterCount"
            inline
          ></v-badge>
        </template>
      </v-btn>
    </v-row>

    <v-navigation-drawer :width="!mobile ? 400 : undefined" temporary v-model="drawer" location="right">
      <v-list>
        <v-list-subheader>Filters</v-list-subheader>

        <v-list-item title="Tags">
          <v-select class="pt-2 mb-n2" :items="KEYBOARD_TAGS" chips multiple clearable density="compact" v-model="tags"/>
        </v-list-item>

        <v-list-item title="Features">
          <v-select class="pt-2 mb-n2" :items="KEYBOARD_FEATURES" chips multiple clearable density="compact" v-model="features"/>
        </v-list-item>

        <v-list-item title="Layouts">
          <v-select class="pt-2 mb-n2" :items="KEYBOARD_LAYOUTS" chips multiple clearable density="compact" v-model="layouts"/>
        </v-list-item>

        <v-list-item title="Converter Support">
          <v-select class="pt-2 mb-n2" :items="['promicro', 'elite_c']" chips multiple clearable density="compact" v-model="converters"/>
        </v-list-item>

        <v-list-item>
          <v-btn variant="tonal" block @click="resetFilter">Reset</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet border>
      <!-- @vue-expect-error header[].align causing ts errors -->
      <v-data-table-virtual fixed-header disable-sort height="calc(100vh - 23em)" :loading="!isFinished" striped="even"
        :headers="virtualHeaders" :items="virtualKeyboards" item-value="keyboard">
        <template #[`item.keyboard`]="{ item }">
          <v-btn variant="text" :to="`/keyboard/${item.keyboard}`">{{ item.keyboard }}</v-btn>
        </template>
        <template #[`item.folder`]="{ item }">
          <v-btn variant="text" icon="fa-brands fa-github" :href="item.folder" />
        </template>
        <template #[`item.firmware`]="{ item }">
          <v-btn variant="text" icon="fa-solid fa-download" :href="item.firmware" v-if="item.firmware" />
        </template>
      </v-data-table-virtual>
    </v-sheet>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { refDebounced } from '@vueuse/core';
import { useHotkey, useDisplay } from 'vuetify';
import { filter as liqe_filter, parse as liqe_parse } from 'liqe';

import { KEYBOARD_TAGS, KEYBOARD_FEATURES, KEYBOARD_LAYOUTS } from '@/constants';

import { useKeyboards } from '@/composables/useKeyboards';
import { useFirmwareList, toFirmwareListKey } from '@/composables/useFirmwareList';

const route = useRoute();
const { smAndDown:mobile } = useDisplay();

const { data: firmwareFiles } = await useFirmwareList();
const { data: keyboards, isFinished } = useKeyboards();

const searchField = ref();
const search = ref(route.query.search as string);

const searchDebounced = refDebounced(search, 250);

const drawer = ref(false);
const tags = ref([]);
const features = ref([]);
const layouts = ref([]);
const converters = ref([]);

useHotkey('ctrl+f', () => {
  searchField.value?.focus();
});

const resetFilter = () => {
  tags.value = [];
  features.value = [];
  layouts.value = [];
  converters.value = [];
};

const filterCount = computed(() => {
  return tags.value.length + features.value.length + layouts.value.length + converters.value.length;
});

const virtualHeaders = computed(() => {
  if (mobile.value) {
    return [
      { title: 'Keyboard', key: 'keyboard' },
    ];
  } else {
    return  [
      { title: 'Keyboard', key: 'keyboard', align: 'start', width: '80%' },
      { title: 'QMK Folder', key: 'folder', align: 'center', width: '10%' },
      { title: 'Firmware', key: 'firmware', align: 'center', width: '10%' },
    ];
  }
});

const virtualKeyboards = computed<{keyboard: string, firmware: string, folder: string}[]>(() => {
  if(!keyboards.value || !firmwareFiles.value) {
    return [];
  }

  const terms: string[] = [
    ...tags.value.map((x) => `tags:"${x}"`),
    ...features.value.map((x) => `features.${x}:true`),
    ...layouts.value.map((x) => `community_layouts:"${x}"`),
    ...converters.value.map((x) => `pin_compatible:"${x}"`),
    searchDebounced.value ? `keyboard_folder:"${searchDebounced.value.toLowerCase()}"` : '',
  ];

  const search = terms.join(' ');
  const found = search ? liqe_filter(liqe_parse(search), Object.values(keyboards.value)) : Object.values(keyboards.value);

  return found.map((info) => {
    const kb = info.keyboard_folder;
    const fm = firmwareFiles.value![toFirmwareListKey(kb)];

    return {
      keyboard: kb,
      firmware: fm.url ?? '',
      folder: `https://github.com/qmk/qmk_firmware/tree/master/keyboards/${kb}`,
    };
  });
});
</script>

<style lang="scss">
.v-field--variant-outlined.v-field--focused .v-field__outline {

  .v-field__outline__start,
  .v-field__outline__end {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
