import { IChannel } from "./IChannel";

export interface IGetStreamsParams {
    user_id?: string;
    user_login?: string;
    game_id?: string;
    type?: "all" | "live";
    language?: string[];
    first?: number;
    before?: string;
    after?: string;
}

export interface IGetStreams {
    data: IChannel[],
    pagination: { cursor?: string }
}