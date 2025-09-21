import { StatsData } from "../types/commonTypes/commonTypes";
import { postRequest } from "./https-axios.service";

export const statisticsService = {
    getStatisticsData,
};

const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}workLogs/statistics`;

async function getStatisticsData(datesData: any): Promise<StatsData> {
    const response = await postRequest<StatsData>(SUBDOMAIN, datesData);
    return response.data;
}
