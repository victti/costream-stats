import dotenv from 'dotenv';
dotenv.config();

import { AccessToken, AppTokenAuthProvider } from '@twurple/auth';
import { IGetStreams, IGetStreamsParams } from './interfaces/IGetStreams';
import { IChannel } from './interfaces/IChannel';

const SEARCH_KEYWORDS = process.env['SEARCH_KEYWORDS'] != undefined ? process.env['SEARCH_KEYWORDS'].split(",") : [];
const SEARCH_EXCLUDE_CHANNELS = process.env['SEARCH_EXCLUDE_CHANNELS'] != undefined ? process.env['SEARCH_EXCLUDE_CHANNELS'].split(",") : [];

const SEARCH_GAME_ID = process.env['SEARCH_GAME_ID'] != undefined ? process.env['SEARCH_GAME_ID'] : "";
const SEARCH_LANGUAGES = process.env['SEARCH_LANGUAGES'] != undefined ? process.env['SEARCH_LANGUAGES'].split(",") : [];

const TWITCH_CLIENT_ID = process.env['TWITCH_CLIENT_ID'] != undefined ? process.env['TWITCH_CLIENT_ID'] : "";
const TWITCH_CLIENT_SECRET = process.env['TWITCH_CLIENT_SECRET'] != undefined ? process.env['TWITCH_CLIENT_SECRET'] : "";

let tokenData: AccessToken;
let authProvider: AppTokenAuthProvider;

async function EntryPoint()
{
    authProvider = new AppTokenAuthProvider(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);

    tokenData = await authProvider.getAppAccessToken();

    let channels = await SearchForTitleKeyword(SEARCH_KEYWORDS, SEARCH_EXCLUDE_CHANNELS, SEARCH_GAME_ID, SEARCH_LANGUAGES);

    let totalChannels = Object.keys(channels).length;
    let totalViews = Object.values(channels).reduce((a, b) => a + b.viewer_count, 0);
    let channelNames = Object.values(channels).map(c => `${c.user_name} (${c.viewer_count} | ${c.language})`).join(", ");

    let date = new Date();
    let dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    console.log(channels)
    console.log(`${dateString} - Total de canais usando ${SEARCH_KEYWORDS} no titulo da live: ${totalChannels}`);
    console.log(`${dateString} - Canais usando ${SEARCH_KEYWORDS} no titulo da live: ${channelNames}`);
    console.log(`${dateString} - Total de views usando ${SEARCH_KEYWORDS} no titulo da live: ${totalViews}`);
}
// 28:00
async function SearchForTitleKeyword(keywords: string[], excludeChannels: string[], gameId?: string, languages?: string[], depth: number = 1000)
{
    let page = 1;
    let maxPages = depth;

    let after = "";

    let output: {[id: string]: IChannel} = {};

    do
    {
        console.log(`Page ${page}/${maxPages}`);

        let channels = await GetStreams({game_id: gameId, type: "live", first: 100, language: languages, after});

        for(const channel of channels.data)
        {
            let hasKeyword = false;
            for(const keyword of keywords)
            {
                if(channel.title.toLowerCase().includes(keyword.toLowerCase()))
                {
                    hasKeyword = true;
                    break;
                }
            }

            if(!hasKeyword)
                continue;

            if(excludeChannels.includes(channel.id) || excludeChannels.includes(channel.user_id) || excludeChannels.includes(channel.user_login))
                continue;

            if(output[channel.id] != undefined && output[channel.id].viewer_count > channel.viewer_count)
                continue;

            output[channel.id] = channel;
        }

        console.log(`Found ${Object.keys(output).length} channels`);

        if(channels.pagination == undefined || channels.pagination.cursor == undefined)
            break;

        after = channels.pagination.cursor;
    } while (page++ < maxPages);

    console.log("Done");

    return output;
}

async function GetStreams(params: IGetStreamsParams) : Promise<IGetStreams>
{
    let url = new URL("https://api.twitch.tv/helix/streams");

    for(const [key, value] of Object.entries(params))
    {
        if(Array.isArray(value))
        {
            for(const v of value)
            {
                url.searchParams.append(key, v);
            }
            continue;
        }

        if(value == "" || value == undefined)
            continue;

        url.searchParams.append(key, value);
    }

    return await fetch(url.toString(), {
        headers: {
            'Client-Id': TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${tokenData.accessToken}`
        }
    })
    .then(resp => resp.json())
    .then(async json => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return json;
    });
}

EntryPoint();