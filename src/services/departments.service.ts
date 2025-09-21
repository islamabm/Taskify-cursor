import { AddDepartmentData, ApiServiceResponse, Department } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";

export const departmentsService = {

    getDepartments,
    insertDepartment,
    editDepartment,
    deleteDepartment,
    getSubDepartments,
    fetchDepartmentsWithSubDepartments,
    // getDepartmentsForSelectElement
};



const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}departments`





async function getDepartments(): Promise<ApiServiceResponse<Department[]>> {
    const userTypes = await getRequest<Department[]>(SUBDOMAIN);
    return userTypes;
}




async function getSubDepartments(departmentID: number): Promise<ApiServiceResponse<Department[]>> {
    const response = await getDepartments(); // This should return ApiServiceResponse
    const subDepartments = response.data.filter(department => department.parentID === departmentID);
    return {
        data: subDepartments,
        status: response.status // Assuming you want to pass through the original status
    };
}



async function fetchDepartmentsWithSubDepartments() {
    const departmentsResponse = await getDepartments();
    const departmentsWithSub = await Promise.all(
        departmentsResponse.data.filter((department) => department.parentID === 0).map(async (department) => {
            const subDepartmentsResponse = await getSubDepartments(department.departmentID);
            return {
                selectValue: department.departmentName,
                departmentID: department.departmentID,
                items: subDepartmentsResponse.data.map((subDepartment) => ({
                    itemValue: subDepartment.departmentID,
                    itemText: subDepartment.departmentName,
                })),
            };
        })
    );
    return departmentsWithSub;
}


async function insertDepartment(departmentData: AddDepartmentData) {
    const departmentID = await postRequest(SUBDOMAIN, departmentData)
    return departmentID;
}
async function editDepartment(departmentData: AddDepartmentData, departmentID: number) {
    const editDepartment = await putRequest(`${SUBDOMAIN}/${departmentID}`, departmentData)
    return editDepartment;
}
async function deleteDepartment(departmentID: number) {
    const deleteDepartmentRes = await deleteRequest(`${SUBDOMAIN}/${departmentID}`)
    return deleteDepartmentRes;
}





// async function getDepartmentsForSelectElement() {
//     const departments = await getRequest(SUBDOMAIN);
//     console.log("departments", departments)
//     // Separate main departments and sub-departments
//     const mainDepartments = departments.data.filter(dep => dep.parentID === 0);
//     const subDepartments = departments.data.filter(dep => dep.parentID !== 0);

//     // Create an array to hold the structured departments
//     const sortedDepartments = [];

//     mainDepartments.forEach(mainDept => {
//         // Add the main department first
//         sortedDepartments.push(mainDept);

//         // Find and add all sub-departments for the current main department
//         const subDeps = subDepartments.filter(subDept => subDept.parentID === mainDept.departmentID);
//         sortedDepartments.push(...subDeps);
//     });

//     return sortedDepartments;
// }
