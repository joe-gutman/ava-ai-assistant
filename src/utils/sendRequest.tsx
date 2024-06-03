import fetch from 'cross-fetch';

const sendRequest = async ({ url, method, headers, body, audioPlayer }) => {
    try {
        if (body && typeof body === 'object') {
            body = JSON.stringify(body);
        }
        console.log(body);
        console.log(headers);

        const response = await fetch(url, {
            method: method,
            headers: headers, 
            body: body
        });

        if (!response.ok) {
            console.error('Request failed with status:', response.status);
            return null;
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && contentType.includes('audio/mpeg')) {
            const reader = response.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                audioPlayer(value);
            }
        } else {
            console.error('Unsupported content type:', contentType);
            return null;
        }
    } catch (error) {
        console.error('Error sending request:', error);
        return null;
    }
};

export default sendRequest;
