const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não enviado' })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato do token inválido' })
    }

    const token = parts[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = payload
        return next()
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' })
    }
}

module.exports = authMiddleware
