import { UnauthorizedError } from "../../utils/errors/unauthorizedError.js"
import { UserModel } from "../user/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthService {
  #userModel;
  constructor(userModel){
    this.#userModel = userModel
  }
  async login (emails, password) {
    let findUser = await this.#userModel.findByEmail(emails)

    if (!findUser || findUser.length === 0) {
       throw new UnauthorizedError("Email Atau Password Salah.")
    }

    const userData = findUser[0]
    console.log("Dari Auth Serive : ")
    console.log(userData)
    const encryptedPassword = userData.password

    let isMatch = await bcrypt.compare(password, encryptedPassword)

    if (!isMatch) {
      throw new UnauthorizedError("Email Atau Password Salah.")
    }

    let {id, name, username, email, avatar, role } = userData

    let token = jwt.sign({ id, email, role }, process.env.JWT_SECRET)

    return {
      success:true,
      message:"Login Berhasil",
      token,
      data:{
        id:userData.id,
        name:userData.name,
        username:userData.username,
        email:userData.email,
        avatar:userData.avatar,
        role:userData.role
      }
    } 
  }
}