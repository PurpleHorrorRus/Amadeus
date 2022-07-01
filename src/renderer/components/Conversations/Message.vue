<template>
    <div class="conversation-message-body nowrap">
        <span 
            v-if="showSender"
            class="conversation-message-body-out small-text highlight" 
            v-text="sender" 
        />

        <span 
            v-if="showAttachments"
            class="conversation-message-body-attachments small-text highlight" 
            v-text="attachments" 
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
import { mapState } from "vuex";

export default {
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
        ...mapState({
            conversations: state => state.vk.conversations.list
        }),

        showAttachments() {
            return this.message.attachments.length > 0;
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
        },

        attachments() {
            let atts = {};

            for (const attachment of this.message.attachments) {
                attachment.type in atts
                    ? atts[attachment.type] += 1
                    : atts[attachment.type] = 1;
            }

            return Object.keys(atts).map(attachment => {
                const count = atts[attachment];

                switch(attachment) {
                    case "photo": {
                        if (count === 1) {
                            return "Изображение";
                        }

                        const label = count < 5 
                            ? "Изображения"
                            : "Изображений";

                        return `${count} ${label}`;
                    }

                    case "video": {
                        if (count === 1) {
                            return "Видеозапись";
                        }

                        const label = count < 5 
                            ? "Видеозаписи"
                            : "Видеозаписей";

                        return `${count} ${label}`;
                    }

                    case "audio": {
                        if (count === 1) {
                            return "Аудиозапись";
                        }

                        const label = count < 5 
                            ? "Аудиозаписи"
                            : "Аудиозаписей";

                        return `${count} ${label}`;
                    }

                    case "audio_playlist": {
                        return "Плейлист";
                    }

                    case "wall": {
                        return "Запись со стены";
                    }

                    case "sticker": {
                        return "Стикер";
                    }

                    case "graffiti": {
                        return "Граффити";
                    }

                    default: {
                        return `${count} Вложение`;
                    }
                }
            }).join(", ");
        }
    },

    watch: {
        conversations: {
            deep: true,

            handler() {
                this.updateMessageTime();
            }
        }
    },

    created() {
        this.updateInterval = setInterval(() => this.updateMessageTime(), 4 * 1000);
        this.updateMessageTime();
    },

    beforeDestroy() {
        clearInterval(this.updateInterval);
    },

    methods: {
        updateMessageTime() {
            const date = new Date(this.message.date * 1000);
            const now = new Date();

            const yearDiff = now.getFullYear() - date.getFullYear();
            if (yearDiff > 0) {
                this.dateText = `${yearDiff} г.`;
                return true;
            }

            let months = (now.getFullYear() - date.getFullYear()) * 12;
            const monthsDiff = months - date.getMonth() + now.getMonth();
            if (monthsDiff > 0) {
                this.dateText = `${monthsDiff} мес.`;
                return true;
            }

            const dateDiff = now.getTime() - date.getTime();
            
            const daysDiff = Math.floor(dateDiff / (1000 * 3600 * 24));
            if (daysDiff > 0 && daysDiff < 7) {
                this.dateText = `${daysDiff} д.`;
                return true;
            } else if (daysDiff >= 7) {
                const weekDiff = Math.floor(daysDiff / 7);
                this.dateText = `${weekDiff} нед.`;
                return true;
            }

            const hoursDiff = Math.floor((dateDiff / 1000) / (60 * 60));
            if (hoursDiff > 0) {
                this.dateText = `${hoursDiff} ч.`;
                return true;
            }
            
            const minsDiff = Math.round(dateDiff / 60000);
            if (minsDiff > 0) {
                this.dateText = `${minsDiff} м.`;
                return true;
            }
            
            const secsDiff = Math.round(dateDiff / 1000);
            if (secsDiff > 5) {
                this.dateText = `${secsDiff} с.`;
                return true;
            }

            this.dateText = "сейчас";
            return true;
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