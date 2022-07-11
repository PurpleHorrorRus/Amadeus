<template>
    <div id="messages-header-back" @click="back">
        <ArrowLeftIcon class="icon" />
        <UnreadCounter 
            v-if="unreadCount > 0"
            :count="unreadCount"
        />
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    components: {
        ArrowLeftIcon: () => import("~/assets/icons/arrow-left.svg"),
        UnreadCounter: () => import("~/components/Messages/Header/UnreadCounter")
    },

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.cache
        }),

        unreadCount() {
            return this.conversations.filter(conversation => {
                return conversation.information.unread_count > 0;
            }).length;
        }
    },

    methods: {
        back() {
            return this.$router.replace("/general").catch(() => {});
        }
    }
};
</script>

<style lang="scss">
#messages-header-back {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 20px;

    cursor: pointer;

    .icon {
        width: 14px;
    }

    .unread-counter {
        position: absolute;
        bottom: 5px; right: -3px;
    }
}
</style>