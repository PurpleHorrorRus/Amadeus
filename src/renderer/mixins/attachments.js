const labels = {
    photo: {
        single: "Изображение",
        unset: "Изображения",
        low: "{{ count }} изображения",
        many: "{{ count }} изображений"
    },
    
    video: {
        single: "Видеозапись",
        unset: "Видеозаписи",
        low: "{{ count }} видеозаписи",
        many: "{{ count }} видеозаписей"
    },

    audio: {
        single: "Аудиозапись",
        unset: "Аудиозаписи",
        low: "{{ count }} аудиозаписи",
        many: "{{ count }} аудиозаписей"
    },

    doc: {
        single: "Документ",
        unset: "Документы",
        low: "{{ count }} документа",
        many: "{{ count }} документов"
    },

    fwd: {
        single: "Пересланное сообщение",
        unset: "Пересланные сообщения",
        low: "{{ count }} пересланных сообщения",
        many: "{{ count }} пересланных сообщений"
    },

    link: "Ссылка",
    audio_message: "Голосовое сообщение",
    audio_playlist: "Плейлист",
    poll: "Голосование",
    wall: "Запись со стены",
    sticker: "Стикер",
    graffiti: "Граффити",
    story: "История",
    default: "Вложение"
};

export default {
    props: {
        data: {
            type: [Array, Object],
            required: true
        }
    },

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
            const label = labels[attachment];

            if (!unset) {
                if (typeof label !== "object") {
                    return label;
                }

                return count === 1
                    ? label.single
                    : (count < 5 ? label.low : label.many)
                        .replace("{{ count }}", count);
            }

            return typeof label === "object"
                ? (count === 1 ? label.single : label.unset)
                : label;
        },

        formatAttachmentsString(message, unset = true) {
            if (message.attachments.length === 0 && message.fwd_messages?.length === 0) {
                return "";
            }

            let atts = {};

            for (const attachment of message.attachments) {
                attachment.type in atts
                    ? atts[attachment.type] += 1
                    : atts[attachment.type] = 1;
            }

            let formatted = [];
            if (message.fwd_messages?.length > 0) {
                formatted.push(this.formatAttachment("fwd", message.fwd_messages.length, unset));
            }

            const attachments = Object.keys(atts).map(attachment => {
                return this.formatAttachment(attachment, atts[attachment], unset);
            });

            formatted = [...formatted, ...attachments];
            return formatted.join(", ");
        }
    }
};