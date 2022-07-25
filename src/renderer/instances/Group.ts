import { shell } from "electron";
import { GroupsGroupFull } from "vk-io/lib/api/schemas/objects";
import { ProfileTypes, UserGroup } from "./Interfaces/General";

class Group implements UserGroup, GroupsGroupFull {
    public id: number;
    public profileType: ProfileTypes;
    public name: string;
    public screen_name: string;
    public photo_100?: string;

    constructor(group: GroupsGroupFull) {
        this.id = group.id;
        this.profileType = ProfileTypes.GROUP;
        this.name = group.name;
        this.photo_100 = group.photo_100;
    }

    openExternal(): Promise<void> {
        return shell.openExternal(`https://vk.com/public${this.id}`);
    }
}

export default Group;