<template>
    <div class="mention-user">
        <img :src="user.photo_100" class="mention-user-avatar">
        <span class="mention-user-name" v-text="user.name" />
        <span class="mention-user-short small-text" v-text="'@' + user.screen_name" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.mention-user {
    display: grid;
    grid-template-columns: 30px max-content max-content;
    align-items: center;
    column-gap: 10px;

    padding: 5px;

    border-radius: 4px;

    cursor: pointer;

    &:hover {
        background: var(--secondary-hover);
    }

    &-avatar {
        width: 30px;
        height: 30px;

        border-radius: 100%;
    }

    &-name {
        font-size: 14px;
    }

    &-short {
        font-size: 12px;
    }
}
</style>