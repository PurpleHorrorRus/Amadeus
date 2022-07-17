import { MessagesGetImportantMessagesParams } from "vk-io/lib/api/schemas/params";
import { MessagesGetImportantMessagesResponse } from "vk-io/lib/api/schemas/responses";

import ProfileGenerator from "~/instances/Generator";
import SearchMessage from "~/instances/Messages/SearchMessage";
import { TProfile } from "~/instances/Types/Conversation";

const fields: MessagesGetImportantMessagesParams = {
    count: 100,
    extended: 1,
    fields: ["photo_100"]
};

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        FETCH: async ({ dispatch, rootState }, offset = 0) => {
            const params: MessagesGetImportantMessagesParams = Object.assign({ offset }, fields);
            const list: MessagesGetImportantMessagesResponse
                = await rootState.vk.client.api.messages.getImportantMessages(params);

            return {
                count: list.messages.count,
                messages: await dispatch("FORMAT", list)
            };
        },

        FORMAT: async (_, list): Promise<SearchMessage> => {
            return list.messages.items.map(message => {
                const profile: TProfile = ProfileGenerator.generate(message.from_id, list.profiles, list.groups);
                return new SearchMessage(message, profile);
            });
        }
    }
};