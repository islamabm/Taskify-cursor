import { AddBusinessData, Business } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const businessService = {

    getBusinesses,
    insertBusiness,
    editBusiness,
    deleteBusiness,
    searchBusinesses,
    updateBusinesses
};



const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}markets`


async function getBusinesses() {
    const businesses = await getRequest(SUBDOMAIN)
    return businesses;
}


async function searchBusinesses(searchTerm: string): Promise<Business[]> {
    const response = await getRequest(SUBDOMAIN);

    const filteredBusinesses = response.data.filter((business: Business) => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesMarketName = business.marketName.toLowerCase().includes(searchTermLower);
        const matchesHaatBussID = business.HaatBussID.toString() === searchTerm;
        return matchesMarketName || matchesHaatBussID;
    });

    return filteredBusinesses;
}



async function insertBusiness(businessData: AddBusinessData) {
    const businessID = await postRequest(SUBDOMAIN, businessData)
    return businessID;
}

async function editBusiness(businessData: AddBusinessData, businessID: number) {
    const editedBusiness = await putRequest(`${SUBDOMAIN}/${businessID}`, businessData)
    return editedBusiness;
}
async function deleteBusiness(businessID: number) {
    const deletedBusinessRes = await deleteRequest(`${SUBDOMAIN}/${businessID}`)
    return deletedBusinessRes;
}


async function updateBusinesses() {
    await getRequest(`${SUBDOMAIN}/google/marketsSheet`)

}