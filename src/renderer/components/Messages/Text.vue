<template>
    <div class="message-content-text">
        <span 
            v-for="(item, index) of formatted"
            :key="index"
            class="message-content-text-item"
            :class="itemClass(item)"
            @click="openMention(item)" 
            v-text="itemText(item)"
        />
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;
const types = {
    text: "text",
    mention: "mention"
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
        openMention(item) {
            if (item.type !== types.mention) {
                return false;
            }

            return this.openExternal(`https://vk.com/id${item.data.id}`);
        },

        itemClass(item) {
            return { 
                [item.type]: true
            };
        },

        itemText(item) {
            return item.type === types.text
                ? item.data 
                : "@" + item.data.mention;
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

        &.mention {
            color: var(--contrast);
            
            &:hover {
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
}
</style>