import axios from 'axios';

const SUBDOMAIN = `${process.env.REACT_APP_NEST_API_URL}file-upload/upload`;

// Specialized POST request function for file uploads
async function postFile(url: string, formData: FormData) {
    const token = localStorage.getItem('TOKEN_TASKIFY')?.replace(/^"|"$/g, '') || '';
    try {


        const response = await axios.post(url, formData, {

            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Return the response data directly
    } catch (error) {
        console.error('Upload error:', error);
        throw error; // Rethrow to handle errors where the upload function is called
    }
}

export const uploadService = {
    async uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return await postFile(SUBDOMAIN, formData);
    }
};
