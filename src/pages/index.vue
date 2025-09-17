<template>
  <v-container class="py-8 px-6 h-100" fluid>
  
    <h2>All Supported Keyboards</h2>

    <p class="py-4 d-none d-md-flex">
      This page is automatically generated from keyboards currently in QMK.
      Default firmware files are up-to-date with the latest version of QMK.
    </p>

    <v-row no-gutters>
      <v-text-field ref="search_field" density="comfortable" min-width="50%"
      class="py-2" v-model="search" label="Search" prepend-inner-icon="fa-solid fa-search" variant="outlined"
      hide-details single-line clearable/>
      <v-spacer></v-spacer>
      <v-btn class="my-2" size="large" variant="tonal" prepend-icon="fa-solid fa-filter" @click="drawer=true" :disabled="!isFinished">
        <span v-if="!mobile">Filter</span>
        <template v-slot:append v-if="filter_count">
          <v-badge
            color="orange"
            :content="filter_count"
            inline
          ></v-badge>
        </template>
      </v-btn>
    </v-row>

    <v-navigation-drawer width="400" temporary v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : 'right'">
      <v-list>
        <v-list-subheader>Filters</v-list-subheader>

        <v-list-item>
          <v-list-item-title>Tags</v-list-item-title>
          <v-list-item-subtitle>Generated metadata describing the keyboard.</v-list-item-subtitle>
          <v-select class="py-2" :items="KEYBOARD_TAGS" chips multiple clearable density="comfortable" v-model="tags"/>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Features</v-list-item-title>
          <v-list-item-subtitle>Software/hardware features enabled by the keyboard.</v-list-item-subtitle>
          <v-select class="py-2" :items="KEYBOARD_FEATURES" chips multiple clearable density="comfortable" v-model="features"/>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Layouts</v-list-item-title>
          <v-list-item-subtitle>Community layouts supported by the keyboard.</v-list-item-subtitle>
          <v-select class="py-2" :items="KEYBOARD_LAYOUTS" chips multiple clearable density="comfortable" v-model="layouts"/>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>Converters</v-list-item-title>
          <v-list-item-subtitle>Supports drop-in replacement controllers.</v-list-item-subtitle>
          <v-select class="py-2" :items="['promicro', 'elite_c']" chips multiple clearable density="comfortable" v-model="converters"/>
        </v-list-item>

        <v-list-item>
          <v-btn variant="tonal" block @click="resetFilter">Reset</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet border>
      <!-- @vue-expect-error header[].align causing ts errors -->
      <v-data-table-virtual color="red" fixed-header disable-sort height="calc(100vh - 23em)" :loading="!isFinished" striped="even"
        :headers="virtual_headers" :items="virtual_keyboards" item-value="keyboard">
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
import { refDebounced } from '@vueuse/core'
import { useHotkey, useDisplay } from 'vuetify';

import { KEYBOARD_TAGS, KEYBOARD_FEATURES, KEYBOARD_LAYOUTS } from '@/constants'

import { useKeyboards } from '@/composables/useKeyboards'
import { useFirmwareList } from '@/composables/useFirmwareList'

const route = useRoute();
const { smAndDown:mobile } = useDisplay()

const { data: firmware_files } = await useFirmwareList()
const { data: keyboards, isFinished } = useKeyboards()

const search_field = ref<HTMLDivElement>();
const search = ref(route.query.search as string)

const search_debounced = refDebounced(search, 250);

const drawer = ref(false)
const tags = ref([])
const features = ref([])
const layouts = ref([])
const converters = ref([])

useHotkey('ctrl+f', () => {
  search_field.value?.focus();
});

const resetFilter = () => {
  tags.value = [];
  layouts.value = [];
};

const filter_count = computed(() => {
  return tags.value.length + layouts.value.length;
});

const virtual_headers = computed(() => {
  if (mobile.value) {
    return [
      { title: 'Keyboard', key: 'keyboard' }
    ];
  } else {
    return  [
      { title: 'Keyboard', key: 'keyboard', align: 'start', width: '80%' },
      { title: 'QMK Folder', key: 'folder', align: 'center', width: '10%' },
      { title: 'Firmware', key: 'firmware', align: 'center', width: '10%' }
    ];
  }
});

import { filter as liqe_filter, parse as liqe_parse } from 'liqe';

const virtual_keyboards = computed<{keyboard: string, firmware: string, folder: string}[]>(() => {
  if(!keyboards.value || !firmware_files.value) {
    return [];
  }

  const terms: string[] = [
    ...tags.value.map((x) => `tags:"${x}"`),
    ...features.value.map((x) => `features.${x}:true`),
    ...layouts.value.map((x) => `community_layouts:"${x}"`),
    ...converters.value.map((x) => `pin_compatible:"${x}"`),
    search_debounced.value ? `keyboard_folder:"${search_debounced.value.toLowerCase()}"` : ''
  ];

  const search_string = terms.join(' ');
  const found = search_string ? liqe_filter(liqe_parse(search_string), Object.values(keyboards.value)) : Object.values(keyboards.value);

  return found.map((kb_info) => {
    const kb = kb_info.keyboard_folder;
    const kb_safe = kb.replaceAll('/', '_');

    const fm = firmware_files.value![kb_safe];

    return {
      keyboard: kb,
      firmware: fm.url ?? '',
      folder: `https://github.com/qmk/qmk_firmware/tree/master/keyboards/${kb}`
    }
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
