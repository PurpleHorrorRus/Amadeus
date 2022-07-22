import { mapActions } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin],

    methods: {
        ...mapActions({
            addReply: "input/ADD_REPLY",
            edit: "input/EDIT",
            delete: "vk/messages/DELETE",
            markImportant: "vk/messages/MARK_IMPORTANT"
        }),

        async action(name: string, message: string) {
            message = message || this.message || this.menu.target;
            
            if (this.modal.show) {
                this.close();
            }

            switch (name) {
                case "reply": {
                    return this.addReply(message);
                }

                case "edit": {
                    return this.edit(message);
                }

                case "delete": {
                    return await this.delete({ message });
                }

                case "delete-for-all": {
                    return await this.delete({ 
                        delete_for_all: true,
                        message 
                    });
                }

                case "important": {
                    return await this.markImportant(message);
                }
            }
        }
    }
};