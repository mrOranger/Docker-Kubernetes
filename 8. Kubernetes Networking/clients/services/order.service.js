const {
    ORDERS_SERVICE_HOST = 'orders-application-service.default'
} = process.env;

export async function DELETE_CLIENT_ORDERS (taxCode) {
    const response = await fetch(`http://${ORDERS_SERVICE_HOST}/order/client/${taxCode}`, {
        method: 'DELETE'
    });
    return await response.json(); 
}
