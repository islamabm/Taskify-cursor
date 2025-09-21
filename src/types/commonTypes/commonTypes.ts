
import { ReactNode } from "react";

export type Employee = {
    employeeID: string,
    employeeName: string,
    employeeDepartment: string,
    employeeDepartmentID: string,
    employeePhone: string,
    employeeStatus: string,
    employeeStatusID: string,
    employeeEmail: string,
    confirmPassword?: string,
    password?: string,
}


export type EditEmployee = {
    userID: string,
    fullName: string,
    phone1: string,
    departmentID: string,
    userStatusID: string,
    userTypeID: string,
    email: string,

}
export type AddEmployee = {
    employeeName: string,
    employeeDepartmentID: string,
    employeeTypeID: string,
    employeePhone: string,
    employeeStatusID: string,
    employeeEmail: string,
    confirmPassword?: string,
    password?: string,
}
export type Task = {
    ticketID: number;
    content: string;
    createdDateTime: string; // ISO string
    marketName: string; // ISO string
    customStatus: TaskStatus;
    employeeNotes: string;
    deadline: number; // e.g., in minutes or hours
    department: Department;
    finishDate: string | null; // ISO string or null
    startDateDisplay: string | null; // ISO string or null
    finishDateDisplay: string | null; // ISO string or null
    isMessage: boolean;
    isPublished: boolean;
    market: Business;
    priorityLevel: Priority;
    quantity: number;
    startDate: string | null; // ISO string or null
    ticketType: TaskType;
    user: User;
    workLogID: number;
    duration?: number; // in minutes
    problemsProducts?: any[];
    products?: any[];
    isCategorized: boolean;
    isTagged: boolean;
    isAppCheck: boolean;
    totalDuration: number;

};


export type AddTaskModalState = {
    priorityLevelID: number | string;
    ticketTypeID: number | string
    userID: number | string
    customStatusID: number | string
    departmentID: number | string
    deadline: number
    quantity: number
    content: string
}






export interface SelectData {
    itemValue: number,
    itemText: string
    helpVariable?: number
}
export interface SelectDataNumber {
    itemValue: number,
    itemText: string
}



export interface Business {
    marketID: number,
    marketName: string,
    marketNameAr: string,
    phone1: string,
    phone2: string,
    phone3: string,
    phone4: string,
    HaatBussID: number,
    logoURL: string
    isDeleted: number,
}
export interface Department {
    departmentID: number,
    departmentName: string
    parentID: number,
}
export interface EditWorkLogModalState {
    workLogID: number,
    startDateTime: string,
    endDateTime: string,
    ticketID: number,
}
export interface EmployeeStatus {
    userStatusID: number,
    userStatus: string
}
export interface Priority {
    priorityLevelID: number,
    priorityLevel: string
}
export interface TaskStatus {
    customStatusID: number,
    customStatus: string,
    orderOfDisplay: number,
    type: string
}


export interface TaskType {
    ticketTypeID: string,
    ticketType: string,
    department: {
        departmentID: number,
        departmentName: string
    } | null


}
export interface EditTaskType {
    ticketTypeID: number,
    ticketType: string,
    department: {
        departmentID: number,
        departmentName: string
    } | null
    departmentID: number
}
export interface EmployeeType {
    employeeType: string,
    employeeTypeID: string
}
export interface SubDepartment {
    departmentName: string,
    departmentID: number,
    parentID: number,
}
export interface EditSubDepartment {
    departmentName: string,
    departmentID: number,
    parentID: number,
}
export interface EmployeeRealTimeData {
    userID: string;
    fullName: string;

}

export interface LogsOptions {

    employeeID: string,
    statusID: string,

    priorityID: string,
    typeID: string,

}

export interface AddDepartmentModalState {
    departmentName: string,
}
export interface AddPriorityModalState {
    priorityLevel: string,
}
export interface AddTaskTypeModalState {
    taskTypeName: string,
    departmentID: string,
}
export interface AddUserTypeModalState {
    userTypeName: string,
}
export interface AddSubDepartmentModalState {
    subDepartmentName: string,
}

