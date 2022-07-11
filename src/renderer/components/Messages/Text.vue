<template>
    <div class="message-content-text">
        <span 
            v-for="(item, index) of formatted"
            :key="index"
            class="message-content-text-item"
            :class="itemClass(item)"
            @click.stop="openItem(item)" 
            v-text="itemText(item)"
        />
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

// eslint-disable-next-line max-len
const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
const mentionRegex = /\[id(.*?)\|@(.*?)\]/;
const types = {
    text: "text",
    mention: "mention",
    link: "link"
};

export default {
    mixins: [AttachmentMixin],

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        formatted: []
    }),

    created() {
        let text = "";

        this.message.text.split(" ").forEach(word => {
            if (mentionRegex.test(word)) {
                if (text.length > 0) {
                    this.formatted.push({
                        type: types.text,
                        data: text
                    });

                    text = "";
                }

                const [, id, mention] = word.match(mentionRegex);
                this.formatted.push({
                    type: types.mention,
                    data: { id: Number(id), mention }
                });
                
                return mention;
            } 
            
            if (linkRegex.test(word)) {
                this.formatted.push({
                    type: types.link,
                    data: word
                });

                return word;
            }

            text += " " + word;
            return text;
        });

        if (text.length > 0) {
            this.formatted.push({
                type: types.text,
                data: text
            });
        }
    },

    methods: {
        openItem(item) {
            switch(item.type) {
                case types.link: return this.openExternal(item.data);
                case types.mention: return this.openExternal(`https://vk.com/id${item.data.id}`);
                default: return false;
            }
        },

        itemClass(item) {
            return { 
                [item.type]: true
            };
        },

        itemText(item) {
            switch(item.type) {
                case types.text: case types.link: return item.data;
                case types.mention: return item.data.mention;
            }
        }
    }
};
</script>

<style lang="scss">
.message-content-text {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 5px;

    &-item {
        font-size: 14px;

        user-select: text;
        hyphens: auto;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;

        &.mention, &.link {
            color: var(--contrast);
            
            &:hover {
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
}
</style>