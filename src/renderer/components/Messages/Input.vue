<template>
    <div id="message-page-input" class="nowrap" :class="inputClass">
        <InputEdit v-if="input.editing.enable" />

        <div id="message-page-input-main">
            <AddIcon 
                class="icon vkgram clickable" 
                @click="openAdd" 
                @mouseenter="openMenu($event, null, true, true)"
            />

            <ContextMenu 
                v-if="menu.show" 
                ref="menu" 
                :menu="menu"
                :margins="[-10, -120]"
            />

            <InputField :disabled="sending" />
        </div>
        <InputAttachments v-if="showAttachments" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import lodash from "lodash";

import ModalMixin from "~/mixins/modal";
import MenuMixin from "~/mixins/menu";

export default {
    components: {
        AddIcon: () => import("~icons/add.svg"),
        InputEdit: () => import("~/components/Messages/Input/Edit"),
        InputField: () => import("~/components/Messages/Input/Field"),
        InputAttachments: () => import("~/components/Messages/Input/Attachments")
    },

    mixins: [ModalMixin, MenuMixin],

    data: () => ({
        sending: false
    }),

    computed: {
        ...mapState({
            paths: state => state.config.paths,
            current: state => state.vk.messages.current,
            input: state => state.input
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

        async send(text) {
            if (this.input.attachments.length > 0) {
                this.sending = true;
            }

            const attachments = lodash.chunk(this.input.attachments, 10);
            const reply_message = this.input.reply ? { ...this.input.reply } : undefined;
            const forward_messages = [...this.input.fwd_messages];
            this.clearInput();

            const params = {
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
                label: "Фотографии",
                function: () => this.openAdd("photos"),
                icon: () => import("~icons/image.svg")
            },
            
            {
                id: "videos",
                label: "Видеозаписи",
                function: () => this.openAdd("videos"),
                icon: () => import("~icons/video.svg")
            },
            
            {
                id: "docs",
                label: "Документы",
                function: () => this.openAdd("docs"),
                icon: () => import("~icons/document.svg")
            }];
        },

        openAdd(id = "photos") {
            return this.open({
                view: "add-attachments",
                label: "Прикрепить вложения",
                target: id,
                function: () => {}
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

    padding: 10px 10px 10px 5px;

    &-main {
        display: flex;
        flex-direction: row;
        column-gap: 5px;

        width: 100%;
    }
}
</style>