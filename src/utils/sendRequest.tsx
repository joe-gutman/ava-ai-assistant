import { json } from "stream/consumers";

const sendRequest = async (url, method = 'GET', data = null) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? json.stringify(data) : null
        });

        if(!response.ok) {
            console.error('Request failed with status:', response.status)
        }

        return await response.json();
    } catch (error) {
       console.error('Error sending request:', error);
       return null; 
    }    
};

export { sendRequest };