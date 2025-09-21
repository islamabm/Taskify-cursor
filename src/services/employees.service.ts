import { AddEmployeeData } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const employeesService = {
    getEmployees,
    addEmployee,
    editEmployee,
    deleteEmployee,
    changeEmployeePassword,
    getMyEmployees,
    getEmployee
};


const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}users`


async function getEmployees() {
    const employees = await getRequest(SUBDOMAIN)
    return employees;
}
async function getMyEmployees() {
    const myEmployees = await getRequest(`${SUBDOMAIN}/myUsers/getMyUsers`)
    return myEmployees;
}



async function addEmployee(employeeData: AddEmployeeData) {
    const employeeID = await postRequest(SUBDOMAIN, employeeData)
    return employeeID;
}

async function editEmployee(employeeData: any, userID: number) {
    const employeeID = await putRequest(`${SUBDOMAIN}/${userID}`, employeeData)
    return employeeID;
}
async function deleteEmployee(userID: number) {
    const deleteUserRes = await deleteRequest(`${SUBDOMAIN}/${userID}`)
    return deleteUserRes;
}

async function getEmployee(userID: number) {
    const employee = await getRequest(`${SUBDOMAIN}/${userID}`)
    return employee;
}
async function changeEmployeePassword(employeeData: any, userID: number) {
    const editPasswordResult = await putRequest(`https://app01.ms.lan-wan.net/users/changePassword/${userID}`, employeeData)
    return editPasswordResult;
}

