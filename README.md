<h1 align="center">Costream Stats</h1>

<div align="center">

![CostreamStats typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![CostreamStats repo size](https://img.shields.io/github/repo-size/victti/costream-stats?style=for-the-badge)
![CostreamStats open issues](https://img.shields.io/bitbucket/issues/victti/costream-stats?style=for-the-badge)
![CostreamStats open pull requests](https://img.shields.io/bitbucket/pr-raw/victti/costream-stats?style=for-the-badge)

</div>

## Information <a name = "information"></a>

View count of costreams views on twitch using certain keywords on the stream title.


## Getting started <a name = "building"></a>

- Install dependencies
```
cd <project_name>
npm install
```

- Create an .env file containing

```
SEARCH_KEYWORDS=the,keywords,you,want
SEARCH_EXCLUDE_CHANNELS=exclude,channel,names

SEARCH_GAME_ID=21779
SEARCH_LANGUAGES=en,es,pt

TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
```

- Run the project
```
npm run start
```