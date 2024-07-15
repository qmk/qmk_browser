import { useFetch, createGlobalState } from '@vueuse/core';
import { API_BASE_URL } from '@/constants'

export const useKeyboardList = createGlobalState(async () => {
  return await useFetch(`${API_BASE_URL}/keyboard_list.json`, {
    afterFetch(ctx) {
      ctx.data = ctx.data.keyboards;
      return ctx;
    },
  }).get().json();
});
