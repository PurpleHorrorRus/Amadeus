/* eslint-disable no-unused-vars */
export enum ProfileTypes {
    USER = "user",
    GROUP = "group",
    CHAT = "CHAT"
}

export interface UserGroup {
    readonly profileType: ProfileTypes
    openExternal(): Promise<void>
    readonly name: string
}