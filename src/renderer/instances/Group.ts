import { shell } from "electron";
import { GroupsGroupFull } from "vk-io/lib/api/schemas/objects";
import { UserGroup } from "./Interfaces/General";

class Group implements UserGroup, GroupsGroupFull {
    public id: number;
    public screen_name: string;
    public photo_100?: string;

    constructor(group: GroupsGroupFull) {
        this.id = group.id;
        this.screen_name = group.screen_name;
        this.photo_100 = group.photo_100;
    }

    openExternal(): Promise<void> { 
        return shell.openExternal(`https://vk.com/public${this.id}`);
    }

    get name(): string { 
        return this.screen_name;
    }
}

export default Group;