const {
    PRODUCTS_SERVICE_HOST = 'products_service'
} = process.env;

export async function DELETE_PRODUCT (code) {
    const response = await fetch(`http://${PRODUCTS_SERVICE_HOST}/product/${code}`, {
        method: 'DELETE'
    });
    return await response.json(); 
}

export async function GET_PRODUCT (code) {
    const response = await fetch(`http://${PRODUCTS_SERVICE_HOST}/product/${code}`);
    return await response.json(); 
}
