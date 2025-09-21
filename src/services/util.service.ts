import { StatsData } from "../types/commonTypes/commonTypes";



export const utilService = {
    appendQueryParams,
    getData,
    updateDocumentTitle,
    getIpAddress,
    getLocalStorageValue,
    formatDuration,
    createSpecialStatsArray,
    getUserTypeID,
    getUserID,
    getUserName





}


function formatDuration(minutes: number) {
    if (minutes < 60) {
        return `${minutes}m`;
    } else {
        let time = minutes;
        const minutesInYear = 525600; // 365 days * 24 hours * 60 minutes
        const minutesInMonth = 43800; // 30 days * 24 hours * 60 minutes
        const minutesInDay = 1440; // 24 hours * 60 minutes
        const minutesInHour = 60;

        const years = Math.floor(time / minutesInYear);
        time %= minutesInYear;

        const months = Math.floor(time / minutesInMonth);
        time %= minutesInMonth;

        const days = Math.floor(time / minutesInDay);
        time %= minutesInDay;

        const hours = Math.floor(time / minutesInHour);
        time %= minutesInHour;

        const result = [];
        if (years > 0) result.push(`${years}y`);
        if (months > 0) result.push(`${months}mo`);
        if (days > 0) result.push(`${days}d`);
        if (hours > 0) result.push(`${hours}h`);
        if (time > 0) result.push(`${time}m`);

        return result.join(' ');
    }
}



function appendQueryParams(url: string, params: Record<string, any>): URL {
    const apiUrl = new URL(url);
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
            apiUrl.searchParams.append(key, params[key]);
        }
    }
    return apiUrl;
}

async function getData(response: Response): Promise<any> {
    let responseData = await response.text();
    if (responseData.charCodeAt(0) === 0xfeff) {
        responseData = responseData.substr(1);
    }
    const trimmedData = responseData.trim();
    const json = JSON.parse(trimmedData);
    return json;
}



function getUserTypeID() {
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY') || '';
    return userTypeID.replace(/^"|"$/g, ''); // This regex replaces quotes at the start and end of the string
}
function getUserID() {
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY') || '';
    return userTypeID.replace(/^"|"$/g, ''); // This regex replaces quotes at the start and end of the string
}

function getUserName() {
    const username = localStorage.getItem('fullName_TASKIFY') || '';
    return username.replace(/^"|"$/g, ''); // This regex replaces quotes at the start and end of the string
}

function updateDocumentTitle(location: Location) {
    const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);
    const routeName = location.pathname.substring(1).replace(/-/g, ' ');
    const title = routeName.split('/').map(capitalize).join(' | ');
    document.title = `Taskify | ${title ? `${title}` : 'Login'}`;
}



async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org/?format=json');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data.ip;
    } catch (error) {
        console.error('There was a problem fetching the IP address:', error);
    }
}

function getLocalStorageValue(key: string) {
    const value = localStorage.getItem(key);
    return value ? value.replace(/^"|"$/g, '') : 'Unknown';
};



function createSpecialStatsArray(statsData: StatsData) {
    return [
        {
            headerData: 'Top employee (avg. task time)',
            pOneData: statsData.topEmployeeAvgTaskTime.fullName,
            pTwoData: `Avg ⏱ ${statsData.topEmployeeAvgTaskTime.freeNumberData} min`,
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
            icon: "trophy"

        },
        {
            headerData: 'Top employee (total task time)',
            pOneData: statsData.topEmployeeTotalTaskTime.fullName,
            pTwoData: `Total ⏱ ${statsData.topEmployeeTotalTaskTime.freeTextData} `,
            gradient: 'bg-gradient-to-br from-green-500 to-green-600',
            icon: "clock"


        },
        {
            headerData: 'Top business (tasks added)',
            pOneData: statsData.topBusinessTasksAdded.marketName,
            pTwoData: `Tasks 📊 ${statsData.topBusinessTasksAdded.freeTextData}`,
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
            icon: "list"


        },
        {
            headerData: 'Top business (time worked)',
            pOneData: statsData.topBusinessTimeWorked.marketName,
            pTwoData: `Time ⏱ ${statsData.topBusinessTimeWorked.freeNumberData} min`,
            gradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
            icon: "timer"


        },

    ];
}


// utils/landingPageData.ts


