import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:9080/users";

class UserService {
    getUsers() {
        return axios.get(USER_API_BASE_URL);
    }

    createUser(user) {
        // Validasi data di sini jika diperlukan
        return axios.post(USER_API_BASE_URL, user)
            .catch((error) => {
                throw error; // Tambahkan penanganan kesalahan di sini
            });
    }

    getUserById(userId) {
        return axios.get(USER_API_BASE_URL + '/' + userId)
            .catch((error) => {
                throw error; // Tambahkan penanganan kesalahan di sini
            });
    }

    updateUser(user, userId) {
        // Validasi data di sini jika diperlukan
        return axios.put(USER_API_BASE_URL + '/' + userId, user)
            .catch((error) => {
                throw error; // Tambahkan penanganan kesalahan di sini
            });
    }

    deleteUser(userId) {
        return axios.delete(USER_API_BASE_URL + '/' + userId)
            .catch((error) => {
                throw error; // Tambahkan penanganan kesalahan di sini
            });
    }
}

const instance = new UserService(); // Buat instance dari kelas UserService

export default instance; // Ekspor instance dengan nama modul default

