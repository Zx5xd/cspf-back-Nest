// import {urlProp} from "../components/forum/PropInterface";

export const fetchUrl = async (url: string): Promise<string> => {

    const jsonURL = {
        "url" : url
    }

    try{
        const response = await fetch("http://localhost:3500/scrip/news", {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(jsonURL),
        });
        if(!response.ok){
            throw new Error(response.statusText);
        }
        const data = await response.text();
        return data;
    }catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchData = async (url: string) => {
    try {
        console.log(`fetching data from ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
    }
};

export const parseJSON = (data: any) => {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        throw error;
    }
};
