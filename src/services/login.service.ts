import { LoginData, LoginResponse } from "../types/commonTypes/commonTypes";
import { postRequest } from "./https-axios.service";
const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}auth/login`
// const SUBDOMAIN = `http://localhost:4407/auth/login`

export const loginService = {
  checkLogin
}




async function checkLogin(loginData: { pwdHash: string, phone1: string }) {
  const authenticationRes = await postRequest<LoginResponse>(SUBDOMAIN, loginData)
  console.log("authenticationRes", authenticationRes)
  return authenticationRes;
}
