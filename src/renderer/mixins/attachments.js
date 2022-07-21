export default {
    props: {
        data: {
            type: [Array, Object],
            required: true
        }
    },

    data: () => ({
        blockedAttachments: ["sticker", "graffiti", "audio_message"]
    }),

    computed: {
        showAttachments() {
            return this.message.attachments.length > 0
                || this.message.geo;
        },

        showForwardedMessages() {
            return this.message.fwd_messages?.length > 0;
        }
    },

    methods: {
        formatAttachment(attachment, count, unset = true) {
            const label = this.$strings.CONVERSATIONS.ATTACHMENTS[attachment.toUpperCase()];

            if (!unset) {
                if (typeof label !== "object") {
                    return label;
                }

                return count === 1
                    ? label.SINGLE
                    : (count < 5 ? label.LOW : label.MANY)
                        .replace("{{ count }}", count);
            }

            return typeof label === "object"
                ? (count === 1 ? label.SINGLE : label.UNSET)
                : label;
        },

        formatAttachmentsString(message, unset = true) {
            if (message.attachments?.length === 0 && message.fwd_messages?.length === 0) {
                return "";
            }

            let attachments = [];
            if (message.attachments.length > 0) {
                const atts = {};

                for (const attachment of message.attachments) {
                    attachment.type in atts
                        ? atts[attachment.type] += 1
                        : atts[attachment.type] = 1;
                }

                attachments = Object.keys(atts).map(attachment => {
                    return this.formatAttachment(attachment, atts[attachment], unset);
                });
            }

            let formatted = [];
            if (message.fwd_messages?.length > 0) {
                const forwarded = this.formatAttachment("fwd", message.fwd_messages.length, unset);
                formatted.push(forwarded);
            }

            formatted = [...formatted, ...attachments];
            return formatted.join(", ");
        },

        checkBlockedAttachments(message) {
            return this.blockedAttachments.includes(message.attachments[0]?.type);
        }
    }
};