import { useFetch } from '@vueuse/core';
import { API_BASE_URL } from '@/constants'

export const useKeyboardConfig = async (keyboard: string) => {
  return useFetch(`${API_BASE_URL}/keyboards/${keyboard}/info.json`, {
    afterFetch(ctx) {
      ctx.data = ctx.data.keyboards[keyboard];
      return ctx;
    },
  }).get().json();
};
