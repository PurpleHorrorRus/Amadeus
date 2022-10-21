<template>
    <div class="notification">
        <img :src="message.profile.avatar" class="notification-avatar">

        <div class="notification-information nowrap">
            <div class="notification-information-name nowrap">
                <img
                    v-if="message.isChat"
                    class="notification-information-name__chat__avatar"
                    :src="user.photo_100"
                >

                <span class="notification-information-name__title" v-text="name" />

                <span
                    v-if="message.isChat"
                    class="notification-information-name__chat small-text nowrap"
                    v-text="message.profile.name"
                />
            </div>

            <span class="notification-information__text nowrap small-text" v-text="message.message.text" />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        message: {
            type: Object,
            required: true
        }
    },

    computed: {
        user() {
            return this.message.users.find(user => {
                return user.id === this.message.message.from_id;
            });
        },

        name() {
            if (this.message.isChat) {
                return `${this.user.first_name} ${this.user.last_name}`;
            }

            return this.message.profile.name;
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

        &__text {
            font-weight: 500;
        }
    }
}
</style>