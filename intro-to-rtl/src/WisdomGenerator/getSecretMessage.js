import { doFetch } from './api';

const MAX_RESULTS = 5;
let messages = [];

const getSecretMessage = async () => {
    if (!messages.length) {
        messages = await doFetch();
        messages = messages.sort(() => 0.5 - Math.random()).slice(0, MAX_RESULTS);
    }
    
    return messages.shift();
};

export default getSecretMessage;