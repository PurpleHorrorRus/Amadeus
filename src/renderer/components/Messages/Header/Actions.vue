<template>
    <div id="messages-header-actions">
        <XIcon 
            v-tooltip.bottom-start="$strings.TOOLTIP.ACTIONS.UNSELECT"
            class="icon amadeus clickable"
            @click="unselectAll"
        />

        <TrashIcon
            v-tooltip.bottom-start="$strings.TOOLTIP.ACTIONS.DELETE"
            class="icon amadeus clickable"
            @click="deleteMessages"
        />

        <ForwardIcon 
            v-tooltip.bottom-start="$strings.TOOLTIP.ACTIONS.FORWARD"
            class="icon amadeus clickable" 
            @click="forwardMessages" 
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";
import DateMixin from "~/mixins/date";

import Message from "~/instances/Messages/Message";

export default {
    components: {
        XIcon: () => import("~icons/x.svg"),
        TrashIcon: () => import("~icons/trash.svg"),
        ForwardIcon: () => import("~icons/forward.svg")
    },

    mixins: [CoreMixin, ModalMixin, DateMixin],

    props: {
        messages: {
            type: Array,
            required: true
        }
    },

    methods: {
        ...mapActions({
            setForward: "input/SET_FORWARD",
            delete: "vk/messages/DELETE",
            unselectAll: "vk/messages/UNSELECT_ALL"
        }),

        deleteMessages() {
            const messages: Message[] = [...this.messages];

            const options = [];

            if (this.$parent.conversation.id !== this.user.id) {
                const isNotExpired = messages.filter(message => {
                    return message.out && this.dateDiff(message).hours() < 24;
                });

                if (isNotExpired.length > 0) {
                    options[0] = {
                        id: "delete-for-all",
                        text: `Удалить для всех (${isNotExpired.length} сообщений)`,
                        checked: false
                    };
                }
            }

            this.confirmation({
                text: `Удалить ${messages.length} сообщений?`,
                options,

                accept: () => {
                    this.delete({
                        peer_id: this.$parent.conversation.id,
                        delete_for_all: this.modal.confirmation.options[0]?.checked || false,
                        messages
                    });

                    this.unselectAll();
                }
            });
        },

        forwardMessages() {
            this.open({
                view: "choose-user",
                title: this.$strings.MENU.FORWARD_MESSAGES,

                function: async conversation => {
                    const forwardMessages: Message[] = this.messages.filter(message => {
                        return message.selected;
                    });

                    await this.$router
                        .replace(`/messages/${conversation.id}?type=${conversation.type}`)
                        .catch(() => {});

                    this.setForward(forwardMessages);
                }
            });
        }
    }
};
</script>

<style lang="scss">
#messages-header-actions {
    grid-area: actions;

    display: flex;
    flex-direction: row;
    column-gap: 15px;

    padding: 0px 10px;

    .icon {
        width: 20px;
    }
}
</style>