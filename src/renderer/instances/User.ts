import { UsersUser } from "vk-io/lib/api/schemas/objects";

class User implements UsersUser {
    public id: number;
    public first_name: string;
    public last_name: string;
    public photo_100?: string;

    constructor(user: UsersUser) {
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.photo_100 = user.photo_100;
    }

    get name(): string { 
        return `${this.first_name} ${this.last_name}`;
    }
}

export default User;