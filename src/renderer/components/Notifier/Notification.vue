<template>
    <div class="notification">
        <nuxt-img
            :src="notification.profile.avatar"
            class="notification-avatar"
        />

        <div class="notification-information nowrap">
            <NotificationName />
            <NotificationText :message="notification.message" />
        </div>

        <span class="notification-time small-text" v-text="time" />
    </div>
</template>

<script lang="ts">
import common from "~/plugins/common";

export default {
    components: {
        NotificationName: () => import("./Name.vue"),
        NotificationText: () => import("./Text.vue")
    },

    props: {
        notification: {
            type: Object,
            required: true
        }
    },

    computed: {
        time() {
            const messageTime = new Date(this.notification.message.date * 1000);
            return common.timestampFormat(messageTime);
        }
    }
};
</script>

<style lang="scss">
@keyframes notification {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.notification {
    position: relative;

    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 70px;
    align-items: center;
    column-gap: 10px;

    padding: 0px 15px;

    background-color: var(--notification);

    border: 1px solid var(--notification-hover);
    border-radius: 8px;

    transition: background 0.2s ease-in-out;

    opacity: 0;

    animation-name: notification;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;

    pointer-events: all;

    &:hover {
        background-color: var(--notification-hover);
        cursor: pointer;
    }

    &-avatar {
        width: 40px;
        height: 40px;

        border-radius: 100%;
    }

    &-information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 5px;
    }

    &-time {
        position: absolute;
        right: 10px;
        top: 10px;

        font-size: 10px;
    }
}
</style>