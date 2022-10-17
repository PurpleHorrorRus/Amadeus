<template>
    <div
        id="message-page-input"
        class="nowrap"
        :class="inputClass"
    >
        <InputEdit v-if="input.editing.enable" />

        <div id="message-page-input-main">
            <AddIcon
                id="add-attachments"
                class="icon amadeus clickable"
                @click="openAdd"
                @mouseenter="openMenu($event, null, true, true)"
            />

            <ContextMenu
                v-if="menu.show"
                ref="menu"
                :menu="menu"
                :margins="[-35, -130]"
            />

            <InputField :disabled="sending" />
        </div>

        <InputAttachments v-if="showAttachments" />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import lodash from "lodash";

import Attachment from "~/instances/Messages/Attachment";
import Message from "~/instances/Messages/Message";

import ModalMixin from "~/mixins/modal";
import MenuMixin from "~/mixins/menu";

type TSend = {
    peer_id: number
    type: string

    attachments: Attachment[] | Attachment[][],
    text: string,
    reply_message: Message,
    forward_messages: Message[]
};

export default {
    components: {
        AddIcon: () => import("~icons/add.svg"),
        InputEdit: () => import("~/components/Messages/Input/Edit.vue"),
        InputField: () => import("~/components/Messages/Input/Field.vue"),
        InputAttachments: () => import("~/components/Messages/Input/Attachments.vue")
    },

    mixins: [ModalMixin, MenuMixin],

    data: () => ({
        sending: false as boolean
    }),

    computed: {
        ...mapState({
            paths: (state: any) => state.config.paths,
            current: (state: any) => state.vk.messages.current,
            input: (state: any) => state.input
        }),

        inputClass() {
            return {
                attachments: this.showAttachments
            };
        },

        showAttachments() {
            return this.input.attachments.length > 0
                || this.input.fwd_messages.length > 0
                || this.input.reply;
        }
    },

    methods: {
        ...mapActions({
            sendMessage: "vk/messages/SEND",
            editMessage: "vk/messages/EDIT",

            edit: "input/EDIT",
            clearEdit: "input/CLEAR_EDIT",
            clearInput: "input/CLEAR",

            open: "modal/OPEN"
        }),

        async send(text = "") {
            if (text.length > 0) {
                text = text.trim();
            }

            if (text.length === 0 && !this.showAttachments) {
                return false;
            }

            if (this.input.attachments.length > 0) {
                this.sending = true;
            }

            const attachments: Attachment[][] = lodash.chunk(this.input.attachments, 10);
            const reply_message: Message = this.input.reply ? { ...this.input.reply } : undefined;
            const forward_messages: Message[] = [...this.input.fwd_messages];
            this.clearInput();

            const params: TSend = {
                peer_id: this.current.id,
                type: this.$route.query.type,

                attachments,
                text,
                reply_message,
                forward_messages
            };

            if (this.input.editing.enable) {
                this.input.editing.message.edit(text, attachments[0]);
                await this.editMessage(this.input.editing.message);
                this.clearEdit();
            } else if (attachments.length > 0) {
                while (attachments.length > 0) {
                    params.attachments = attachments[0];
                    await this.sendMessage(params);
                    attachments.splice(0, 1);

                    if (attachments.length > 0) {
                        params.text = "";
                    }
                }
            } else await this.sendMessage(params);

            this.sending = false;
            return true;
        },

        setMenuItems() {
            this.menu.items = [{
                id: "photos",
                label: this.$strings.CHAT.MENU.PHOTO,
                function: () => this.openAdd("photos"),
                icon: () => import("~icons/image.svg")
            },

            {
                id: "videos",
                label: this.$strings.CHAT.MENU.VIDEO,
                function: () => this.openAdd("videos"),
                icon: () => import("~icons/video.svg")
            },

            {
                id: "docs",
                label: this.$strings.CHAT.MENU.DOCS,
                function: () => this.openAdd("docs"),
                icon: () => import("~icons/document.svg")
            }];
        },

        openAdd(id = "photos") {
            return this.open({
                view: "add-attachments",
                target: id,
                function: () => (false)
            });
        }
    }
};
</script>

<style lang="scss">
#message-page-input {
    grid-area: input;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    padding: 7px;

    background: var(--primary);

    z-index: 1;

    &-main {
        display: grid;
        grid-template-columns: 30px 1fr;
        justify-content: center;
        align-items: center;
        column-gap: 5px;

        width: 100%;

        #add-attachments {
            justify-self: center;
            align-self: center;
        }

        .icon {
            &:hover {
                path {
                    fill: var(--icons-hover);
                }
            }
        }
    }
}
</style>