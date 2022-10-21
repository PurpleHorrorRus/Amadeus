<template>
    <div id="notifier-page">
        <Notification
            v-for="(message, index) of messages"
            :key="message.message.id"
            :message="message"
            @click.native="open(message, index)"
            @mouseenter.native="turnClickable(message, false)"
            @mouseleave.native="turnClickable(message, true)"
        />
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { debounce } from "lodash";

import Conversation from "~/instances/Conversations/Convesration";

export default {
    components: {
        Notification: () => import("~/components/Notifier/Notification.vue")
    },

    layout: "empty",

    data: () => ({
        messages: [] as Array<Conversation>
    }),

    created() {
        ipcRenderer.on("notifierMessage", (_, conversation: Conversation) => {
            conversation.hover = false;
            conversation.removeDebounce = debounce(() => this.removeMessage(-1, conversation), 6000);
            this.messages.push(conversation);
            conversation.removeDebounce();
        });
    },

    methods: {
        removeMessage(index = -1, conversation?: Conversation, force = false) {
            index = ~index
                ? index
                : this.messages.findIndex((message: Conversation) => {
                    return message.message.id === conversation.message.id;
                });

            if (this.messages[index].hover && !force) {
                return false;
            }

            this.messages.splice(index, 1);
            return true;
        },

        turnClickable(message: Conversation, ignore: boolean) {
            message.hover = !ignore;
            ipcRenderer.send("notifierClickable", ignore);

            if (!message.hover) {
                message.removeDebounce();
            }
        },

        open(conversation: Conversation, index: number) {
            this.removeMessage(index, null, true);
            return ipcRenderer.send("notifierOpen", JSON.parse(JSON.stringify(conversation)));
        }
    }
};
</script>

<style lang="scss">
html, body, #__nuxt, #__layout, .layout, #notifier-page {
    width: 100%;
    height: 100%;

    pointer-events: none;
}

.layout {
    position: relative !important;
}

#notifier-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    row-gap: 5px;

    height: 100%;

    padding: 5px;

    background: none;
    overflow: hidden;
}
</style>