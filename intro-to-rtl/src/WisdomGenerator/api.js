import messages from './messages';

export const doFetch = () => (new Promise((resolve) => {
    setTimeout(() => {
        resolve([...messages]);
    }, 2000);
}));