const bcrypt = require('bcrypt')

async function main() {
    const password = '123'
    const hash = await bcrypt.hash(password, 10)
    const match = await bcrypt.compare(password, hash)

    console.log(hash)
    console.log(match)
}

main()