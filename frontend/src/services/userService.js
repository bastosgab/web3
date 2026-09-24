import api from './api'

export const loginUser = async (email, pass) => {
    const response = await api.post('/users/login', { email, pass })
    const { token, user } = response.data.data

    if (token) {
        localStorage.setItem('token', token)
    }

    return { token, user }
}

export const getUsers = async () => {
    const response = await api.get('/users')
    return response.data
}

export const getUser = async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
}

export const createUser = async (data) => {
    const response = await api.post('/users', data)
    return response.data
}

export const updateUser = async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
}

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
}