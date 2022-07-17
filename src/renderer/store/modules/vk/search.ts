import { MessagesSearchParams } from "vk-io/lib/api/schemas/params";
import { MessagesSearchResponse } from "vk-io/lib/api/schemas/responses";

import ProfileGenerator from "~/instances/Generator";
import SearchMessage from "~/instances/Messages/SearchMessage";
import { TProfile } from "~/instances/Types/Conversation";

const fields: MessagesSearchParams = {
    count: 100,
    extended: 1,
    fields: ["photo_100"]
};

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        FETCH: async ({ dispatch, rootState }, data: MessagesSearchParams) => {
            const params: MessagesSearchParams = Object.assign(data, fields);
            const list: MessagesSearchResponse
                = await rootState.vk.client.api.messages.search(params);

            return {
                count: list.count,
                messages: await dispatch("FORMAT", list)
            };
        },

        FORMAT: async (_, list): Promise<SearchMessage[]> => {
            return list.items.map(message => {
                const profile: TProfile = ProfileGenerator.generate(message.from_id, list.profiles, list.groups);
                return new SearchMessage(message, profile);
            });
        }
    }
};