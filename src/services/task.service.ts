
import { AddTaskData, EditTaskData, Product, Task } from "../types/commonTypes/commonTypes";
import { deleteRequest, getRequest, postRequest, putRequest } from "./https-axios.service";
export const tasksService = {
    getTasks,
    insertTask,
    deleteTask,
    editTask,
    getTaskByID,
    calculateStats,
    searchTasks,
    searchTasksByType,
    calculateCampaignsStats

}





const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}tickets`
// const SUBDOMAIN = `http://localhost:4252/tickets`




async function getTasks() {
    const tasks = await getRequest(SUBDOMAIN)
    return tasks;
}

async function insertTask(taskData: AddTaskData) {
    const taskID = await postRequest(SUBDOMAIN, taskData)
    return taskID;
}
async function editTask(taskData: EditTaskData, ticketID: number) {
    const editTaskResponse = await putRequest(`${SUBDOMAIN}/${ticketID}`, taskData)
    return editTaskResponse;
}
async function deleteTask(ticketID: number) {
    const deleteTaskResponse = await deleteRequest(`${SUBDOMAIN}/${ticketID}`)
    return deleteTaskResponse;
}
async function getTaskByID(ticketID: number) {
    const ticket = await getRequest(`${SUBDOMAIN}/${ticketID}`)
    return ticket;
}
async function searchTasks(marketID: number) {
    const tasks = await getRequest(`${SUBDOMAIN}/searchByMarket/${marketID}`)
    return tasks;
}
async function searchTasksByType(ticketTypeID: number) {
    const tasks = await getRequest(`${SUBDOMAIN}/searchByType/${ticketTypeID}`)
    return tasks;
}


function calculateStats(tasks: Task[]) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const stats = {
        totalTasks: tasks.filter((task) => task.market !== null).length,
        // totalQuantity: tasks.reduce((sum, task) => sum + (task.quantity || 0), 0),
        stuckProducts: tasks.reduce((sum, task) => sum + (task.problemsProducts?.length || 0), 0),
        completedProducts: tasks.reduce(
            (sum, task) => sum + (task.products?.filter((product: Product) => product?.customStatus?.customStatusID === 16).length || 0),
            0
        ),
        totalQuantity: tasks.reduce(
            (sum, task) =>
                sum +
                (task.problemsProducts?.length || 0) +
                (task.products?.filter(
                    (p: Product) => p?.customStatus?.customStatusID === 16
                ).length || 0),
            0
        ),
        notStarted: tasks.filter((task) => task.customStatus.customStatusID === 8 && task.market !== null).length,
        inProgress: tasks.filter((task) => task.customStatus.customStatusID === 9 && task.market !== null).length,
        paused: tasks.filter((task) => task.customStatus.customStatusID === 11 && task.market !== null).length,
        completed: tasks.filter((task) => task.customStatus.customStatusID === 10 && task.market !== null).length,
    };


    return [
        { title: "TODAY'S DATE", number: today, titleBackgroundColor: "#e06666" },
        { title: "Total Product", number: stats.totalQuantity, titleBackgroundColor: "#9fc5e8" },
        { title: "Stuck products", number: stats.stuckProducts, titleBackgroundColor: "#e06666" },
        { title: "Completed products", number: stats.completedProducts, titleBackgroundColor: "#b6d7a8" },
        { title: "NOT STARTED", number: stats.notStarted, titleBackgroundColor: "#e06666" },
        { title: "TOTAL TASKS", number: stats.totalTasks, titleBackgroundColor: "#000000" },
        { title: "IN PROGRESS", number: stats.inProgress, titleBackgroundColor: "#ffe599" },
        { title: "PAUSED", number: stats.paused, titleBackgroundColor: "#e6cff2" },
        { title: "COMPLETED", number: stats.completed, titleBackgroundColor: "#b6d7a8" },
        // { title: "Chart", number: "Chart", titleBackgroundColor: "rgba(255, 99, 132, 1)" },

    ];
}


function calculateCampaignsStats(tasks: Task[]) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const stats = {
        totalTasks: tasks.filter((task) => task.market !== null).length,
        // totalQuantity: tasks.reduce((sum, task) => sum + (task.quantity || 0), 0),
        // stuckProducts: tasks.reduce((sum, task) => sum + (task.problemsProducts?.length || 0), 0),
        // completedProducts: tasks.reduce(
        //     (sum, task) => sum + (task.products?.filter((product: Product) => product?.customStatus?.customStatusID === 16).length || 0),
        //     0
        // ),
        // totalQuantity: tasks.reduce(
        //     (sum, task) =>
        //         sum +
        //         (task.problemsProducts?.length || 0) +
        //         (task.products?.filter(
        //             (p: Product) => p?.customStatus?.customStatusID === 16
        //         ).length || 0),
        //     0
        // ),
        notStarted: tasks.filter((task) => task.customStatus.customStatusID === 8 && task.market !== null).length,
        inProgress: tasks.filter((task) => task.customStatus.customStatusID === 9 && task.market !== null).length,
        paused: tasks.filter((task) => task.customStatus.customStatusID === 11 && task.market !== null).length,
        completed: tasks.filter((task) => task.customStatus.customStatusID === 10 && task.market !== null).length,
    };


    return [
        { title: "TODAY'S DATE", number: today, titleBackgroundColor: "#e06666" },
        // { title: "Total Product", number: stats.totalQuantity, titleBackgroundColor: "#9fc5e8" },
        // { title: "Stuck products", number: stats.stuckProducts, titleBackgroundColor: "#e06666" },
        // { title: "Completed products", number: stats.completedProducts, titleBackgroundColor: "#b6d7a8" },
        { title: "NOT STARTED", number: stats.notStarted, titleBackgroundColor: "#e06666" },
        { title: "TOTAL TASKS", number: stats.totalTasks, titleBackgroundColor: "#000000" },
        { title: "IN PROGRESS", number: stats.inProgress, titleBackgroundColor: "#ffe599" },
        { title: "PAUSED", number: stats.paused, titleBackgroundColor: "#e6cff2" },
        { title: "COMPLETED", number: stats.completed, titleBackgroundColor: "#b6d7a8" },
        // { title: "Chart", number: "Chart", titleBackgroundColor: "rgba(255, 99, 132, 1)" },

    ];
}
