const userService = require('../services/userService')

const searchUser = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json({ data: users })
    }

    catch (err) {
        res.status(500).json({ error: 'Erro interno ao buscar usuários' })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

        res.status(200).json({ data: user })
    } catch (err) {
        res.status(500).json({ error: 'Erro interno ao buscar usuário' })
    }
}

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body)
        res.status(201).json({ data: user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'E-mail já cadastrado' })
        }
        res.status(400).json({ error: 'Não foi possível criar o usuário' })
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body)
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

        res.status(200).json({ data: user })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'E-mail já cadastrado' })
        }
        res.status(400).json({ error: 'Não foi possível editar o usuário' })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id)
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })

        res.status(204).send()
    } catch (err) {
        res.status(500).json({ error: 'Não foi possível excluir o usuário' })
    }
}

module.exports = { searchUser, getUser, createUser, updateUser, deleteUser }