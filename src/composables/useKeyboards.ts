import { useFetch, UseFetchReturn, createGlobalState } from '@vueuse/core';
import { API_BASE_URL } from '@/constants';

const LAYOUT_TAGS = ['ortho', 'ansi', 'iso', '60', '65', '75', '96', 'alice', 'fullsize', 'tkl', 'numpad'];

export type Keyboard = {
    keyboard_folder: string;
    tags?: string[];
    community_layouts?: string[];
    layouts: Record<string, unknown>;
    led_matrix?: {
        layout?: unknown;
    };
    rgb_matrix?: {
        layout?: unknown;
    };
    [key: string]: unknown;
};

export type KeyboardMap = Record<string, Keyboard>;

export const useKeyboards = createGlobalState((): UseFetchReturn<KeyboardMap> & PromiseLike<UseFetchReturn<KeyboardMap>> => {
    return useFetch(`${API_BASE_URL}/keyboards.json`, {

        afterFetch(ctx) {
            const keyboards: KeyboardMap = ctx.data.keyboards;

            Object.values(keyboards).forEach((kb) => {
                const tags = new Set(kb.tags ?? []);

                Object.keys(kb.layouts).forEach((layout) => {
                    for (const token of LAYOUT_TAGS) {
                        if (layout.includes(token)) {
                            tags.add(token);
                        }
                    }
                });

                if ('split' in kb) {
                    tags.add('split');
                }

                kb.community_layouts = kb.community_layouts ?? [];
                kb.tags = [...tags];

                // Remove layout data - reduces case insensitive search from 1400ms to 100ms
                kb.layouts = {};
                if (kb.rgb_matrix && kb.rgb_matrix.layout) {
                    kb.rgb_matrix.layout = {};
                }
                if (kb.led_matrix && kb.led_matrix.layout) {
                    kb.led_matrix.layout = {};
                }
            })
            ctx.data = ctx.data.keyboards;
            return ctx;
        },
    }).get().json();
});
