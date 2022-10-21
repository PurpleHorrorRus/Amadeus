<template>
    <div class="notification">
        <img :src="notification.profile.avatar" class="notification-avatar">

        <div class="notification-information nowrap">
            <div class="notification-information-name nowrap">
                <img
                    v-if="notification.isChat"
                    class="notification-information-name__chat__avatar"
                    :src="user.photo_100"
                >

                <span class="notification-information-name__title" v-text="name" />

                <span
                    v-if="notification.isChat"
                    class="notification-information-name__chat small-text nowrap"
                    v-text="notification.profile.name"
                />
            </div>

            <div class="notification-information-text nowrap">
                <span
                    v-if="notification.message.attachments?.length > 0"
                    class="notification-information-text__attachments small-text"
                    v-text="formatAttachmentsString(notification.message, false)"
                />

                <span
                    class="notification-information-text__main nowrap small-text"
                    v-text="notification.message.text"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    mixins: [AttachmentsMixin],

    props: {
        notification: {
            type: Object,
            required: true
        }
    },

    computed: {
        user() {
            return this.notification.users.find(user => {
                return user.id === this.notification.message.from_id;
            });
        },

        name() {
            if (this.notification.isChat) {
                return `${this.user.first_name} ${this.user.last_name}`;
            }

            return this.notification.profile.name;
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
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 70px;
    align-items: center;
    column-gap: 10px;

    padding: 0px 15px;

    background: var(--primary);

    border-radius: 8px;

    transition: background .2s ease-in-out;

    opacity: 0;

    animation-name: notification;
    animation-duration: .5s;
    animation-fill-mode: forwards;

    pointer-events: all;

    &:hover {
        background: var(--secondary-disabled);
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

        &-name {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 5px;

            &__chat__avatar {
                width: 20px;
                height: 20px;

                border-radius: 100%;
            }

            &__chat, &__title {
                font-size: 14px;
            }

            &__title {
                font-weight: 600;
            }
        }

        &-text {
            display: flex;
            flex-direction: row;
            column-gap: 5px;

            span {
                font-weight: 500;
            }

            &__attachments {
                color: var(--secondary) !important;
            }
        }
    }
}
</style>