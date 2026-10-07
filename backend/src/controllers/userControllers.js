import { User } from "../models/userModel.js"
import httpStatus from "http-status"
import bcrypt from "bcrypt";
import crypto from "crypto"


const login = async (req, res) => {

    const { username, password } = req.body;
    // console.log(password)
    if (!username || !password)
        return res.status(400).json({ message: "please Provide Credencials" })
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "No User Found" })
        }
        const isPassCorrect = await bcrypt.compare(password, user.password)
        if (isPassCorrect) {
            let token = crypto.randomBytes(20).toString("hex")
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Credentials" });
        }
    }
    catch (e) {
        return res.status(500).json({ message: "something went wrong" })
    }
}


const register = async (req, res) => {
    const { name, username, password } = req.body
    try {
        const exitingUser = await User.findOne({ username });
        if (exitingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exits" })
        }
        const hashPass = bcrypt.hashSync(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashPass
        })
        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "USSER REGISTRED" })
    }
    catch (e) {
        res.json({ message: `something went wrong${e}` })
    }
}


export { login, register }