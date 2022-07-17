import { GroupsGroupFull, MessagesChatFull, UsersUserFull } from "vk-io/lib/api/schemas/objects";

export type TProfile =
    UsersUserFull
    | GroupsGroupFull
    | MessagesChatFull;