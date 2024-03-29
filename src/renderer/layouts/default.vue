<template>
    <div
        id="default-layout"
        class="layout"
        :class="layoutClass"
        @mousemove="resizableRef.calculate"
        @mouseup="resizableRef.releaseThumb"
        @mouseleave="resizableRef.releaseThumb"
    >
        <Titlebar />

        <Player v-if="showPlayer" />

        <Resizable
            id="conversations-wrapper"
            ref="resizable"
            :anchor="'start'"
            :direction="'horizontal'"
            :value="config.appearance.conversationsWidth"
            :min="minWidth"
            :max="maxWidth"
            @mounted="resizableRef = $event"
            @resize="resize"
            @resized="resized"
        >
            <ConversationsList />
            <div
                id="conversations-wrapper-resize"
                slot="thumb"
                class="resizable-thumb"
                @mousedown.left="resizableRef.holdThumb"
            />
        </Resizable>

        <nuxt class="page" />

        <ModalWindow v-if="modalShow" />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import Resizable from "~/components/Global/Resizable.vue";

import CoreMixin from "~/mixins/core";
import ConversationsMixin from "~/mixins/conversations";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar.vue"),
        Player: () => import("~/components/Messages/Player.vue"),
        ConversationsList: () => import("~/components/Conversations/List.vue"),
        ModalWindow: () => import("~/components/Modal/Window.vue"),
        Resizable
    },

    mixins: [CoreMixin, ConversationsMixin, AppearanceMixin],

    data: () => ({
        resizableRef: Resizable.data().resizableRef,
        minWidth: 150,
        maxWidth: 300,
        ctrl: false
    }),

    computed: {
        ...mapState({
            current: (state: any) => state.vk.messages.current,

            song: (state: any) => state.audio.song,

            modalShow: (state: any) => state.modal.show
        }),

        layoutClass() {
            return {
                chat: this.isChat,
                minimized: this.config.appearance.minimized,
                player: this.showPlayer
            };
        },

        showPlayer() {
            return this.song !== null;
        },

        isChat() {
            return this.$route.name !== "general";
        }
    },

    created() {
        this.setTheme(this.config.appearance.theme);

        for (const variable of Object.keys(this.config.appearance.colors)) {
            this.calculateContrasts({
                variable,
                value: this.config.appearance.colors[variable]
            });
        }

        window.addEventListener("keydown", this.keyPress);
        window.addEventListener("keyup", this.keyRelease);
    },

    beforeDestroy() {
        window.removeEventListener("keydown", this.keyPress);
        window.removeEventListener("keyup", this.keyRelease);
        window.onresize = null;
    },

    methods: {
        ...mapActions({
            getNextConversation: "vk/conversations/GET_NEXT"
        }),

        resize({ position, size }) {
            if (position < this.minWidth) {
                if (!this.config.appearance.minimized) {
                    this.config.appearance.minimized = true;
                    this.config.appearance.conversationsWidth = 60;
                }
            } else {
                if (this.config.appearance.minimized) {
                    this.config.appearance.minimized = false;
                }

                this.config.appearance.conversationsWidth = size;
            }
        },

        resized() {
            return this.config.appearance.save();
        },

        async keyPress(event) {
            if (event.keyCode === 17) {
                this.ctrl = true;
            } if (event.keyCode === 16) {
                this.shift = true;
            } else if (this.ctrl && event.keyCode === 9) {
                const chat = await this.getNextConversation(this.shift ? -1 : 1);
                return await this.openConversation(chat);
            }
        },

        keyRelease(event) {
            if (event.keyCode === 17) {
                this.ctrl = false;
            } else if (event.keyCode === 16) {
                this.shift = false;
            }
        }
    }
};
</script>

<style lang="scss">
@media screen and (max-width: 599px) {
    #default-layout {
        grid-template-columns: 1fr !important;
        grid-template-rows: 25px 1fr !important;
        grid-template-areas: "titlebar"
                            "page" !important;

        &:not(.chat) {
            #general-page {
                display: none;
            }

            #conversations-wrapper {
                grid-area: page;

                width: 100% !important;

                &-resize {
                    display: none;
                }
            }
        }

        &.chat {
            #conversations-wrapper {
                display: none !important;
            }
        }

        &.player {
            grid-template-rows: 25px 40px 1fr !important;
            grid-template-areas: "titlebar"
                                "player"
                                "page" !important;
        }

        #messages-header {
            &-main {
                padding: 0px !important;
            }

            &-back {
                display: flex !important;
            }
        }
    }
}

#default-layout {
    position: absolute;
    top: 0px;
    left: 0px;

    display: grid;
    grid-template-columns: max-content 1fr;
    grid-template-rows: 25px 1fr;
    grid-template-areas: "titlebar titlebar"
                        "conversations page";

    width: 100%;
    height: 100%;

    overflow: hidden;

    background-color: var(--primary);

    &.player {
        grid-template-rows: 25px 40px 1fr;
        grid-template-areas: "titlebar titlebar"
                            "conversations player"
                            "conversations page";
    }

    #conversations-wrapper {
        grid-area: conversations;

        position: relative;

        overflow-x: hidden;
        overflow-y: auto;

        &-resize {
            position: absolute;
            top: 0px;
            right: 0px;

            width: 2px;
            height: 100%;

            z-index: 101;

            &:hover {
                cursor: ew-resize;
            }
        }
    }
}
</style>