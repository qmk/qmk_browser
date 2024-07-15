import { useFetch, createGlobalState } from '@vueuse/core';
import { CI_BASE_URL } from '@/constants'

export const useFirmwareList = createGlobalState(async () => {
  return await useFetch(`${CI_BASE_URL}/firmware_list.json`, {
    afterFetch(ctx) {
      const ret: Record<string, any> = {};
      for (const filename of ctx.data.files) {
        // TODO: handle non-default firmware files
        const safe_kb = filename.split('_default')[0];
        ret[safe_kb] = {
          url: `${CI_BASE_URL}/${filename}`,
          filename,
        };
      }
      ctx.data = ret;
      return ctx;
    },
  }).get().json();
});
