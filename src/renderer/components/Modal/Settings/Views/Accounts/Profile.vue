<template>
    <div class="account-profile" :class="accountProfileClass">
        <div class="account-profile-main">
            <nuxt-img
                :src="profile.photo_100"
                class="account-profile-main-avatar"
            />

            <span
                class="account-profile-main-name nowrap"
                v-text="profile.name"
            />
        </div>

        <CheckIcon
            v-if="active"
            class="icon amadeus"
        />

        <XIcon
            v-else
            class="icon amadeus clickable account-profile-delete"
            @click="$emit('remove')"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        CheckIcon: () => import("~icons/check.svg"),
        XIcon: () => import("~icons/x.svg")
    },

    props: {
        profile: {
            type: Object,
            required: true
        },

        active: {
            type: Boolean,
            required: true
        }
    },

    computed: {
        accountProfileClass() {
            return {
                active: this.active
            };
        }
    }
};
</script>

<style lang="scss">
.account-profile {
    display: grid;
    grid-template-columns: 1fr 30px;
    align-items: center;
    column-gap: 7px;

    &:hover {
        .account-profile-delete {
            visibility: visible;
        }
    }

    &:not(.active) {
        .account-profile-main:hover {
            cursor: pointer;
            background-color: var(--item-hover);
        }
    }

    &-main {
        display: grid;
        grid-template-columns: 30px 1fr;
        align-items: center;
        column-gap: 7px;

        padding: 5px;

        border-radius: 4px;
        transition: background .2s ease-in-out;

        &-avatar {
            width: 30px;
            height: 30px;

            border-radius: 100%;
        }

        &-name {
            font-size: 12px;
        }
    }

    &-delete {
        visibility: hidden;
    }

    .icon {
        width: 16px;
    }
}
</style>