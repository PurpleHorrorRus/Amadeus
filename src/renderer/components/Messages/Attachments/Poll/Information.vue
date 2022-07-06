<template>
    <div class="attachments-item-poll-information">
        <span 
            v-if="poll.closed"
            class="attachments-item-poll-information-ended" 
            v-text="'Голосованиез завершено'" 
        />

        <span 
            class="attachments-item-poll-information-question" 
            v-text="poll.question" 
        />

        <span 
            v-if="poll.anonymous"
            class="attachments-item-poll-information-anonymous" 
            v-text="'Анонимное голосование'" 
        />
    </div>
</template>

<script>
export default {
    props: {
        poll: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.attachments-item-poll-information {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    z-index: 2;

    &-question {
        font-size: 24px;
        font-weight: 600;
    }
}
</style>