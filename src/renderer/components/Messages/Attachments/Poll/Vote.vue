<template>
    <div class="attachments-item-poll-answers-vote">
        <span 
            v-if="showFirst"
            class="attachments-item-poll-answers-vote-first" 
            v-text="$strings.CHAT.ATTACHMENTS.POLL.FIRST" 
        />

        <SolidButton 
            v-else-if="item.readyToVote"
            label="Проголосовать" 
            @click.native.stop="$parent.voteLocal"
        />
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },

    computed: {
        showFirst() {
            return this.item.multiple
                ? !this.item.readyToVote
                : this.item.votes === 0;
        }
    }
};
</script>

<style lang="scss">
.attachments-item-poll-answers-vote {
    display: flex;
    justify-content: center;
    align-items: center;

    &-first {
        font-size: 12px;
    }
}
</style>