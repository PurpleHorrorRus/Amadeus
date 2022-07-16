import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [AttachmentMixin],

    computed: {
        size() {
            const size = this.item.size / 1024 / 1024;
            return size < 1 
                ? `${Math.round(size * 1024)} KB`
                : `${Math.round(size)} MB`;
        }
    }
};