<template>
    <div
        class="attachments-item attachments-item-poll"
        :class="pollClass"
        :style="item.style.poll"
    >
        <div
            class="attachments-item-poll-foreground"
            :style="item.style.foreground"
        />

        <PollInformation :poll="item" />

        <div class="attachments-item-poll-answers">
            <div class="attachments-item-poll-answers-list">
                <PollAnswer
                    v-for="answer of item.answers"
                    :key="answer.id"
                    :answer="answer"
                    @click.native.stop="addChoice(answer)"
                />
            </div>

            <PollVote :item="item" />
        </div>
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        PollInformation: () => import("~/components/Messages/Attachments/Poll/Information.vue"),
        PollAnswer: () => import("~/components/Messages/Attachments/Poll/Answer.vue"),
        PollVote: () => import("~/components/Messages/Attachments/Poll/Vote.vue")
    },

    mixins: [AttachmentMixin],

    data: () => ({
        choices: [],

        style: {
            poll: {},
            foreground: {}
        }
    }),

    computed: {
        ...mapState({
            current: (state: any) => state.vk.messages.current
        }),

        pollClass() {
            return {
                first: this.showFirst,
                closed: !this.item.voteAvailable,
                background: !this.item.isPhoto
            };
        }
    },

    methods: {
        ...mapActions({
            vote: "vk/VOTE"
        }),

        addChoice(answer) {
            if (!this.item.voteAvailable) {
                return false;
            }

            if (!this.item.multiple) {
                this.item.vote(answer);
                return this.voteLocal();
            }

            return this.item.choice(answer);
        },

        async voteLocal() {
            this.vote({
                poll: this.item,
                answers: this.item.choiced
            });
        }
    }
};
</script>

<style lang="scss">
.attachments-item-poll {
    position: relative;

    display: grid;
    grid-template-rows: 120px 1fr;
    grid-template-columns: 1fr;

    width: 300px;
    height: max-content;

    border-radius: 8px;
    background-size: cover;
    background-position-x: 45%;

    z-index: 0;

    &.closed {
        .attachments-item-poll-answers {
            .attachments-item-poll-answers-list-item {
                background-color: var(--secondary-disabled);

                &:hover {
                    cursor: not-allowed;
                    background-color: var(--secondary-disabled);
                }
            }
        }
    }

    &-foreground {
        position: absolute;
        top: 0px; left: 0px;
        width: 100%; height: 100%;

        border-radius: 8px;

        z-index: 1;
    }

    &-answers {
        display: grid;
        grid-template-rows: 1fr 60px;
        grid-template-columns: 1fr;
        row-gap: 10px;

        height: 100%;

        z-index: 2;

        &-list {
            display: flex;
            flex-direction: column;
            justify-content: center;
            row-gap: 10px;

            padding: 10px;
        }
    }
}
</style>