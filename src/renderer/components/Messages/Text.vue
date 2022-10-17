<template>
    <div class="message-content-text">
        <span
            v-for="(item, index) of formatted"
            :key="index"
            class="message-content-text-item break"
            :class="itemClass(item)"
            @click.stop.prevent="openItem(item, $event)"
            v-text="itemText(item)"
        />
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";
import common from "~/plugins/common";

// eslint-disable-next-line max-len
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

        for (const word of this.message.text.split(" ")) {
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
                    data: {
                        id: Number(id),
                        mention: `@${mention}`
                    }
                });

                continue;
            }

            const links = common.checkLinks(word);
            if (links.length > 0) {
                const formattedLinks = links.map(link => ({
                    type: types.link,
                    data: link
                }));

                this.formatted = this.formatted.concat(formattedLinks);
                continue;
            }

            text += " " + word;
        }

        if (text.length > 0) {
            this.formatted.push({
                type: types.text,
                data: text.trim()
            });
        }
    },

    methods: {
        openItem(item, event) {
            switch (item.type) {
                case types.link: return this.openExternal(item.data);
                case types.mention: return this.openExternal(`https://vk.com/id${item.data.id}`);
                default: return this.$parent.$parent.$parent.$parent.select(event, this.message);
            }
        },

        itemClass(item) {
            return {
                [item.type]: true
            };
        },

        itemText(item) {
            switch (item.type) {
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

        &.text {
            color: var(--contrast);
            cursor: text;
        }

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