<template>
    <div class="message-content">
        <span 
            v-if="showName" 
            class="message-content-name" 
            v-text="name" 
        />

        <AllAttachments :message="message" />

        <div class="message-content-info">
            <span 
                class="message-content-info-date" 
                v-text="relativeDate(message.date)" 
            />

            <LoaderIcon
                v-if="message.syncing === 1"
                class="icon loader-icon spin message-content-info-syncing"
            />

            <CheckIcon 
                v-if="showCheckIcon"
                class="icon message-content-info-read" 
                :class="checkIconClass"
            />
        </div>
    </div>
</template>

<script>
import DateMixin from "~/mixins/date";

export default {
    components: {
        AllAttachments: () => import("~/components/Messages/AllAttachments"),
        CheckIcon: () => import("~/assets/icons/check.svg")
    },

    mixins: [DateMixin],

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    computed: {
        showName() {
            return !this.$parent.same
                && !this.message.out 
                && this.$parent.isChat;
        },

        name() {
            return this.$parent.chatUserProfile.first_name;
        },

        isNotRead() {
            return this.$parent.conversation.information.out_read < this.message.id;
        },

        checkIconClass() {
            return {
                read: !this.isNotRead
            };
        },

        showCheckIcon() {
            return this.message.out
                && !this.message.syncing 
                && !this.isNotRead;
        }
    }
};
</script>

<style lang="scss">
.message-content {
    display: flex;
    flex-direction: column;
    align-self: center;
    row-gap: 5px;

    max-width: 38vw;

    padding: 10px;

    background: var(--message);
    border-radius: 8px;
        
    &-name {
        color: var(--contrast);
        font-size: 12px;
    }

    &-fwd {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    &-info {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        column-gap: 5px;

        height: 15px;

        &-date {
            color: var(--contrast);
            font-size: 10px;
        }

        .icon {
            width: 14px;

            &.message-content-info-read path {
                stroke: var(--out-contrast);
            }
        }
    }
}
</style>