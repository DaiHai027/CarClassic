import axios from "./apiClient.js"

export const graphQlRequest = (query, variables) => {
    return axios.post('/graphql', {
        query,
        variables
    });
}

export const postRequest = (url, payload) => {
    return axios.post(url, payload)
}

export const getRequest = (url) => {
    return axios.get(url);
}

export const graphQlRequestFetch = async (query, variables) => {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers you need, like authorization tokens
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });


        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();


        if (result.errors) {
            const errorMessages = result.errors.map(error => error.message).join(', ');
            throw new Error(`GraphQL errors: ${errorMessages}`);
        }

        return result;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
};
