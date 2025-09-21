import { AddUserTypeData, ApiServiceResponse, UserType } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const userTypesService = {
    getUserTypes,
    insertUserType,
    editUserType,
    deleteUserType
}


const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}userTypes`






async function getUserTypes(): Promise<ApiServiceResponse<UserType[]>> {
    const userTypes = await getRequest<UserType[]>(SUBDOMAIN);
    return userTypes;
}


async function insertUserType(userTypeData: AddUserTypeData) {
    const userTypeID = await postRequest(SUBDOMAIN, userTypeData)
    return userTypeID;
}
async function editUserType(userTypeData: AddUserTypeData, userTypeID: number) {
    const editUserTypeResponse = await putRequest(`${SUBDOMAIN}/${userTypeID}`, userTypeData)
    return editUserTypeResponse;
}
async function deleteUserType(userTypeID: number) {
    const deleteUserTypeResponse = await deleteRequest(`${SUBDOMAIN}/${userTypeID}`)
    return deleteUserTypeResponse;
}


