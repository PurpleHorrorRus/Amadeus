<template>
    <div id="default-layout" class="layout" :class="layoutClass">
        <Titlebar />

        <ConversationsList v-if="showConversations" />
        <nuxt v-if="showPage" class="page" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar"),
        ConversationsList: () => import("~/components/Conversations/List")
    },

    data: () => ({
        windowWidth: 0
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            current: state => state.vk.messages.current
        }),

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

        layoutClass() {
            return { 
                extended: this.extended,
                chat: this.isChat
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
        grid-template-columns: 300px 1fr;
        grid-template-areas: "titlebar titlebar"
                            "conversations page";
    }
}
</style>