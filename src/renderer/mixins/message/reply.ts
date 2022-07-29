import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    mixins: [CoreMixin, AttachmentsMixin],

    data: () => ({
        reply: null
    }),

    methods: {
        replyText(reply) {
            return `${this.formatAttachmentsString(reply, false)} 
                ${this.formatText(reply.text)}`;
        }
    }
};