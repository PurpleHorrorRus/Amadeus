export enum profileTypes {
    USER = "user",
    GROUP = "group",
    CHAT = "CHAT"
}

export interface UserGroup {
    readonly profileType: profileTypes
    openExternal(): Promise<void>
    readonly name: string
}