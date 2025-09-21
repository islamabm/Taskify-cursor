import { UpdateProducData } from "../types/commonTypes/commonTypes";
import { getRequest, putRequest } from "./https-axios.service";

export const productsService = {

    getProductsByTicketID,
    updateProduct


}

const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}products`



async function getProductsByTicketID(ticketID: number) {
    const products = await getRequest(`${SUBDOMAIN}/getProductsByTicketID/${ticketID}`)
    return products;
}

async function updateProduct(productID: number, productData: UpdateProducData) {
    const updatedProduct = await putRequest(`${SUBDOMAIN}/${productID}`, productData)
    return updatedProduct;
}

