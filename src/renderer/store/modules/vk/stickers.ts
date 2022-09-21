import DateDiff from "date-diff";
import Promise from "bluebird";
import { ipcRenderer } from "electron";
import { StoreProduct } from "vk-io/lib/api/schemas/objects";
import { StoreGetProductsParams, StoreGetStickersKeywordsParams } from "vk-io/lib/api/schemas/params";
import { StoreGetStickersKeywordsResponse } from "vk-io/lib/api/schemas/responses";
import Sticker from "~/instances/Messages/Attachments/Sticker";
import StickersCollection from "~/instances/Messages/StickersCollection";

type TFavoriteResponse = {
    count: number
    items: Sticker[]
};

const params: StoreGetProductsParams = {
    type: "stickers",
    filters: "active",
    extended: 1
};

const keywordsParams: StoreGetStickersKeywordsParams = {
    aliases: 1,
    all_products: 1,
    need_stickers: 1
};

export default {
    namespaced: true,

    state: () => ({
        stickersExist: false,

        favorite: {},

        emoji: new StickersCollection({
            id: -2,
            title: "",
            preview: "",
            purchase_date: 0,
            stickers: []
        }),

        collections: [],
        words: {}
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }) => {
            /*
                Обновляем список стикеров раз в полчаса при перезапуске
                (кроме избранных)
            */

            const formatted = await dispatch("FORMAT", rootState.config.stickers);
            state.collections = formatted.collections;
            state.words = formatted.words;
            state.stickersExist = state.collections.length > 0;

            const diff = new DateDiff(
                new Date(Date.now()),
                new Date(rootState.config.stickers.updated)
            );

            if (diff.minutes() >= 30) {
                const { response, keywordsResponse } = await dispatch("FETCH_REMOTE");

                const formatted = await dispatch("FORMAT", { response, keywordsResponse });
                state.collections = formatted.collections;
                state.words = formatted.words;
                state.stickersExist = state.collections.length > 0;

                dispatch("settings/SAVE_CUSTOM", {
                    type: "stickers",
                    space: 0,
                    content: {
                        updated: Date.now(),
                        response,
                        keywordsResponse
                    }
                }, { root: true });
            }

            const favorite: TFavoriteResponse =
                await rootState.vk.client.api.store.getFavoriteStickers();

            if (favorite.count > 0) {
                state.favorite = new StickersCollection({
                    id: -1,
                    title: "",
                    preview: "",
                    stickers: favorite.items
                });
            }

            rootState.config.stickers = null;
            ipcRenderer.send("clearStickers");
            return state.collections;
        },

        FETCH_REMOTE: async ({ rootState }) => {
            console.log("[Stickers]: FETCH REMOTELY...");

            const response = await rootState.vk.client.api.store.getProducts(params);
            await Promise.delay(5000);
            const keywordsResponse = await rootState.vk.client.api.store.getStickersKeywords(keywordsParams);

            return { response, keywordsResponse };
        },

        FORMAT: (_, { response, keywordsResponse }) => {
            let collections = [];

            if (response.items.length > 0) {
                collections = response.items.map(collection => {
                    return new StickersCollection(collection);
                });

                collections.sort((a, b) => {
                    return b.purchase_date - a.purchase_date;
                });
            }

            const words = {};
            if (keywordsResponse.dictionary.length > 0) {
                keywordsResponse.dictionary.forEach(dict => { // Во имя императора...
                    dict.words.forEach(word => {
                        if (!(word in words)) words[word] = [];
                        words[word] = dict.user_stickers.map(sticker => {
                            return new Sticker(sticker);
                        });
                    });
                });
            }

            return {
                collections,
                words
            };
        }
    }
};