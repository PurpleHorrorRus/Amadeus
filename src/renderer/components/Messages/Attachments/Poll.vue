<template>
    <div 
        class="attachments-item attachments-item-poll" 
        :class="pollClass" 
        :style="style.poll"
    >
        <div 
            class="attachments-item-poll-foreground" 
            :style="style.foreground" 
        />

        <PollInformation :poll="item.poll" />

        <div class="attachments-item-poll-answers">
            <div class="attachments-item-poll-answers-list">
                <PollAnswer
                    v-for="answer of choices"
                    :key="answer.id"
                    :answer="answer"
                    @click.native.stop="addChoice(answer)"
                />
            </div>

            <div class="attachments-item-poll-answers-vote">
                <span 
                    v-if="showFirst"
                    class="attachments-item-poll-answers-vote-first" 
                    v-text="'Проголосуйте первым!'" 
                />

                <SolidButton 
                    v-else-if="readyToVote"
                    label="Проголосовать" 
                    @click.native="voteLocal"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        PollInformation: () => import("~/components/Messages/Attachments/Poll/Information"),
        PollAnswer: () => import("~/components/Messages/Attachments/Poll/Answer")
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
            current: state => state.vk.messages.current
        }),

        pollClass() {
            return {
                first: this.isFirst,
                closed: this.isClosed,
                background: !this.isPhoto
            };
        },

        isPhoto() {
            return "photo" in this.item.poll;
        },

        isFirst() {
            return this.item.poll.votes === 0;
        },

        isClosed() {
            return this.item.poll.closed || !this.item.poll.can_vote;
        },

        choicedItems() {
            return this.choices.filter(choice => {
                return choice.choiced;
            });
        },

        showFirst() {
            return this.item.poll.multiple
                ? !this.readyToVote
                : this.item.poll.votes === 0;
        },

        readyToVote() {
            if (this.item.poll.multiple) {
                return this.choicedItems.length > 0 
                    || (this.choicedItems.length === 0 && this.item.poll.votes > 0);
            }

            return false;
        }
    },

    created() {
        this.item.poll.answers.forEach(answer => {
            this.choices.push({
                ...answer,
                choiced: false
            });

            return answer;
        });
    },

    mounted() {
        if (this.isPhoto) {
            const maxSize = this.calculateMaxSize(this.item.poll.photo.images);
            this.style.poll = { backgroundImage: `url("${maxSize.url}")` };
            this.style.foreground = { 
                background: `linear-gradient(transparent -100%,  #${this.item.poll.photo.color} 100%)`
            };

            return true;
        }

        this.style.foreground = {
            background: `linear-gradient(\
                -${this.item.poll.background.angle}deg, \
                #${this.item.poll.background.points[0].color} 0%, \
             #${this.item.poll.background.points[1].color} 100%)`
        };
    },
    
    methods: {
        ...mapActions({
            vote: "vk/VOTE"
        }),

        addChoice(answer) {
            if (this.isClosed) {
                return false;
            }

            answer.choiced = !answer.choiced;

            if (!this.item.poll.multiple) {
                return this.voteLocal();
            }
        },

        async voteLocal() {
            this.vote({ 
                poll: this.item.poll,
                answers: this.choicedItems
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

    width: 100%;
    height: max-content;

    border-radius: 8px;
    background-size: cover;
    background-position-x: 45%;

    z-index: 0;

    &.closed {
        .attachments-item-poll-answers {
            .attachments-item-poll-answers-list-item {
                background: var(--secondary-disabled);

                &:hover {
                    cursor: not-allowed;
                    background: var(--secondary-disabled);
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

        &-vote {
            display: flex;
            justify-content: center;
            align-items: center;

            &-first {
                font-size: 12px;
            }
        }
    }
}
</style>