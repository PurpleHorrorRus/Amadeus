import { UsersUser } from "vk-io/lib/api/schemas/objects";

import lodash from "lodash";

import User from "~/instances/User";

class ChatUser extends User implements UsersUser {
    public typing: {
        enable: boolean
        debounce: lodash.DebouncedFunc<any>
    };

    public screen_name?: string;

    constructor(user: UsersUser) {
        super(user);

        this.screen_name = user.screen_name;

        this.typing = {
            enable: false,
            debounce: lodash.debounce(function () {
                this.enable = false;
            }, 6000)
        };
    }

    stopTyping(): void {
        this.typing.enable = false;
    }
}

export default ChatUser;