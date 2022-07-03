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
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Resizable from "~/components/Global/Resizable";

import CoreMixin from "~/mixins/core";

export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar"),
        ConversationsList: () => import("~/components/Conversations/List"),
        Resizable
    },

    mixins: [CoreMixin],

    data: () => ({
        windowWidth: 0,

        resizableRef: Resizable.data().resizableRef,
        minWidth: 150,
        maxWidth: 300
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            current: state => state.vk.messages.current
        }),

        layoutClass() {
            return { 
                extended: this.extended,
                chat: this.isChat,
                minimized: this.settings.appearance.minimized && this.extended
            };
        },

        isChat() {
            return this.$route.name === "messages-chat";
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
            console.log(1);
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
    grid-template-rows: 35px 1fr;
    grid-template-columns: 1fr;
    grid-template-areas: "titlebar"
                        "conversations";

    width: 100%;
    height: 100%;

    overflow: hidden;

    background: var(--primary);

    &.chat {
        grid-template-areas: "titlebar"
                        "page";
    }

    &.extended {
        grid-template-columns: max-content 1fr;
        grid-template-areas: "titlebar titlebar"
                            "conversations page";

        &.minimized {
            grid-template-columns: 60px 1fr;
        }
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

            background: var(--left-border);

            z-index: 101;

            &:hover {
                cursor: ew-resize;

                background: var(--secondary);
            }
        }
    }
}
</style>