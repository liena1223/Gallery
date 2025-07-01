import { API_URL, UNSPLASH_ACCESS_KEY, PER_PAGE } from '../constants.js';

export async function fetchImages(query, page = 1) {
    const response = await fetch(
        `${API_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=${PER_PAGE}&orientation=squarish`,
        {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        }
    );

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    if (!data?.results) throw new Error('Incorrect response from API');

    return data.results;
}
