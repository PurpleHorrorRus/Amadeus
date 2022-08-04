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
            :value="settings.appearance.conversationsWidth"
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
import { mapState } from "vuex";

import Resizable from "~/components/Global/Resizable.vue";

import CoreMixin from "~/mixins/core";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar.vue"),
        Player: () => import("~/components/Messages/Player.vue"),
        ConversationsList: () => import("~/components/Conversations/List.vue"),
        ModalWindow: () => import("~/components/Modal/Window.vue"),
        Resizable
    },

    mixins: [CoreMixin, AppearanceMixin],

    data: () => ({
        resizableRef: Resizable.data().resizableRef,
        minWidth: 150,
        maxWidth: 300
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
                minimized: this.settings.appearance.minimized,
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
        this.setTheme(this.settings.appearance.theme);

        for (const variable of Object.keys(this.settings.appearance.colors)) {
            this.calculateContrasts({
                variable,
                value: this.settings.appearance.colors[variable]
            });
        }
    },

    beforeDestroy() {
        window.onresize = null;
    },

    methods: {
        resize({ position, size }) {
            if (position < this.minWidth) {
                if (!this.settings.appearance.minimized) {
                    this.settings.appearance.minimized = true;
                    this.settings.appearance.conversationsWidth = 60;
                }
            } else {
                if (this.settings.appearance.minimized) {
                    this.settings.appearance.minimized = false;
                }

                this.settings.appearance.conversationsWidth = size;
            }
        },

        resized() {
            this.saveSettings(this.settings);
        }
    }
};
</script>

<style lang="scss">
@media screen and (max-width: 600px) {
    #default-layout {
        grid-template-columns: 1fr !important;
        grid-template-rows: 35px 1fr !important;
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
            grid-template-rows: 35px 40px 1fr !important;
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
    grid-template-rows: 35px 1fr;
    grid-template-areas: "titlebar titlebar"
                        "conversations page";

    width: 100%;
    height: 100%;

    overflow: hidden;

    background: var(--primary);

    &.player {
        grid-template-rows: 35px 40px 1fr;
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

            background: var(--border-opacity);

            z-index: 101;

            &:hover {
                cursor: ew-resize;

                background: var(--secondary);
            }
        }
    }
}
</style>