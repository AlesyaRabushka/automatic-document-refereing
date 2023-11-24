import $host from "../http/http";

export class ClientService{
    static async upload(file:File){
        try {
            const fd = new FormData();
            fd.append('file', file);
            console.log('file', fd)
            const result = await $host.post('/upload', fd);
            console.log(result.data);

            return result.data;
        } catch (error) {
            console.log('[ClientService]: error', error);

            throw error;
        }
    }

    static async process(file: File){
        try {
            let fd = new FormData();
            fd.append('file', file)
            
            // {headers:{
            //     "Content-Type":"multipart/form-data"
            // }}

            const result = await $host.post('/processing', fd)
            console.log(result.data);
            return result.data;
        } catch (error) {
            console.log('[Service] processing error', error);

            throw error;
        }
    }
}