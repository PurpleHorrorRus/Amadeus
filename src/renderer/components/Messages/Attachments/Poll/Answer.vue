<template>
    <div class="attachments-item-poll-answers-list-item">
        <span
            class="attachments-item-poll-answers-list-item-text"
            v-text="answer.text"
        />

        <CheckIcon
            v-if="answer.choiced"
            class="icon amadeus"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        CheckIcon: () => import("~icons/check.svg")
    },

    props: {
        answer: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.attachments-item-poll-answers-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: max-content;

    padding: 10px;

    background: var(--secondary-opacity-half);

    transition: background .1s ease-in-out;

    &:hover {
        cursor: pointer;
        background: var(--item-hover);
    }

    .icon {
        width: 16px;
    }
}
</style>