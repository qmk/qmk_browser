<template>
  <v-container v-if="config">
    <v-banner lines="one" bg-color="transparent">
      <v-banner-text>
        <h1>{{ config.keyboard_name }}</h1>
      </v-banner-text>

      <template v-slot:actions>
        <div class="hidden-sm-and-down">
        <v-btn class="ma-2 align-self-end" color="primary" variant="elevated" prepend-icon="fa-brands fa-github"
        :href="`https://github.com/qmk/qmk_firmware/tree/master/keyboards/${kb_path}`">QMK</v-btn>
        <v-btn class="ma-2 align-self-end" color="orange" variant="elevated" prepend-icon="fa-solid fa-download"
        :href="firmware_files[fm_name].url" v-if="firmware_files[fm_name]?.url">Firmware</v-btn>
        </div>
      </template>
    </v-banner>

    <!-- TODO: actual keyboard image -->
    <div class="text-center">
      <v-icon size=300>fa-regular fa-keyboard</v-icon>
    </div>
  
    <!-- <p>TODO: description</p> -->

    <!-- TODO: requires consistent config -->
    <!-- <ul class="mx-10 my-4">
      <li v-if="config.maintainer">
        Keyboard Maintainer:
        <a :href="`https://github.com/${config.maintainer}`">{{ config.maintainer }}</a>
      </li>
      <li v-if="config.url">
        Hardware Availability:
        <a :href="config.url">{{ config.url }}</a>
      </li>
    </ul> -->
  
    <h2>Make example for this keyboard (after setting up your build environment):</h2>
    <pre><code>qmk compile -kb {{ kb_path }} -km default</code></pre>

    <h2>Flashing example for this keyboard:</h2>
    <pre><code>qmk flash -kb {{ kb_path }} -km default</code></pre>

    <p class="my-2">
      See the
      <a href="https://docs.qmk.fm/getting_started_build_tools">build environment</a>
      and the
      <a href="https://docs.qmk.fm/getting_started_make_guide">make instructions</a>
      for more information. Brand new to QMK? Start with our
      <a href="https://docs.qmk.fm/newbs">Complete Newbs Guide</a>.
    </p>

    <h2>Bootloader</h2>
    <p>Enter the bootloader using one of the following methods:</p>
    <ul class="mx-10 my-4">
      <li v-if="config.features.bootmagic">
        Bootmagic reset: Hold down the key at {{ config.bootmagic?.matrix ?? [0, 0] }} in the matrix
        (usually the top left key or Escape) and plug in the keyboard
      </li>
      <li>
        Keycode in layout: Press the key mapped to <code class="v-code">QK_BOOT</code> if it is available
      </li>
      <!-- TODO: requires bootloader_instructions to not duplicate the above logic-->
      <!-- <li v-if="config.bootloader_instructions">
        {{ config.bootloader_instructions }}
      </li> -->
    </ul>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useKeyboardConfig } from '@/composables/useKeyboardConfig'
import { useFirmwareList } from '@/composables/useFirmwareList'

const route = useRoute();
const router = useRouter();

const kb_path = computed(() => {
  return (route.params.kb as string[]).join('/');
});

const fm_name = computed(() => {
  return kb_path.value.replaceAll('/', '_');
});

const { data: firmware_files } = await useFirmwareList()
const { data: config, error } = await useKeyboardConfig(kb_path.value);

if (error.value) {
  router.push('/404')
}
</script>
