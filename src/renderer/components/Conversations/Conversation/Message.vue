<template>
    <div class="conversation-message-body nowrap">
        <span 
            v-if="showSender"
            class="conversation-message-body-out small-text highlight" 
            v-text="sender" 
        />

        <span 
            v-if="showAttachments"
            class="conversation-message-body-attachments small-text highlight nowrap" 
            v-text="formatAttachmentsString(message, false)" 
        />

        <span 
            v-if="message.text" 
            class="conversation-message-body-text small-text nowrap" 
            v-text="message.text" 
        />

        <span 
            class="conversation-message-body-date small-text highlight"
            v-text="dateText"
        />
    </div>
</template>

<script>
import DateDiff from "date-diff";

import AttachmentsMixin from "~/mixins/attachments";

export default {
    mixins: [AttachmentsMixin],

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        updateInterval: null,
        dateText: ""
    }),

    computed: {
        showAttachments() {
            return this.message.attachments.length > 0
                || this.message.fwd_messages?.length > 0;
        },

        showSender() {
            return this.message.out 
                || this.$parent.conversation.profile.type === "chat";
        },

        sender() {
            if (this.message.out) {
                return "Вы:";
            }

            return this.$parent.conversation.profile.users.find(user => {
                return user.id === this.message.from_id;
            }).first_name + ":";
        }
    },

    watch: {
        "$parent.conversation": {
            deep: true,

            handler() {
                this.updateMessageTime();
            }
        }
    },

    created() {
        this.updateInterval = setInterval(() => this.updateMessageTime(), this.getUpdateIntrval());
        this.updateMessageTime();
    },

    beforeDestroy() {
        clearInterval(this.updateInterval);
    },

    methods: {
        updateMessageTime() {
            const date = new Date(this.message.date * 1000);
            const now = new Date();
            const diff = new DateDiff(now, date);

            const yearsDiff = Math.floor(diff.years());
            if (yearsDiff > 0) {
                this.dateText = `${yearsDiff} г.`;
                return true;
            }

            const monthsDiff = Math.floor(diff.months());
            if (monthsDiff > 0) {
                this.dateText = `${monthsDiff} мес.`;
                return true;
            }

            const weeksDiff = Math.floor(diff.weeks());
            if (weeksDiff > 0) {
                this.dateText = `${weeksDiff} нед.`;
                return true;
            }

            const daysDiff = Math.floor(diff.days());
            if (daysDiff > 0) {
                this.dateText = `${daysDiff} д.`;
                return true;
            }

            const hoursDiff = Math.floor(diff.hours());
            if (hoursDiff > 0) {
                this.dateText = `${hoursDiff} ч.`;
                return true;
            }

            const minsDiff = Math.floor(diff.minutes());
            if (minsDiff > 0) {
                this.dateText = `${minsDiff} мин.`;
                return true;
            }

            const secondsDiff = Math.floor(diff.seconds());
            if (secondsDiff >= 5) {
                this.dateText = `${secondsDiff} сек.`;
                return true;
            }

            this.dateText = "сейчас";
            return true;
        },

        getUpdateIntrval() {
            const date = new Date(this.message.date * 1000);
            const now = new Date();
            const diff = new DateDiff(now, date);

            if (diff.years() >= 1) {
                return 1000 * 60 * 60 * 60 * 24 * 30; // one month
            }

            if (diff.months() >= 1) {
                return 1000 * 60 * 60 * 60 * 24 * 7; // one week
            }

            if (diff.weeks() >= 1) {
                return 1000 * 60 * 60 * 60 * 24; // one day
            }

            if (diff.days() >= 1) {
                return 1000 * 60 * 60 * 60; // one hour
            }
            
            if (diff.hours() >= 1) {
                return 1000 * 60 * 60; // one minute
            }

            return 1000 * 4; // every 4 seconds
        }
    }
};
</script>

<style lang="scss">
.conversation-message-body {
    display: flex;
    align-items: center;
    column-gap: 5px;

    &-date {
        &::before {
            content: "•";

            margin-right: 4px;

            color: var(--secondary);
        }
    }
}

</style>