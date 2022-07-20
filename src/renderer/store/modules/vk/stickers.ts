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
        collections: {},
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
                response.items.forEach(collection => {
                    state.collections[collection.id] = new StickersCollection(collection);
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

                        const formatted = dict.user_stickers.map(sticker => {
                            return new Sticker(sticker);
                        });

                        state.words[word] = [
                            ...state.words[word],
                            ...formatted
                        ]; 
                    });
                });
            }

            return state.collections;
        }
    }
};