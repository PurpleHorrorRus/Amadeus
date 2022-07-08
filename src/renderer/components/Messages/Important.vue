<template>
    <div class="important-message">
        <img :src="conversation.profile.photo_100" class="important-message-avatar">
        <div class="important-message-information">
            <div class="important-message-information-placeholder">
                <span 
                    class="important-message-information-placeholder-name" 
                    v-text="name(conversation.profile)" 
                />

                <span 
                    class="important-message-information-placholder-date small-text" 
                    v-text="relativeDate(message.date)" 
                />
            </div>

            <AllAttachments :message="message" />
        </div>
    </div>
</template>

<script>
import ProfileMixin from "~/mixins/profile";
import DateMixin from "~/mixins/date";
import AttachmentsMixin from "~/mixins/attachments";

export default {
    components: {
        AllAttachments: () => import("~/components/Messages/AllAttachments")
    },

    mixins: [ProfileMixin, DateMixin, AttachmentsMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        message() {
            return this.conversation.message;
        }
    }
};
</script>

<style lang="scss">
.important-message {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: max-content;
    align-items: flex-start;
    column-gap: 10px;

    cursor: pointer;

    &-avatar {
        width: 40px;
        height: 40px;

        border-radius: 100%;
    }

    &-information {
        display: flex;
        flex-direction: column;
        row-gap: 5px;

        &-placeholder {
            display: flex;
            flex-direction: row;
            align-items: center;
            column-gap: 5px;

            span {
                font-size: 12px;
            }

            &-name {
                color: var(--secondary);
            }
        }

        &-message {
            display: flex;
            flex-direction: column;
            row-gap: 10px;

            width: 30vw;
        }
    }

    .message-content-attachments {
        width: 30vw;
    }
}
</style>