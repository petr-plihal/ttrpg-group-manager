export interface Group {
    id: number,
    name: string,
    description?: string,
    location: string,
    isopen: boolean,
    languages?: string,
    maxsize: number,
    dmneeded: boolean,
    gameid?: number,
}
