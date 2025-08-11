const {
    CLIENTS_SERVICE_HOST = 'clients_service'
} = process.env;

export async function FIND_CLIENT (taxCode) {
    const response = await fetch(`http://${CLIENTS_SERVICE_HOST}/client/${taxCode}`);
    return await response.json(); 
}
