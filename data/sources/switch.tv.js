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


async function fetchChannels(region) {

    const options = [
        `limit=100`,
        `offset=0`,
        `include_related=1`,
        `expand_related=full`,
        `related_entity_types=images`
    ]
    
    const url = `/channels/region/${region}?${options.join('&')}`
    const json = await getJSON(url)
    return json.data;
}

async function fetchChannelEpg({dvbTriplet, days = 1} = {}) {

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

    const url = `/epgs/${dvbTriplet}?${options.join('&')}`
    const json = await getJSON(url)
    console.log(`fetched epg for ${dvbTriplet} (${json.data.length})`)
    return json;
}

module.exports.fetchChannels = fetchChannels
module.exports.fetchChannelEpg = fetchChannelEpg
module.exports.regions = regions