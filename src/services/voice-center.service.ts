import { ApiServiceResponse, Department } from "../types/commonTypes/commonTypes";
import { getRequest } from "./https-axios.service";
import { resturantLoginService } from "./resturant-login.service";
import { storageService } from "./storage.service";

export const voiceCenterService = {
    getBusinessesData,
};



const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL_RESTURANT_SWAGGER}voice-center/cdr`





async function getBusinessesData(): Promise<ApiServiceResponse<Department[]>> {

    // This is just an example of how you can use the login service to get the token.

    const authenticationRes = await resturantLoginService.checkLogin({ pwdHash: '0549211188', phone1: 'hohohoho123' });
    // console.log(authenticationRes.data.access_token);
    storageService.store('TOKEN_RESTURANT', authenticationRes.data.access_token);
    storageService.store('TOKEN_RESTURANT', authenticationRes.data.access_token, true);

    // Implement logic to fetch and return the businesses data from the REST API.
    const businessesData = await getRequest<Department[]>(SUBDOMAIN);
    return businessesData;
}
