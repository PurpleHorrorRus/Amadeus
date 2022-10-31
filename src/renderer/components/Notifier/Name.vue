<template>
    <div class="notification-information-name nowrap">
        <img
            v-if="$parent.notification.isChat"
            class="notification-information-name__chat__avatar"
            :src="user.photo_100"
        >

        <span class="notification-information-name__title" v-text="name" />

        <span
            v-if="$parent.notification.isChat"
            class="notification-information-name__chat small-text nowrap"
            v-text="$parent.notification.profile.name"
        />
    </div>
</template>

<script>
export default {
    computed: {
        user() {
            return this.$parent.notification.users.find(user => {
                return user.id === this.$parent.notification.message.from_id;
            });
        },

        name() {
            if (this.$parent.notification.isChat) {
                return `${this.user.first_name} ${this.user.last_name}`;
            }

            return this.$parent.notification.profile.name;
        }
    }
};
</script>

<style lang="scss">
.notification-information-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 5px;

    &__chat__avatar {
        width: 20px;
        height: 20px;

        border-radius: 100%;
    }

    &__chat,
    &__title {
        font-size: 14px;
    }

    &__title {
        font-weight: 600;
    }
}
</style>