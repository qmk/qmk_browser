<template>
  <v-container class="pt-6 px-6 h-100" fluid>
  
    <h2>All Supported Keyboards</h2>

    <p class="py-4 d-none d-md-flex">
      This page is automatically generated from keyboards currently in QMK.
      Default firmware files are up-to-date with the latest version of QMK.
    </p>

    <v-row no-gutters>
      <v-text-field ref="searchNode" v-model="search" density="comfortable" hide-details single-line clearable
                    min-width="50%" class="py-2" label="Search" prepend-inner-icon="fa-solid fa-search" variant="outlined" />
      <v-spacer />
      <v-btn class="my-2" size="large" variant="tonal" prepend-icon="fa-solid fa-filter" :disabled="!isFinished" @click="drawer=true">
        <span v-if="!mobile">Filter</span>
        <template v-if="filter.count" #append>
          <v-badge color="orange" :content="filter.count" inline />
        </template>
      </v-btn>
    </v-row>

    <config-panel v-model="drawer" title="Filters">
      <v-list>
        <v-list-item title="Tags">
          <v-list-item-subtitle>Metadata describing the keyboard.</v-list-item-subtitle>
          <v-select v-model="filter.tags" class="pt-2" :items="tagItems" hide-details chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Features">
          <v-list-item-subtitle>Enabled Software/hardware features.</v-list-item-subtitle>
          <v-select v-model="filter.features" class="pt-2" :items="KEYBOARD_FEATURES" hide-details chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Layouts">
          <v-list-item-subtitle>Supports community layouts.</v-list-item-subtitle>
          <v-select v-model="filter.layouts" class="pt-2" :items="KEYBOARD_LAYOUTS" hide-details chips multiple clearable density="compact" />
        </v-list-item>

        <v-list-item title="Keys">
          <v-list-item-subtitle>Number of keys defined within layout.</v-list-item-subtitle>
          <v-number-input v-model="filter.keys" class="pt-2" :min="1" hide-details clearable density="compact" />
        </v-list-item>

        <v-list-item title="Development Boards">
          <v-list-item-subtitle>Configures controller preset.</v-list-item-subtitle>
          <v-select v-model="filter.board" class="pt-2" :items="DEVELOPMENT_BOARDS" hide-details chips clearable density="compact" />
        </v-list-item>

        <v-list-item title="Converter Support">
          <v-list-item-subtitle>Supports drop-in replacement controllers.</v-list-item-subtitle>
          <v-select v-model="filter.converter" class="pt-2" :items="CONVERTER_BASE" hide-details chips clearable density="compact" />
        </v-list-item>

        <v-list-item title="Advanced">
          <v-list-item-subtitle>Append raw <a target="_blank" rel="noopener noreferrer" :href="LIQE_URL">Liqe</a> query to search. Examples:</v-list-item-subtitle>
          <ul class="pl-6 ma-1 text-caption text-medium-emphasis">
            <li>layouts.key_count:[100 TO 200]</li>
            <li>rgb_matrix.led_count:&gt;120</li>
            <li>split.serial.driver:usart</li>
          </ul>
          <v-text-field v-model="filter.raw" class="pt-2" hide-details autocomplete="off" clearable density="compact":rules="[liqeValidate]" />
        </v-list-item>

        <v-list-item>
          <v-btn variant="tonal" block @click="filter.$reset()">Reset</v-btn>
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
import { storeToRefs } from 'pinia';

import { KEYBOARD_TAGS, KEYBOARD_FEATURES, KEYBOARD_LAYOUTS, DEVELOPMENT_BOARDS, CONVERTER_BASE } from '@/constants';

import { KeyboardMap, useKeyboards } from '@/composables/useKeyboards';
import { useFirmwareList, toFirmwareListKey } from '@/composables/useFirmwareList';
import { useFilterStore } from '@/stores/useFilterStore';

const LIQE_URL = 'https://github.com/gajus/liqe?tab=readme-ov-file#liqe-syntax-cheat-sheet';

const route = useRoute();
const { smAndDown:mobile } = useDisplay();

const { data: firmwareFiles } = await useFirmwareList();
const { data: keyboards, isFinished } = useKeyboards();

const filter = useFilterStore();

const searchNode = ref();
const search = ref(route.query.search as string);

const drawer = ref(false);

const searchDebounced = refDebounced<string>(search, 250);
const rawDebounced = refDebounced<string | null>(storeToRefs(filter).raw, 500);

useHotkey('ctrl+f', () => {
  searchNode.value?.focus();
});

const tagItems = computed(() => {
  return KEYBOARD_TAGS.map(tag => ({ title: +tag ? `${tag}%` : tag, value: tag}));
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

  const found = filterKeyboards(keyboards.value);
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

const filterKeyboards = (keyboards:KeyboardMap) => {
  const terms: string[] = [
    ...filter.tags.map((x) => `tags:"${x}"`),
    ...filter.features.map((x) => `features.${x}:true`),
    ...filter.layouts.map((x) => `community_layouts:"${x}"`),
    filter.keys ? `layouts.key_count:=${filter.keys}` : '',
    filter.board ? `development_board:"${filter.board}"` : '',
    filter.converter ? `pin_compatible:"${filter.converter}"` : '',
    rawDebounced.value && liqeValidate(rawDebounced.value) ? rawDebounced.value : '',
    searchDebounced.value ? `keyboard_folder:"${searchDebounced.value.toLowerCase()}"` : '',
  ];

  const search = terms.filter(x => x).join(' ');
  
  const values = Object.values(keyboards);
  return search ? liqe_filter(liqe_parse(search), values) : values;
};

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
