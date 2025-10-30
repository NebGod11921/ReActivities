import axios from "axios";
import {store} from "../stores/store.ts";
import {toast} from "react-toastify";
import {router} from "../../app/router/Routes.tsx";


const sleep = (delay: number) => {
    return new Promise(resolve => setTimeout(resolve, delay));
}
//env
const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
//Interceptors allow you to run code before a request is sent or after a response is received.

agent.interceptors.request.use(config => {
    store.uiStore.isBusy();
    return config;
})
    // try {
    //     await sleep(1000);
    //
    //     return response;
    //
    // }catch (error) {
    //     console.log('axios error:' + error);
    //     return Promise.reject(error);
    // } finally {
    //     store.uiStore.isIdle();
    // }

    agent.interceptors.response.use(async response => {
            await sleep(1000);
            store.uiStore.isIdle();
            return response;
        },
        async error => {
            await sleep(1000);
            store.uiStore.isIdle();

            const {status, data} = error.response;
            switch (status) {
                case 400:
                    if(data.errors) {
                        const modalStateErrors = [];
                        for (const key of data.errors) {
                            if(data.errors[key]) {
                                modalStateErrors.push(data.errors[key]);
                            }
                        }
                        throw modalStateErrors.flat();
                    } else {
                        toast.error(data);
                    }
                    break;
                case 401:
                    toast.error('Unauthorized');
                    break;
                case 404:
                    await router.navigate('/not-found');
                    break;
                case 500:
                    await router.navigate('/server-error', data);
                    toast.error('Server Error');
                    break;
                default:
                    break;
            }

            return Promise.reject(error);
        }
    )


export default agent;