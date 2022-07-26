import { shell } from "electron";
import { BaseBoolInt, UsersUserFull, UsersLastSeen } from "vk-io/lib/api/schemas/objects";
import { ProfileTypes, UserGroup } from "./Interfaces/General";

class User implements UserGroup, UsersUserFull {
    public id: number;
    public profileType: ProfileTypes;
    public first_name: string;
    public last_name: string;
    public photo_100?: string;
    public online?: BaseBoolInt;
    public online_mobile?: BaseBoolInt;
    public last_seen?: UsersLastSeen;

    constructor(user: UsersUserFull) {
        this.id = user.id;
        this.profileType = ProfileTypes.USER;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.photo_100 = user.photo_100;
        this.online = user.online;
        this.online_mobile = user.online_mobile;
        this.last_seen = user.last_seen;
    }

    openExternal(): Promise<void> {
        return shell.openExternal(`https://vk.com/id${this.id}`);
    }

    get name(): string {
        return `${this.first_name} ${this.last_name}`;
    }
}

export default User;