<template>
    <div class="conversation-avatar">
        <nuxt-img
            :src="conversation.avatar"
            class="conversation-avatar-image"
        />

        <div
            v-if="conversation.profile.online && !onlineMobile"
            class="conversation-avatar-online"
        />

        <PhoneIcon
            v-else-if="onlineMobile"
            class="icon conversation-avatar-online-mobile"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        PhoneIcon: () => import("~icons/phone.svg")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        onlineMobile() {
            return this.conversation.profile.online
                && this.conversation.profile.online_mobile;
        }
    }
};
</script>

<style lang="scss">
.conversation-avatar {
    position: relative;

    width: 40px;
    height: 40px;

    &-image {
        width: 100%;
        height: 100%;

        border-radius: 100%;
    }

    &-online, &-online-mobile {
        position: absolute;
        right: 0px; bottom: 2px;
    }

    &-online {
        width: 10px;
        height: 10px;

        background-color: #37df37;
        border: 1px solid #000000;
        border-radius: 100%;
    }

    &-online-mobile {
        right: -3px; bottom: -2px;

        width: 16px;

        background-color: #000000;
        border-radius: 4px;

        path {
            stroke: none;
            fill: #37df37;
        }
    }
}
</style>