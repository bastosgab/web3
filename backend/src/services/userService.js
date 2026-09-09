const User = require('../models/User')  

const withoutPassword = (user) => {
    const data = user.toJSON()
    delete data.pass
    return data
}

const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: { exclude: ['pass'] },
        order: [['id', 'ASC']],
    })
    return users
}

const getUserById = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['pass'] },
    })
}

const createUser = async (data) => {
    const user = await User.create(data)
    return withoutPassword(user)
}

const updateUser = async (id, data) => {
    const user = await User.findByPk(id)
    if (!user) return null

    await user.update(data)
    return withoutPassword(user)
}

const deleteUser = async (id) => {
    const user = await User.findByPk(id)
    if (!user) return null

    await user.destroy()
    return withoutPassword(user)
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser }