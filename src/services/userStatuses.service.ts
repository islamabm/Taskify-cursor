import { AddUserStatusData, ApiServiceResponse, EmployeeStatus } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";


export const userStatusesService = {

    insertUserStatus,
    getUsersStatus,
    editUserStatus,
    deleteUserStatus

}


const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}userStatuses`


async function getUsersStatus(): Promise<ApiServiceResponse<EmployeeStatus[]>> {
    const userStatuses = await getRequest<EmployeeStatus[]>(SUBDOMAIN);
    return userStatuses;
}

async function insertUserStatus(userStatusData: AddUserStatusData) {
    const userStatusID = await postRequest(SUBDOMAIN, userStatusData)
    return userStatusID;
}
async function editUserStatus(userStatusData: AddUserStatusData, userStatusID: number) {
    const editUserStatusResponse = await putRequest(`${SUBDOMAIN}/${userStatusID}`, userStatusData)
    return editUserStatusResponse;
}
async function deleteUserStatus(userStatusID: number) {
    const deleteUserStatusResponse = await deleteRequest(`${SUBDOMAIN}/${userStatusID}`)
    return deleteUserStatusResponse;
}