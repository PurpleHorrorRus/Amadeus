import { mapActions } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin],

    methods: {
        ...mapActions({
            addReply: "input/ADD_REPLY",
            edit: "input/EDIT",
            delete: "messages/DELETE",
            markImportant: "messages/MARK_IMPORTANT"
        }),

        async action(name, message) {
            message = message || this.message || this.menu.target;
            this.close();

            switch(name) {
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