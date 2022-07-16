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

        <div class="attachments-item-poll-information-meta">
            <span 
                v-if="poll.anonymous"
                class="attachments-item-poll-information-meta-anonymous" 
                v-text="'Анонимное голосование'" 
            />

            <span 
                v-if="poll.multiple"
                class="attachments-item-poll-information-meta-multiple" 
                v-text="'Множественный выбор'" 
            />
        </div>
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
    row-gap: 10px;

    z-index: 2;

    &-question {
        padding: 0px 10px;

        font-size: 15px;
        font-weight: 600;
    }

    &-meta {
        span {
            font-size: 14px;
        }
    }
}
</style>