import axios from "axios";

const sleep = (delay:number) =>{
    return new Promise(resolve => setTimeout(resolve, delay));
}
//env
const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
//Interceptors allow you to run code before a request is sent or after a response is received.

agent.interceptors.response.use(async (response) => {
    try {
        await sleep(1000);
        return response;

    }catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
})

export default agent;