const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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

const login = async (email, password) => {
    const user = await User.scope('withPassword').findOne({
        where: { email }
    })

    if (!user) return null

    const validPassword = await bcrypt.compare(password, user.pass)
    if (!validPassword) return null

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    return {
        token,
        user: withoutPassword(user)
    }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, login }