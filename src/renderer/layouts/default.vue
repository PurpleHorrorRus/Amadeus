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
            v-if="showConversations"
            id="conversations-wrapper"
            ref="resizable"
            :style="conversationStyle"
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
                @mousedown="resizableRef.holdThumb"
            />
        </Resizable>

        <nuxt v-if="showPage" class="page" />

        <ModalWindow v-if="modalShow" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Resizable from "~/components/Global/Resizable";

import CoreMixin from "~/mixins/core";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar"),
        Player: () => import("~/components/Messages/Player"),
        ConversationsList: () => import("~/components/Conversations/List"),
        ModalWindow: () => import("~/components/Modal/Window"),
        Resizable
    },

    mixins: [CoreMixin, AppearanceMixin],

    data: () => ({
        windowWidth: 0,

        resizableRef: Resizable.data().resizableRef,
        minWidth: 150,
        maxWidth: 300
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            current: state => state.vk.messages.current,

            song: state => state.audio.song,

            modalShow: state => state.modal.show
        }),

        layoutClass() {
            return { 
                extended: this.extended,
                chat: this.isChat,
                minimized: this.settings.appearance.minimized && this.extended,
                player: this.showPlayer
            };
        },

        showPlayer() {
            return this.song !== null;
        },

        isChat() {
            return this.$route.name !== "general";
        },

        showConversations() {
            return (!this.extended && !this.isChat) 
                || this.extended;
        },

        showPage() {
            return (!this.extended && this.isChat) 
                || this.extended;
        },

        conversationStyle() {
            return { 
                width: this.extended 
                    ? this.settings.appearance.conversationsWidth + "px"
                    : "100%"
            };
        }
    },

    created() {
        this.detectView();

        for (const variable of Object.keys(this.settings.appearance.colors)) {
            console.log(variable);
            this.calculateContrasts({ 
                variable,
                value: this.settings.appearance.colors[variable]
            });
        }
    },

    mounted() {
        window.onresize = () => this.detectView();
    },

    beforeDestroy() {
        window.onresize = null;
    },

    methods: {
        ...mapActions({
            setExtendedView: "SET_VIEW"
        }),

        detectView() {
            this.windowWidth = window.innerWidth;
            if (this.windowWidth >= 600 && !this.extended) {
                this.setExtendedView(true);
            } else if (this.windowWidth < 600 && this.extended) {
                this.setExtendedView(false);
            }
        },

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

    &.extended.player {
        grid-template-rows: 35px 40px 1fr;

        grid-template-areas: "titlebar titlebar"
            "conversations player"
            "conversations page";
    }

    &:not(.extended) {
        grid-template-columns: 1fr;
        
        &.chat {
            grid-template-areas: "titlebar"
                    "page";
        }

        &:not(.chat) {
            grid-template-areas: "titlebar"
                    "conversations";
        }

        &.player {
            grid-template-rows: 35px 40px 1fr;

            grid-template-areas: "titlebar"
                "player"
                "conversations";

            &.chat {
                grid-template-areas: "titlebar"
                    "player"
                    "page";
            }
        }
    }

    &.extended.minimized {
        grid-template-columns: 60px 1fr;
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