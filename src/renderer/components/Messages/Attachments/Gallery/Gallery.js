import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    props: {
        index: {
            type: Number,
            required: true
        }
    },

    mixins: [AttachmentMixin],

    computed: {
        itemStyle() {
            return {
                gridArea: `item-${(this.index || 0) + 1}`
            };
        }
    }
};