const sendRequest = async (url, method = 'GET', data = null) => {
    try {
        console.log('URL:', url);
        console.log('Method:', method);
        console.log('Data:', data);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            console.error('Request failed with status:', response.status);
            return null;
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error sending request:', error);
        return null;
    }
};

export default sendRequest;
