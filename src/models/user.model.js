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
        where: { user_name: data.username }
    })

    if (findEmail) return { status: true, message: 'Este email já está cadastrado' }
    if (findUsername) return { status: true, message: 'Este nome de usuário já está cadastrado' } 

    return { status: false, message: 'Usuário não está cadastrado' }
}

export default class UserModel {
    static async create({email, username, password, path}) {

        console.log('path', path)
        
        const dataExists = await thisDataExists({email, username})
        if (dataExists.status)
            return dataExists.message
        
        if (validateData([email, username, password])) {
            const passwordHash = bcrypt.hashSync(password)
            const newUser = await database.models.Users.create({email, user_name: username, password_hash: passwordHash})
            const userId = await newUser.toJSON().user_id
            await database.models.Photos.create({user_id: userId, photo_path: path})
            return { success: true, message: 'User created successfully. Please enter your credentials to continue', newId: newUser.toJSON().user_id}
        }

        return { success: false, message: 'The data has an error. Please try again' }
    }

    static async update({user_id, email, username, newPassword, file_path}) {
        if (newPassword) {
            if (validateData([email, username, newPassword])) {
                const passwordHash = bcrypt.hashSync(newPassword)

                await database.models.Users.update({
                    email: email,
                    user_name: username,
                    password_hash: passwordHash    
                }, { user_id: user_id })

                return { message: 'The credentials has changed with succesfully.', status: true }
            }

            return { message: 'The data has an error. Please try again.', status: false }
        }

        if (validateData([email, username, 'valid'])) {

            await database.models.Users.update({
                email: email,
                user_name: username
            }, { user_id: user_id })

            return { message: 'The credentials has changed with succesfully.', status: true }
        }

        if (file_path) {
            await database.models.Photos.update({
                where: { user_id: user_id }
            }, { photo_path: file_path })
        }

        return { message: 'The data has an error. Please try again.', status: false }
    }

    static async getUser({user_id}) {

        const user = await database.models.Users.findOne({
            where: {user_id: user_id}
        })

        return await user.toJSON()
    }

    static async destroyUser({user_id}) {
        try {
            await database.models.Admins.destroy({where: {user_id: user_id}})
            await database.models.Users.destroy({where: {user_id: user_id}})
            await database.models.Authorized.destroy({where: {user_id: user_id}})
    
            return {message: 'The user was deleted with successfully', status: true }
        } catch (err) {
            return { message: 'An error occurred. Please try again.', status: false }
        }
        
    }

    static async findUser({username}) {
        const user = await database.models.Users.findOne({
            where: {user_name: username}
        })

        return await user.toJSON()
    }
}