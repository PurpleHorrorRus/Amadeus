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

            <PenIcon
                v-if="message.edited"
                v-tooltip.top-start="`Отредактировано ${relativeDate(message.update_time)}`"
                class="icon amadeus message-content-info-edit"
            />

            <CheckIcon 
                v-if="showCheckIcon"
                v-tooltip.top-start="'Прочитано'" 
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
        PenIcon: () => import("~icons/pen.svg"),
        CheckIcon: () => import("~icons/check.svg")
    },

    mixins: [DateMixin],

    inject: ["provideData", "message"],

    computed: {
        showName() {
            return this.$parent.first 
                && !this.message.out 
                && this.provideData.conversation.isChat;
        },

        name() {
            return this.$parent.chatUserProfile.first_name;
        },

        isNotRead() {
            return this.provideData.conversation.information.out_read < this.message.id;
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
    border: 1px solid var(--message-bg);
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
        align-items: center;
        column-gap: 5px;

        height: 15px;

        &-date {
            color: var(--contrast);
            font-size: 10px;
        }

        .icon {
            width: 10px;
            align-items: center;

            &.message-content-info-read path {
                stroke: var(--out-contrast);
            }
        }
    }
}
</style>