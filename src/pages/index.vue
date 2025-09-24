<template>
  <v-container class="pt-6 px-6 h-100" fluid>
  
    <h2>All Supported Keyboards</h2>

    <p class="py-4 d-none d-md-flex">
      This page is automatically generated from keyboards currently in QMK.
      Default firmware files are up-to-date with the latest version of QMK.
    </p>

    <v-row no-gutters>
      <v-text-field ref="searchField" v-model="search" density="comfortable" hide-details single-line clearable
                    min-width="50%" class="py-2" label="Search" prepend-inner-icon="fa-solid fa-search" variant="outlined" />
      <v-spacer />
      <v-btn class="my-2" size="large" variant="tonal" prepend-icon="fa-solid fa-filter" :disabled="!isFinished" @click="drawer=true">
        <span v-if="!mobile">Filter</span>
        <template v-if="filterCount" #append>
          <v-badge color="orange" :content="filterCount" inline />
        </template>
      </v-btn>
    </v-row>

    <config-panel v-model="drawer" title="Filters">
      <v-list>
        <v-list-item title="Tags">
          <v-list-item-subtitle>Generated metadata describing the keyboard.</v-list-item-subtitle>
          <v-select v-model="tags" class="pt-2 mb-n2" :items="tagItems" chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Features">
          <v-list-item-subtitle>Software/hardware features enabled by the keyboard.</v-list-item-subtitle>
          <v-select v-model="features" class="pt-2 mb-n2" :items="KEYBOARD_FEATURES" chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Layouts">
          <v-list-item-subtitle>Community layouts supported by the keyboard.</v-list-item-subtitle>
          <v-select v-model="layouts" class="pt-2 mb-n2" :items="KEYBOARD_LAYOUTS" chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Converter Support">
          <v-list-item-subtitle>Supports drop-in replacement controllers.</v-list-item-subtitle>
          <v-select v-model="converters" class="pt-2 mb-n2" :items="['promicro', 'elite_c']" chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Advanced">
          <v-list-item-subtitle>Additional <a target="_blank" rel="noopener noreferrer" href="https://github.com/gajus/liqe?tab=readme-ov-file#liqe-syntax-cheat-sheet">Liqe</a> query appended to search.</v-list-item-subtitle>
          <v-text-field v-model="raw" class="pt-2 mb-n2" autocomplete="off" clearable density="compact" placeholder="Example: rgb_matrix.led_count:>120" :rules="[liqeValidate]" @click:clear="raw = ''" />
        </v-list-item>

        <v-list-item>
          <v-btn variant="tonal" block @click="resetFilter">Reset</v-btn>
        </v-list-item>
      </v-list>
    </config-panel>

    <v-sheet border>
      <!-- @vue-expect-error header[].align causing ts errors -->
      <v-data-table-virtual fixed-header disable-sort :height="`calc(100dvh - ${mobile ? 19 : 23}em)`" :loading="!isFinished" striped="even"
                            :headers="virtualHeaders" :items="virtualKeyboards" item-value="keyboard">
        <template #[`item.keyboard`]="{ item }">
          <v-btn variant="text" :to="`/keyboard/${item.keyboard}`">{{ item.keyboard }}</v-btn>
        </template>
        <template #[`item.folder`]="{ item }">
          <v-btn variant="text" icon="fa-brands fa-github" :href="item.folder" />
        </template>
        <template #[`item.firmware`]="{ item }">
          <v-btn v-if="item.firmware" variant="text" icon="fa-solid fa-download" :href="item.firmware" />
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

const drawer = ref(false);
const tags = ref([]);
const features = ref([]);
const layouts = ref([]);
const converters = ref([]);
const raw = ref('');

const searchDebounced = refDebounced(search, 250);
const rawDebounced = refDebounced(raw, 500);

useHotkey('ctrl+f', () => {
  searchField.value?.focus();
});

const resetFilter = () => {
  tags.value = [];
  features.value = [];
  layouts.value = [];
  converters.value = [];
  raw.value = '';
};

const tagItems = computed(() => {
  return KEYBOARD_TAGS.map(tag => ({ title: +tag ? `${tag}%` : tag, value: tag}));
});

const filterCount = computed(() => {
  return tags.value.length + features.value.length + layouts.value.length + converters.value.length + ((raw.value && raw.value.length) ? 1 : 0);
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
    liqeValidate(rawDebounced.value) ? rawDebounced.value : '',
    searchDebounced.value ? `keyboard_folder:"${searchDebounced.value.toLowerCase()}"` : '',
  ];

  const search = terms.filter(x => x).join(' ');
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

const liqeValidate = (value: string) => {
  if (value && !value.trim()) {
    return false;
  }
  try {
    liqe_parse(value);
    return true;
  } catch {
    return false;
  }
};
</script>

<style lang="scss">
.v-field--variant-outlined.v-field--focused .v-field__outline {
  .v-field__outline__start,
  .v-field__outline__end {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
