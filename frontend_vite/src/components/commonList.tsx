import { useEffect, useState } from 'react';
import { fetchData, parseJSON } from '../util/fetchData';

interface CommonListProps<T> {
    types: string;
    dataMapper: (data: any) => T[];
    render: (items: T[]) => JSX.Element;
}

export const CommonList = <T,>({ types, dataMapper, render }: CommonListProps<T>) => {


    const [items, setItems] = useState<T[]>([]);
    const host = 'http://localhost:3500/';

    let url : string;
    let query : string | null;

    if(types !== 'aniInfo'){
        const queryString = window.location.search;
        const urlParam = new URLSearchParams(queryString);
        query = urlParam.get('query');
        url = host+types+`?query=`+query;
    } else{
         query = "null";
         url = host+types;
    }


    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const data = await fetchData(url);
                let mappedItems:any;
                if(types !== 'aniInfo'){
                    const parsedData = parseJSON(data);
                    console.log(`parsedData: ${JSON.stringify(parsedData)}`);
                    mappedItems = dataMapper(parsedData);
                } else {
                    console.log(`aniInfo Data : ${JSON.stringify(data.body)}`);
                    mappedItems = dataMapper(JSON.stringify(data.body));
                }
                setItems(mappedItems);
            } catch (error) {
                console.error('Error processing data:', error);
            }
        };

        fetchDataAsync();
    }, [url, query, dataMapper]);

    return render(items);
};
