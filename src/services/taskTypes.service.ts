import { AddTaskTypeData } from "@/types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const taskTypesService = {
    getTasksTypes,
    insertTaskType,
    editTaskType,
    deleteTaskType
}


const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}ticketTypes`




async function getTasksTypes() {
    const taskTypes = await getRequest(SUBDOMAIN)
    return taskTypes;
}

async function insertTaskType(taskTypeData: AddTaskTypeData) {
    const taskTypeID = await postRequest(SUBDOMAIN, taskTypeData)
    return taskTypeID;
}
async function editTaskType(taskTypeData: AddTaskTypeData, taskTypeID: number) {
    const editTaskTypeResponse = await putRequest(`${SUBDOMAIN}/${taskTypeID}`, taskTypeData)
    return editTaskTypeResponse;
}
async function deleteTaskType(ticketTypeID: number) {
    const deleteTaskTypeResponse = await deleteRequest(`${SUBDOMAIN}/${ticketTypeID}`)
    return deleteTaskTypeResponse;
}


