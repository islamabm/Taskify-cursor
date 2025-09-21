import { AddTaskStatusData } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const taskStatusesService = {

    insertTaskStatus,
    getTaskStatuses,
    editTaskStatus,
    deleteTaskStatus

}

const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}customStatuses`



async function getTaskStatuses() {
    const taskStatuses = await getRequest(SUBDOMAIN)
    return taskStatuses;
}

async function insertTaskStatus(taskStatusData: AddTaskStatusData) {
    const taskStatusID = await postRequest(SUBDOMAIN, taskStatusData)
    return taskStatusID;
}
async function editTaskStatus(taskStatusData: AddTaskStatusData, taskStatusID: number) {
    const editTaskStatusResponse = await putRequest(`${SUBDOMAIN}/${taskStatusID}`, taskStatusData)
    return editTaskStatusResponse;
}
async function deleteTaskStatus(taskStatusID: number) {
    const deleteTaskStatusResponse = await deleteRequest(`${SUBDOMAIN}/${taskStatusID}`)
    return deleteTaskStatusResponse;
}