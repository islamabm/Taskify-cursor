import { utilService } from "./util.service";


export const httpsService = {
    fetchData
}


async function fetchData(apiUrl: string, queryParams: Record<string, any> = {}): Promise<any> {


    const urlWithParams = utilService.appendQueryParams(apiUrl, queryParams);

    try {
        const response = await fetch(urlWithParams, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const parsedData = await utilService.getData(response);
        return parsedData;
    } catch (error) {
        console.error("error", error);
        throw error;
    }
}