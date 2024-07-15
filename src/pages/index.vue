<template>
  <v-container class="py-8 px-6 h-100" fluid>
  
    <h2>All Supported Keyboards</h2>

    <p class="py-4 d-none d-md-flex">
      This page is automatically generated from keyboards currently in QMK.
      Default firmware files are up-to-date with the latest version of QMK.
    </p>

    <div class="d-flex flex-column flex-sm-row">
      <v-text-field v-shortkey="['ctrl', 'f']" @shortkey="focus_search" ref="search_field" density="comfortable"
        class="py-2" v-model="search" label="Search" prepend-inner-icon="fa-solid fa-search" variant="outlined"
        hide-details single-line clearable/>
    </div>

    <!-- @vue-expect-error header[].align causing ts errors -->
    <v-data-table-virtual fixed-header disable-sort height="calc(100vh - 23em)" :loading="!isFinished" :search="search"
      :headers="virtual_headers" :items="virtual_keyboards" item-value="keyboard">
      <template #[`item.keyboard`]="{ item }">
        <v-btn variant="plain" :to="`/keyboard/${item.keyboard}`">{{ item.keyboard }}</v-btn>
      </template>
      <template #[`item.folder`]="{ item }">
        <v-btn variant="plain" icon="fa-brands fa-github" :href="item.folder" />
      </template>
      <template #[`item.firmware`]="{ item }">
        <v-btn variant="plain" icon="fa-solid fa-download" :href="item.firmware" v-if="item.firmware" />
      </template>
    </v-data-table-virtual>

  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useKeyboardList } from '@/composables/useKeyboardList'
import { useFirmwareList } from '@/composables/useFirmwareList'

const route = useRoute();

const { data: firmware_files } = await useFirmwareList()
const { data: keyboard_list, isFinished } = await useKeyboardList();

const search_field = ref<HTMLDivElement>();
const search = ref(route.query.search as string)

const focus_search = () => {
  search_field.value?.focus();
};

const virtual_headers = [
  { title: 'Keyboard', key: 'keyboard', align: 'start', width: '70%' },
  { title: 'QMK Folder', key: 'folder', align: 'center', width: '15%' },
  { title: 'Firmware', key: 'firmware', align: 'center', width: '15%' }
]

const virtual_keyboards = computed<{keyboard: string, firmware: string, folder: string}[]>(() => {
  return keyboard_list.value.map((kb: string) => {
    const kb_safe = kb.replaceAll('/', '_')

    return {
      keyboard: kb,
      firmware: firmware_files.value[kb_safe]?.url ?? '',
      folder: `https://github.com/qmk/qmk_firmware/tree/master/keyboards/${kb}`
    }
  });
})
</script>

<style lang="scss">
.v-field--variant-outlined.v-field--focused .v-field__outline {

  .v-field__outline__start,
  .v-field__outline__end {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