export interface AddTaskStatusModalState {
    taskStatus: string,
    orderOfDisplay: number,
    type: string,
}
export interface AddEmployeeStatusModalState {
    userStatus: string,
}
export interface AddBusinessModalState {
    marketName: string,
    HaatBussID: number,
    marketNameAr: string,
    phone1: string,
    phone2: string,
    phone3: string,
    phone4: string,
    logoURL: string,
}
export interface EditBusinessModalState {
    marketName: string,
    marketID: number,
    HaatBussID: number,
    marketNameAr: string,
    phone1: string,
    phone2: string,
    phone3: string,
    phone4: string,
    logoURL: string,
}
export interface TaskStatusEditModalState {
    statusID: string,
    statusName: string,
}
export interface EditTaskStatusEditModalState {
    customStatusID: number,
    customStatus: string,
    orderOfDisplay: number,
    type: string,
}
export interface EmployeeStatusEditModalState {
    userStatusID: number,
    userStatus: string,
}

export interface AddEmployeeData {
    fullName: string,
    email: string,
    phone1: string,
    phone2: string,
    pwdHash: string,
    userType: {
        userTypeID: number,
    },
    userStatus: {
        userStatusID: number,
    },
    departmentID: number,
}

export interface GroupedSelectData {
    selectValue: string;
    items: SelectData[];
}



export type User = {
    email: string,
    fullName: string,
    phone1: string,
    phone2?: string,
    userID: number,
    departmentName: string | null,
    // userStatus: {
    //     userStatusID: number,
    userStatus: string,
    // }

    // userType: {
    // userTypeID: number,
    userType: string,
    // }
}

export type AddPriorityLevelData = {

    priorityLevel: string,
}

export type AddUserStatusData = {

    userStatus: string,
}
export type AddTaskStatusData = {
    orderOfDisplay: number,
    customStatus: string,
}
export type AddBusinessData = {
    HaatBussID: number,
    marketName: string,
}

export type UserStatus = {
    userStatusID: number,
    userStatus: string,
}
export type AddDepartmentData = {
    departmentID?: number,
    departmentName: string,
    parentID: number
}
export type AddTaskTypeData = {
    ticketType: string,

}
export type AddUserTypeData = {
    userType: string,

}
export type AddTaskData = {
    priorityLevel: {
        priorityLevelID: number;
    };
    ticketType: {
        ticketTypeID: number;
    };
    market: {
        marketID: number;
    };
    user: {
        userID: number;
    },
    customStatus: {
        customStatusID: number;
    };
    department: {
        departmentID: number;
    };
    deadline: number;
    quantity: number;
    content: string;
};






export type EditTaskData = {
    priorityLevel: {
        priorityLevelID: number;
    };
    ticketType: {
        ticketTypeID: number;
    };
    market: {
        marketID: number;
    };
    user: {
        userID: number;
    },
    customStatus: {
        customStatusID: number;
    };
    department: {
        departmentID: number;
    };
    deadline: number;
    quantity: number;
    isMessage: boolean;
    isPublished: boolean;
    content: string;
};

export type UserType = {
    userTypeID: number,
    userType: string,

}
export type EditUserType = {
    userTypeID: number,
    userType: string,

}
export type LoginData = {
    pwdHash: string,
    phone1: string,

}


export interface LoginResponse {

    data: {

        fullName: string;
        access_token: string;
        userTypeID: number;
    }
    status: number;



    message: string;
    error: string;
    statusCode: number;


}

export interface AddLogData {

}


export interface BusinessResponse {
    data: Business[];
}




export interface ApiServiceResponse<T> {
    data: T;
    status: number;
    // Add other relevant fields here, like error messages, status codes, etc.
}
export interface AddNoteTaskData {
    ticketID: number;
    userID: number;
    workLogID: number;
    endType: 'pause | end'
    // Add other relevant fields here, like error messages, status codes, etc.
}


export interface SearchLogsData {
    fromDate: string,
    toDate: string,
    HaatBussID: number,
    userID: number,
    priorityLevelID: number,
    ticketTypeID: number,
    customStatusID: number
}
export interface DatesData {
    fromDate: string,
    toDate: string,

}
export interface Product {
    productID: number,
    prodName: string,
    price: number,
    barcode: string,
    imageURL: string,
    isDeleted: number,
    category: string,
    subCategory: string,
    bussNotes: string,
    employeeNotes: string,
    customStatus: {
        customStatusID: number,
        customStatus: string,
    } | null,

}


