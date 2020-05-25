const fs = require('fs');
fs.writeFile('myjsonfile.json', JSON.stringify({test: 'test'}), 'utf8', () => {});


// const fetch = require('make-fetch-happen').defaults({
//     cacheManager: './my-cache' // path where cache will be written (and read)
// })

const bent = require('bent')
const getJSON = bent('https://fvau-api-prod.switch.tv/content/v1', 'json')

const daystoms = days => days * 24 * 60 * 60 * 1000

const regions = new Set([
    "region_national",
    "region_nsw_sydney",
    "region_nsw_newcastle",
    "region_nsw_taree",
    "region_nsw_tamworth",
    "region_nsw_orange_dubbo_wagga",
    "region_nsw_northern_rivers",
    "region_nsw_wollongong",
    "region_nsw_canberra",
    "region_nt_regional",
    "region_vic_albury",
    "region_vic_shepparton",
    "region_vic_bendigo",
    "region_vic_melbourne",
    "region_vic_ballarat",
    "region_vic_gippsland",
    "region_qld_brisbane",
    "region_qld_goldcoast",
    "region_qld_toowoomba",
    "region_qld_maryborough",
    "region_qld_widebay",
    "region_qld_rockhampton",
    "region_qld_mackay",
    "region_qld_townsville",
    "region_qld_cairns",
    "region_sa_adelaide",
    "region_sa_regional",
    "region_wa_perth",
    "region_wa_regional_wa",
    "region_tas_hobart",
    "region_tas_launceston",
])

const defaultRegion = 'region_vic_melbourne'

async function fetchChannels({region = defaultRegion} = {}) {

    const endpoint = 'https://fvau-api-prod.switch.tv/content/v1/channels/region/'
    
    const options = [
        `limit=100`,
        `offset=0`,
        `include_related=1`,
        `expand_related=full`,
        `related_entity_types=images`
    ]
    
    const url = `/channels/region/${region}?${options.join('&')}`
    const json = await getJSON(url)
    // const json = await response.json()
    console.log(url)
    console.log(json.data)
    return json.data;
}

async function getChannels({region = defaultRegion} = {}) {
    const data = await fetchChannels({region})
    const channels = new Map(data.map(({ lcn, dvb_triplet }) => [
        lcn,
        dvb_triplet,
    ]))
    console.log(channels)
    return channels
}


async function getEpgs({region = defaultRegion, days = 1} = {}) {
    const channels = await getChannels({region})
    // console.log('fffff',[...channels.keys()].forEach(channel => console.log(channels.get(channel))))
    const ids = [...channels.values()]
    const done = await Promise.all(ids.map(id => fetchChannelEpg({id, days})))
    // console.log('done', done[1].data.length)
    return done
}


async function fetchChannelEpg({id, days} = {}) {

    console.log('fetching epg', id, days)

    const endpoint = 'https://fvau-api-prod.switch.tv/content/v1/epgs/'

    const startms = new Date().setMinutes(0,0,0,0)
    const endms = startms + daystoms(days)
    const start = new Date(startms).toISOString().split('.')[0] + 'Z'
    const end = new Date(endms).toISOString().split('.')[0] + 'Z'

    const options = [
        `start=${start}`,
        `end=${end}`,        
        `sort=start`,
        `related_entity_types=episodes.images`,
        `related_levels=2`,
        `include_related=1`,
        `expand_related=full`,
        `limit=100`,
        `offset=0`
    ]

    const url = `/epgs/${id}?${options.join('&')}`
    const json = await getJSON(url)
    // console.log(response.status)
    // const json = await response.json()
    console.log('tttttttttttttt', json.data.length)
    return json;
}

// fetchChannelEpg({id:'1010:0221:0220', days:1})
// getChannels({region: 'region_vic_melbourne'})
getEpgs({region: 'region_vic_melbourne', days:1})
