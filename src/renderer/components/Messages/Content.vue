<template>
    <div class="message-content">
        <AllAttachments :message="$parent.message" />

        <div class="message-content-info">
            <span
                v-if="showName"
                class="message-content-name"
                v-text="name"
            />

            <div class="message-content-info-right">
                <span
                    class="message-content-info-right-date"
                    v-text="relativeDate($parent.message.date)"
                />

                <PenIcon
                    v-if="$parent.message.edited"
                    v-tooltip.top-start="editedText"
                    class="icon amadeus message-content-info-right-edit"
                />

                <CheckIcon
                    v-if="showCheckIcon"
                    v-tooltip.top-start="$strings.CHAT.MESSAGE.READED"
                    class="icon message-content-info-right-read"
                    :class="checkIconClass"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import DateMixin from "~/mixins/date";

export default {
    components: {
        AllAttachments: () => import("~/components/Messages/AllAttachments.vue"),
        PenIcon: () => import("~icons/pen.svg"),
        CheckIcon: () => import("~icons/check.svg")
    },

    mixins: [DateMixin],

    computed: {
        conversation() {
            return this
                .$parent
                .$parent
                .$parent
                .$parent
                .$parent
                .chat.conversation;
        },

        showName() {
            return !this.$parent.message.out
                && this.conversation.isChat;
        },

        name() {
            return this.$parent.chatUserProfile.name;
        },

        readed() {
            if (!this.$parent.message.out) {
                return this.conversation.information.in_read
                    >= this.$parent.message.id;
            }

            return this.conversation.information.out_read
                >= this.$parent.message.id;
        },

        editedText() {
            return this.$i18n(
                this.$strings.CHAT.MESSAGE.EDITED,
                "relativeDate",
                this.relativeDate(this.$parent.message.update_time)
            );
        },

        checkIconClass() {
            return {
                read: this.readed
            };
        },

        showCheckIcon() {
            return !this.$parent.message.syncing
                && this.readed;
        }
    }
};
</script>

<style lang="scss">
.message.out .message-content-info {
    justify-content: flex-end;
}

.message-content {
    display: flex;
    flex-direction: column;
    align-self: center;
    row-gap: 5px;

    max-width: 20rem;

    padding: 10px;

    background: var(--message);
    border: 1px solid var(--message-bg);
    border-radius: 6px;

    &-name {
        width: max-content;

        color: var(--secondary);
        font-size: 12px;
    }

    &-fwd {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    &-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;

        padding: 5px 0px 0px 0px;

        &-name {
            font-size: 12px;
        }

        &-right {
            display: flex;
            align-items: center;
            column-gap: 5px;
            justify-self: flex-end;

            &-date {
                color: var(--contrast);
                font-size: 10px;
            }

            .icon {
                width: 10px;
                align-items: center;

                path {
                    fill: var(--contrast) !important;
                    stroke: var(--contrast) !important;
                }
            }
        }
    }
}
</style>