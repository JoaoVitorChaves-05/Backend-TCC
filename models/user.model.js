import database from "../database/database.js"
import bcrypt from "bcryptjs"

const validateData = (data) => {
    if (data[0].trim().length == 0) return false
    if (data[1].trim().length == 0) return false
    if (data[2].length == 0) return false
    return true
}

const thisDataExists = async (data) => {
    const findEmail = await database.models.Users.findOne({
        where: { email: data.email }
    })

    const findUsername = await database.models.Users.findOne({
        where: { username: data.username }
    })

    if (findEmail) return { status: true, message: 'Este email já está cadastrado' }
    if (findUsername) return { status: true, message: 'Este nome de usuário já está cadastrado' } 
}

export default class UserModel {
    static async create({email, username, password}) {
        
        const dataExists = thisDataExists({email, username})
        if (dataExists.status)
            return dataExists.message
        
        if (validateData([email, username, password])) {
            const passwordHash = bcrypt.hashSync(password)
            await database.models.create({email, user_name: username, password: passwordHash})
            return { message: 'User created successfully. Please enter your credentials to continue' }
        }

        return { message: 'The data has an error. Please try again' }
    }

    static async update({user_id, email, username, newPassword}) {
        if (newPassword) {
            if (validateData([email, username, newPassword])) {
                const passwordHash = bcrypt.hashSync(newPassword)

                await database.models.Users.update({
                    email: email,
                    user_name: username,
                    password_hash: passwordHash    
                }, { user_id: user_id })

                return { message: 'The credentials has changed with succesfully.' }
            }

            return { message: 'The data has an error. Please try again.' }
        }

        if (validateData([email, username, 'valid'])) {

            await database.models.Users.update({
                email: email,
                user_name: username
            }, { user_id: user_id })

            return { message: 'The credentials has changed with succesfully.' }
        }

        return { message: 'The data has an error. Please try again.' }
    }
}