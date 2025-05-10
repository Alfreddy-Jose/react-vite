import Api from "./Api"

export const login = async (credentials) => {
    return await Api.post('/login', credentials);
}

export const getUser = async () => {
    return await Api.get('/user');
}

export const logout = async () => {
    return await Api.post('/logout');
}