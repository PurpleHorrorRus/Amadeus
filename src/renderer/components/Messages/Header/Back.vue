<template>
    <div id="messages-header-back" @click="back">
        <ArrowLeftIcon class="icon" />
        <UnreadCounter 
            v-if="unreadCount > 0"
            :count="unreadCount"
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

export default {
    components: {
        ArrowLeftIcon: () => import("~icons/arrow-left.svg"),
        UnreadCounter: () => import("~/components/Messages/Header/UnreadCounter.vue")
    },

    computed: {
        ...mapState({
            conversations: (state: any) => state.vk.conversations.cache
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
    display: flex;
    justify-content: center;
    align-items: center;

    width: max-content;
    max-width: 45px;

    cursor: pointer;

    .icon {
        width: 14px;
    }
}
</style>