import $host from "../http/http";

export class ClientService{
    static async get(){
        const result = await $host.get('/')
        console.log(result.data)
    }

    static async process(){
        try {
           const k ={
                'name':'alesya'
            }
            const result = await $host.post('/processing')
            console.log(result.data);
            return result.data;
        } catch (error) {
            console.log('[Service] processing error', error);

            throw error;
        }
    }
}