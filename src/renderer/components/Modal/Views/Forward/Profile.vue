<template>
    <div class="forward-profile">
        <nuxt-img
            :src="conversation.avatar"
            class="forward-profile-avatar"
        />

        <span
            class="forward-profile-name nowrap"
            v-text="conversation.name"
        />
    </div>
</template>

<script lang="ts">
import ProfileMixin from "~/mixins/profile";

export default {
    mixins: [ProfileMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.forward-profile {
    display: grid;
    grid-template-columns: 30px 1fr;
    align-items: center;
    column-gap: 7px;

    padding: 5px;

    border-radius: 4px;
    transition: background .2s ease-in-out;

    &:hover {
        cursor: pointer;
        background: var(--item-hover);
    }

    &-avatar {
        width: 30px;
        height: 30px;

        border-radius: 100%;
    }

    &-name {
        font-size: 12px;
    }
}
</style>