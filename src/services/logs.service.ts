import { AddLogData, SearchLogsData, DatesData } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const logsService = {

    insertLog,
    getLogs,
    editLog,
    deleteLog,
    searchLogs,
    getWorkLogsByTicketID,
    getBusinessesData

}

const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}workLogs`



async function getLogs() {
    const logs = await getRequest(SUBDOMAIN)
    return logs;
}

async function insertLog(logData: AddLogData) {
    const logID = await postRequest(SUBDOMAIN, logData)
    return logID;
}
async function editLog(logData: AddLogData, logID: number) {
    const editLogResponse = await putRequest(`${SUBDOMAIN}/${logID}`, logData)
    return editLogResponse;
}
async function deleteLog(logID: number) {
    const deleteLogResponse = await deleteRequest(`${SUBDOMAIN}/${logID}`)
    return deleteLogResponse;
}
async function searchLogs(logData: SearchLogsData) {
    const searchLogsResponse = await postRequest(`${SUBDOMAIN}/search`, logData)
    return searchLogsResponse;
}

async function getWorkLogsByTicketID(logID: number) {
    const workLogsByTicketID = await getRequest(`${SUBDOMAIN}/getWorkLogsByTicketID/${logID}`)
    return workLogsByTicketID;
}

async function getBusinessesData(datesData: DatesData) {
    const searchLogsResponse = await postRequest(`${SUBDOMAIN}/getMarketsStatisticsTotalMinutes`, datesData)
    return searchLogsResponse;
}



//TODO

//EDIT WORKLOG TIME
//DELETE WORK LOG