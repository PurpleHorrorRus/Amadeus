<template>
    <div
        id="notifier-page"
        @mouseleave.native="turnClickable(notification, true)"
    >
        <Notification
            v-for="(notification, index) of notifications"
            :key="notification.message.id"
            :notification="notification"
            @click.native="open(notification, index)"
            @mouseenter.native="turnClickable(notification, false)"
            @mouseleave.native="turnClickable(notification, true)"
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
        notifications: [] as Conversation[]
    }),

    created() {
        ipcRenderer.on("notifierMessage", (_, notification: Conversation) => {
            notification.hover = false;
            notification.removeDebounce = debounce(() => this.removeMessage(-1, notification), 6000);
            this.notifications.push(notification);
            notification.removeDebounce();
        });
    },

    methods: {
        removeMessage(index = -1, conversation?: Conversation, force = false) {
            index = ~index
                ? index
                : this.notifications.findIndex((notification: Conversation) => {
                    return notification.message.id === conversation.message.id;
                });

            if (this.notifications[index].hover && !force) {
                return false;
            }

            this.notifications.splice(index, 1);

            if (this.notifications.length === 0) {
                this.turnClickable(null, true);
            }

            return true;
        },

        turnClickable(notification: Conversation | null, ignore: boolean) {
            this.$ipc.send("notifierClickable", ignore);

            if (notification) {
                notification.hover = !ignore;

                if (!notification.hover) {
                    notification.removeDebounce();
                }
            }
        },

        open(notification: Conversation, index: number) {
            this.removeMessage(index, notification, true);
            return this.$ipc.send("notifierOpen", JSON.parse(JSON.stringify(notification)));
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