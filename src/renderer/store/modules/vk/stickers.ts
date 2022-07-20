import { StoreGetProductsParams } from "vk-io/lib/api/schemas/params";
import StickersCollection from "~/instances/Messages/StickersCollection";

const params: StoreGetProductsParams = {
    type: "stickers",
    filters: "active",
    extended: 1
};

export default {
    namespaced: true,

    state: () => ({
        stickersExist: false,
        collections: {}
    }),

    actions: {
        FETCH: async ({ state, rootState }) => {
            const response = await rootState.vk.client.api.store.getProducts(params);
            state.stickersExist = response.items?.length > 0;
            console.log(response);

            if (state.stickersExist) {
                response.items.forEach(collection => {
                    state.collections[collection.id] = new StickersCollection(collection);
                });
            }

            return state.collections;
        }
    }
};