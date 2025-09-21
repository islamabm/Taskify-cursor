import { } from "./https-axios.service"
import { httpsService } from "./https2.service"

export const partnersService = {
    searchPartners,



}


const SUBDOMAIN = process.env.REACT_APP_MAIN_API_URL

async function searchPartners(textToSearch: string) {
    const res = await httpsService.fetchData(`${SUBDOMAIN}searchPartnersTaskify.php`, { textToSearch })
    return res
}

