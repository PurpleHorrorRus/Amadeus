import DateDiff from "date-diff";
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

            state.collections = rootState.config.stickers.collections;
            state.words = rootState.config.stickers.words;
            state.stickersExist = state.collections.length > 0;

            const diff = new DateDiff(
                new Date(Date.now()),
                new Date(rootState.config.stickers.updated)
            );

            if (diff.minutes() >= 30) {
                const response = await dispatch("FETCH_REMOTE");
                state.collections = response.collections;
                state.words = response.words;

                dispatch("settings/SAVE_CUSTOM", {
                    type: "stickers",
                    space: 0,
                    content: {
                        updated: Date.now(),
                        collections: state.collections,
                        words: state.words
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

            return state.collections;
        },

        FETCH_REMOTE: async ({ rootState }) => {
            const [response, keywordsResponse]: [
                { items?: StoreProduct[] },
                StoreGetStickersKeywordsResponse
            ] =
                await Promise.all([
                    rootState.vk.client.api.store.getProducts(params),
                    rootState.vk.client.api.store.getStickersKeywords(keywordsParams)
                ]);

            let collections = [];
            const words = {};

            if (response.items?.length > 0) {
                collections = response.items.map(collection => {
                    return new StickersCollection(collection);
                });

                collections.sort((a, b) => {
                    return b.purchase_date - a.purchase_date;
                });

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