import { useFetch, UseFetchReturn, createGlobalState } from '@vueuse/core';
import { API_BASE_URL } from '@/constants'

export type Keyboard = {
    keyboard_folder: string,
    tags?: string[]
    community_layouts?: string[]
    layouts: Record<string, unknown>;
    [key: string]: unknown
};

export type KeyboardMap = Record<string, Keyboard>;

export const useKeyboards = createGlobalState((): UseFetchReturn<KeyboardMap> & PromiseLike<UseFetchReturn<KeyboardMap>> => {
    return useFetch(`${API_BASE_URL}/keyboards.json`, {

        afterFetch(ctx) {
            let keyboards: KeyboardMap = ctx.data.keyboards;

            Object.values(keyboards).forEach((kb) => {
                let tags = new Set(kb.tags ?? []);

                Object.keys(kb.layouts).forEach((layout) => {
                    for (let token of ['ortho', 'ansi', 'iso', '60', '65', '75', '96', 'alice', 'fullsize', 'tkl', 'numpad']) {
                        if (layout.includes(token)) {
                            tags.add(token);
                        }
                    }
                });

                if ('split' in kb) {
                    tags.add('split')
                }

                kb.community_layouts = kb.community_layouts ?? [];
                kb.tags = [...tags];
            })
            ctx.data = ctx.data.keyboards;
            return ctx;
        },
    }).get().json();
});