export interface LogByTicketID {
    workLogID: number,
    startDateTime: string,
    endDateTime: string,
    type: string,
    notes: string,
    duration: number,
    user: {
        userID: number,
        fullName: string,
    },
    ticket: {
        ticketID: number,
        duration: number
    }
}


export interface Log {
    workLogID: number | null;
    workLogType: string;
    workLogNote
    : string;
    ticketID: number;
    content: string;
    deadline: number;
    quantity: number;
    startDate: string;           // e.g. "2024-12-09T11:23:54.000Z"
    finishDate: string;          // e.g. "2024-12-09T12:12:48.000Z"
    startDateTime: string;           // e.g. "2024-12-09T11:23:54.000Z"
    endDateTime: string;          // e.g. "2024-12-09T12:12:48.000Z"
    workLogDuration: number;          // e.g. "2024-12-09T12:12:48.000Z"
    isPublished: number;         // likely 0 or 1
    isMessage: number;           // likely 0 or 1
    isDeleted: number;           // likely 0 or 1
    createdDateTime: string;     // e.g. "2024-12-09T08:16:04.000Z"
    duration: number;
    employeeNotes: string;
    customStatusID: number;
    priorityLevelID: number;
    ticketTypeID: number;
    marketID: number;
    userID: number;
    departmentID: number;
    marketName: string;
    HaatBussID: number;
    logoURL: string;
    fullName: string;
    ticketType: string;
    priorityLevel: string;
    customStatus: string;
    departmentName: string;
}





export interface ToastProps {
    key: number;
    variant: 'success' | 'destructive';
    title: string;
    description: string;
}


export interface TaskDescriptionItem {
    label: string;
    value: ReactNode;
}




// Stattistics page types


export interface TopEmployeeData {
    fullName: string;
    freeNumberData: number;
}
export interface TopEmployeeDataTotal {
    fullName: string;
    freeTextData: string;
}

export interface TopBusinessData {
    marketName: string;
    freeTextData: string;
}
export interface TopBusinessDataTime {
    marketName: string;
    freeNumberData: number;
}

export interface EmployeeTaskCount {
    fullName: string;
    freeNumberData: number;
}

export interface BusinessTaskCount {
    marketName: string;
    freeNumberData: number;
}

export interface TimeInMinutesBusiness {
    marketName: string;
    freeNumberData: number;
}
export interface TimeInMinutesEmployee {
    fullName: string;
    freeNumberData: number;
}


export interface TaskCountEmployeeItem {
    fullName: string;
    freeNumberData: number;
}
export interface TaskCountBussItem {
    marketName: string;
    freeNumberData: number;
}
export interface TimeInMinutesBussItem {
    marketName: string;
    freeNumberData: number;
}

export interface StatsData {
    averageTaskTimeInMinutes: EmployeeTaskCount[];
    taskCountBuss: BusinessTaskCount[];
    taskCountEmployee: EmployeeTaskCount[];
    timeInMinutesBuss: TimeInMinutesBusiness[];

    timeInMinutesEmployee: TimeInMinutesEmployee[];


    // or an appropriate type if you have a separate interface
    topBusinessTasksAdded: TopBusinessData;
    topBusinessTimeWorked: TopBusinessDataTime;

    topEmployeeAvgTaskTime: TopEmployeeData;
    topEmployeeTotalTaskTime: TopEmployeeDataTotal;

}



// Real time data types



export interface RealTimeDashboardData {
    notAssignedTicketsNum: number;
    notWorkingUsersArr: any[];    // Replace `any[]` with a more specific type if you know the shape
    uncompletedTicketsNum: number;
    workingUsersArr: any[];       // Same note as above
    tasksInProgress: any[];
    employeesAndBusinesses: any[];
    activeBusinesses: any[];
    userLogs: any[];
    businessLogs: any[];






}

export interface RealTimeDashboardResponse {
    data: RealTimeDashboardData;
    status: number;
}


export interface UpdateProducData {
    customStatus: {
        customStatusID: number,
    }

}

