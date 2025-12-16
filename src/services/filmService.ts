import axios from "axios";

const API_URL = "https://api-class-o1lo.onrender.com/api/khanhphuong"
export interface fimlsType {
    email: string;
    password: string;
}
export const registerFilms = async (data: { email: string; password: string }) => {
    try {
        const res = await axios.post(`${API_URL}/auth/register`, data);
        return res.data;
    } catch (error: any) {
        throw error.response?.data || { message: error.message };
    }
}

export const loginUser = async (data: fimlsType) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, data);
        // backend phải trả về { token, user: {email, ...} }
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || { message: error.message };
        } else if (error instanceof Error) {
            throw { message: error.message };
        } else {
            throw { message: "Something went wrong" };
        }
    }
};