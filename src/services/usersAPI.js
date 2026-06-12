import axios from 'axios';

// Ganti URL dan API_KEY dengan milik project Supabase-mu
const API_URL = "https://nrhdsormwvapwjrhjfcb.supabase.co/rest/v1/users";
const API_KEY = "sb_publishable_t1YlxWCGxBoY7YL95yrc1w_pIEZgGaf";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const usersAPI = {
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers });
        return response.data;
    },

    async registerUser(userData) {
        const response = await axios.post(API_URL, userData, { headers });
        return response.data;
    },

    async loginUser(email, password) {
        // Cek kecocokan email dan password
        const response = await axios.get(
            `${API_URL}?email=eq.${email}&password=eq.${password}`, 
            { headers }
        );
        return response.data; 
    },

    async deleteUser(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    async updateUser(id, updatedData) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, updatedData, { headers });
        return response.data;
    }
};