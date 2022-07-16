export interface UserGroup {
    openExternal(): Promise<void>
    readonly name: string
}