import { StoreGetProductsParams, StoreGetStickersKeywordsParams } from "vk-io/lib/api/schemas/params";
import { StoreGetFavoriteStickersResponse, StoreGetStickersKeywordsResponse } from "vk-io/lib/api/schemas/responses";
import Sticker from "~/instances/Messages/Attachments/Sticker";
import StickersCollection from "~/instances/Messages/StickersCollection";

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
        collections: [],
        words: {}
    }),

    actions: {
        FETCH: async ({ state, rootState }) => {
            const [response, favorite, keywordsResponse]: [
                StoreGetStickersKeywordsResponse,
                StoreGetFavoriteStickersResponse,
                StoreGetStickersKeywordsResponse
            ] =
                await Promise.all([
                    rootState.vk.client.api.store.getProducts(params),
                    rootState.vk.client.api.store.getFavoriteStickers(),
                    rootState.vk.client.api.store.getStickersKeywords(keywordsParams)
                ]);

            state.stickersExist = response.items?.length > 0;

            if (state.stickersExist) {
                state.collections = response.items.map(collection => {
                    return new StickersCollection(collection);
                });

                state.collections.sort((a, b) => { 
                    return b.purchase_date - a.purchase_date;
                });

                // @ts-ignore
                if (favorite.count > 0) {
                    state.favorite = new StickersCollection({
                        id: -1,
                        title: "",
                        preview: "",
                        // @ts-ignore
                        stickers: favorite.items
                    });
                }

                keywordsResponse.dictionary.forEach(dict => { // Во имя императора...
                    dict.words.forEach(word => {
                        if (!(word in state.words)) state.words[word] = [];
                        state.words[word] = dict.user_stickers.map(sticker => {
                            return new Sticker(sticker);
                        }); 
                    });
                });
            }

            return state.collections;
        }
    }
};