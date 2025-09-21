import { useFetch, UseFetchReturn, createGlobalState } from '@vueuse/core';
import { CI_BASE_URL } from '@/constants';

export type FirmwareItem = {
  url: string;
  filename: string;
};

export type FirmwareList = Record<string, FirmwareItem>;

export const useFirmwareList = createGlobalState((): UseFetchReturn<FirmwareList> & PromiseLike<UseFetchReturn<FirmwareList>> => {
  return useFetch(`${CI_BASE_URL}/firmware_list.json`, {
    afterFetch(ctx) {
      const ret: FirmwareList = {};
      for (const filename of ctx.data.files) {
        // TODO: handle non-default firmware files
        const key: string = filename.split('_default.')[0];
        ret[key] = {
          url: `${CI_BASE_URL}/${filename}`,
          filename,
        };
      }
      ctx.data = ret;
      return ctx;
    },
  }).get().json();
});

export const toFirmwareListKey = (keyboard: string) => {
  return keyboard.replaceAll('/', '_');
};
