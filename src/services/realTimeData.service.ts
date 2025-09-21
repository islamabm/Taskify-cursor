// realTimeData.service.ts
import { RealTimeDashboardData, RealTimeDashboardResponse } from "../types/commonTypes/commonTypes";
import { postRequest } from "./https-axios.service";


const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}users/getDashboard`;

export const realTimeDataService = {
    getDashboardData,
};

async function getDashboardData(): Promise<RealTimeDashboardResponse> {
    const response = await postRequest<RealTimeDashboardData>(SUBDOMAIN, {});
    return response; // matches { data: RealTimeDashboardData, status: number }

}
