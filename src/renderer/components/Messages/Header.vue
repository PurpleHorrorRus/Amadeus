<template>
    <div id="messages-header">
        <div id="messages-header-main">
            <MessagesHeaderBack v-if="!extended" />

            <div id="messages-header-main-profile" @click="$parent.turnProfile">
                <img id="messages-header-main-profile-avatar" :src="conversation.avatar">
                <MessagesHeaderInformation :conversation="conversation" />
            </div>
        </div>
        
        <div v-if="isSelectedMessages" id="messages-header-actions">
            <XIcon 
                v-tooltip.bottom-start="'Снять выделение'"
                class="icon vkgram clickable"
                @click="unselectAll"
            />

            <TrashIcon 
                v-if="messagesToDelete.length > 0"
                v-tooltip.bottom-start="'Удалить сообщения'"
                class="icon vkgram clickable"
                @click="deleteMessages"
            />

            <ForwardIcon 
                v-tooltip.bottom-start="'Переслать сообщения'"
                class="icon vkgram clickable" 
                @click="forwardMessages" 
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import DateMixin from "~/mixins/date";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back"),
        MessagesHeaderInformation: () => import("~/components/Messages/Header/Information"),
    
        XIcon: () => import("~icons/x.svg"),
        TrashIcon: () => import("~icons/trash.svg"),
        ForwardIcon: () => import("~icons/forward.svg")
    },

    mixins: [DateMixin, ModalMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            user: state => state.vk.user
        }),

        isSelectedMessages() {
            return this.$parent.chat.messages.some(message => {
                return message.selected;
            });
        },

        messagesToDelete() {
            return this.$parent.chat.messages.filter(message => {
                return message.selected;
            });
        }
    },

    methods: {
        ...mapActions({
            setForward: "input/SET_FORWARD",
            delete: "vk/messages/DELETE",
            unselectAll: "vk/messages/UNSELECT_ALL"
        }),

        deleteMessages() {
            let messages = this.messagesToDelete;
            if (messages.length === 0) return false;

            const options = [];
            const isOutSelected = messages.some(message => {
                return message.out;
            });

            if (isOutSelected && this.conversation.id !== this.user.id) {
                messages = messages.filter(message => {
                    return message.out;
                });

                const isNotExpiredExist = messages.some(message => {
                    return this.dateDiff(message).hours() < 24;
                });

                if (isNotExpiredExist) {
                    options[0] = {
                        id: "delete-for-all",
                        text: "Удалить для всех",
                        checked: false
                    };
                }
            }

            this.confirmation({
                text: `Удалить ${messages.length} сообщений?`,
                options,

                accept: () => {
                    this.delete({
                        peer_id: this.conversation.id,
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
                title: "Переслать сообщения",

                function: async conversation => {
                    const fwd_messages = [...this.$parent.chat.messages.filter(message => {
                        return message.selected;
                    })];

                    await this.$router.replace(`/messages/${conversation.id}?type=${conversation.type}`)
                        .catch(() => {});

                    this.setForward(fwd_messages);
                }
            });
        }
    }
};
</script>

<style lang="scss">
#messages-header {
    grid-area: header;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    column-gap: 5px;
    flex-wrap: nowrap;

    padding: 0px 10px;

    > * {
        cursor: pointer;
    }

    &-main {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 5px;

        &-profile {
            display: flex;
            align-items: center;
            column-gap: 10px;

            &-avatar {
                width: 30px;
                height: 30px;
        
                border-radius: 100%;
            }
        }
    }

    &-actions {
        display: flex;
        flex-direction: row;
        column-gap: 15px;

        .icon {
            width: 20px;
        }
    }
}
</style>