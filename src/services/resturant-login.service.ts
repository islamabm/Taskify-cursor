import { LoginResponse } from "../types/commonTypes/commonTypes";
import { postRequest } from "./https-axios.service";
const SUBDOMAIN = `https://haat-insert-prod-rest.ms.lan-wan.net/auth/login`

export const resturantLoginService = {
    checkLogin
}



// There is no need to send the phone number and the password to the server. I use this only to get token from the server


async function checkLogin(loginData: { pwdHash: string, phone1: string }) {
    console.log("SUBDOMAIN", SUBDOMAIN)
    const authenticationRes = await postRequest<LoginResponse>(SUBDOMAIN, loginData)
    console.log("hiiiiiiiiiiiiiii")
    return authenticationRes;
}
