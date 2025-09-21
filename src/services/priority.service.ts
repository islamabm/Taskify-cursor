import { AddPriorityLevelData } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const priorityService = {
    insertPriorityLevel,
    getPriorityLevels,
    editPriorityLevel,
    deletePriorityLevel

}


const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}priorityLevels`




async function insertPriorityLevel(priorityLevelData: AddPriorityLevelData) {
    const priorityLevelID = await postRequest(SUBDOMAIN, priorityLevelData)
    return priorityLevelID;
}
async function getPriorityLevels() {
    const priorityLevels = await getRequest(SUBDOMAIN)
    return priorityLevels;
}


async function editPriorityLevel(priorityLevelData: AddPriorityLevelData, priorityLevelID: number) {
    const editPriorityLevelResponse = await putRequest(`${SUBDOMAIN}/${priorityLevelID}`, priorityLevelData)
    return editPriorityLevelResponse;
}


async function deletePriorityLevel(priorityLevelID: number) {
    const deletePriorityLevelResponse = await deleteRequest(`${SUBDOMAIN}/${priorityLevelID}`)
    return deletePriorityLevelResponse;
}