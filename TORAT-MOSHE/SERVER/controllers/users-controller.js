const db = require('../models/index');
const bcrypt = require('bcrypt')
const mailer = require('../services/mail');
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');

const User = db.users;
const Comment = db.comments;
const Peirush = db.peirushim;
const Correction = db.corrections;



function sendEmailToUserf(to, subject, body) {
    mailer.sendEmail(to, subject, body)
        .then(info => {
            console.log('Email sent: ', info.response);
        })
        .catch(error => {
            console.log('Error sending email: ', error);
        });
}

class UsersController {
    getAllUsers = async (req, res) => {
        const obj = await User.findAll({ attributes: { exclude: ['password'] } });
        if (obj)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }
///////////////////////////////////////////////////////TranscptionManager
    getUserById= async (req, res) => {
        if (!req.params.id)
            return res.status(400).json({ message: '😊😊😊😊All fields are required' })
        const foundUser = await User.findOne({ where: { id: req.params.id }, attributes:{ exclude: ['password'] } });
        if (foundUser) {
            const userInfo = { id: foundUser.id, first_name: foundUser.first_name, last_name: foundUser.last_name }
            const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
            return res.status(201).json({ accessToken: {accessToken,foundUser} })
        }            
        return res.status(404).json({ message: 'משתמש לא קיים' })
    }
/////////////////////////////////////
    logIn = async (req, res) => {
        if (!req.params.email || !req.params.password)
            return res.status(400).json({ message: '😊😊😊😊All fields are required' })
        const foundUser = await User.findOne({ where: { email: req.params.email }, attributes: ['id', 'first_name', 'last_name', 'password', 'authorization'] });
        if (foundUser) {
            if (await bcrypt.compare(req.params.password, foundUser.password)) {
                const userInfo = { id: foundUser.id, first_name: foundUser.first_name, last_name: foundUser.last_name }
                const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
                return res.status(201).json({ accessToken: {accessToken,foundUser} })
            }
            return res.status(400).json({ message: 'סיסמה שגויה' })
        }
        return res.status(404).json({ message: 'משתמש לא קיים' })
    }

    localStorage= async (req, res) => {
        if (!req.params.id)
            return res.status(400).json({ message: '😊😊😊😊All fields are required' })
        const foundUser = await User.findOne({ where: { id: req.params.id }, attributes: ['id', 'first_name', 'last_name',"authorization"] });
        if (foundUser) {
            const userInfo = { id: foundUser.id, first_name: foundUser.first_name, last_name: foundUser.last_name }
            const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
            return res.status(201).json({ accessToken: {accessToken,foundUser} })
        }
                
        return res.status(404).json({ message: 'משתמש לא קיים' })
    }

    sendEmailToUsers = async (req, res) => {
        const obj = await User.findAll({
            where: {
                email_confirm: 1,
                authorization: {
                    [Op.or]: [1, 2]
                }

            }, attributes: ["first_name", "last_name", "email"]
        });
        obj.forEach(element => {
            const text1 = `הי ${element.first_name} ${element.last_name}\n` + req.body.text;
            sendEmailToUserf(element.email, req.body.title, text1);
        });
        if (obj)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    sendEmailToUser = async (req, res) => {
        const obj = await User.findOne({
            where: {
                // email_confirm: 1,
                id: req.body.id
            }
        });
        if(obj.authorization==2)
        {
            sendEmailToUserf(obj.email, req.body.title, req.body.text);
            return res.status(201).json(obj)
        }
        return res.status(404).json({ message: 'אתה לא המנהל!! 😯😯' })
    }

    sendEmailToManger = async (req, res) => {
        const managers = await User.findAll({ where: { authorization: 2 }, attributes: ["email"] });
        const user = await User.findOne({ where: { id: req.body.id }, attributes: ["first_name", "last_name", "email", "authorization"] });
        if (user) {
            var text1 = `נשלחה אליך הודעה ממשתמש ${user.first_name} ${user.last_name}, אימייל: ${user.email}\n\n` + req.body.text;
            if (user.authorization == 0)
                text1 = "לתשומת לבך משתמש זה הינו משתמש חסום\n" + text1;
            if (managers) {
                managers.forEach(element => {
                    sendEmailToUserf(element.email, ` - אמייל ממשתמש ${user.first_name} ${user.last_name}!`, text1);
                });
                return res.status(201).json(managers)
            }
            return res.status(404).json({ message: 'error' })
        }
        return res.status(404).json({ message: 'user not exsist' })
    }

    updatePassword1 = async (req, res) => {
        console.log(req.params.email)
        const chars = "0123456789";
        var password = "";
        for (let index = 0; index < 6; index++)
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        const hashedPwd = await bcrypt.hash(password, 10)// מה זה המספר הזה?
        await User.update({ "password": hashedPwd }, {
            where: { email: req.params.email }
        })

        const userEmail = await User.findOne({ where: { email: req.params.email }, attributes: ['first_name', 'last_name', "password"] })
        if (userEmail && await bcrypt.compare(password, userEmail.password)) {
            console.log(userEmail);
            const text = `שלום ${userEmail.first_name} ${userEmail.last_name} הסיסמה הזמנית החדשה שלך היא ${password} .נשמח תמיד לעזור לך! ד"ש מרחלי ותמר...😂`
            sendEmailToUserf(req.params.email, "סיסמתך מאתר כתבי יד המהריל", text);
            return res.status(201).json("send");
        }
        return res.status(404).json({ message: "error can not update password" });
    }



    // updatePassword2 = async (req, res) => {
    //     const foundUser = await User.findOne({ where: { email: req.body.email }, attributes: ["password"] });
    //     if (foundUser) {
    //         if (await bcrypt.compare(req.body.password, foundUser.password)) {
    //             const userInfo = { id: foundUser.id, first_name: foundUser.first_name, last_name: foundUser.last_name }
    //             const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    //             return res.status(201).json({ accessToken: accessToken })//יש צורך לשלוח את הטוקן
    //         }
    //         return res.status(400).json({ message: "NOT" });
    //     }
    //     return res.status(400).json({ message: "user not exist" });
    // }

    updatePassword2 = async (req, res) => {
        console.log(req.body);
        const hashedPwd = await bcrypt.hash(req.body.password, 10)
        await User.update({ "password": hashedPwd }, {
            where: { email: req.body.email }
        })
        const obj = await User.findOne({ where: { email: req.body.email }, attributes: ["password"] })
        console.log(obj);
        if (obj && await bcrypt.compare(req.body.password, obj.password))
            return res.status(201).json(obj);
        return res.status(400).json({ message: "error" });
    }

    cancelReceiptEmails = async (req, res) => {
        const obj = await User.findOne({ where: { id: req.params.id }, attributes: ["email_confirm"] })
        if (obj) {
            if (obj.email_confirm == 1) {
                await User.update({ "email_confirm": 0 }, { where: { id: req.params.id } })
                const obj1 = await User.findOne({ where: { id: req.body.id }, attributes: ["email_confirm"] })
                if (obj1 && obj1.email_confirm == 0)
                    return res.status(201).json(obj1,);
                return res.status(400).json({ message: "error" });
            }
            return res.status(201).json(obj);
        }
        return res.status(400).json({ message: "user not exist" });
    }

    confirmReceiptEmails = async (req, res) => {
        const obj = await User.findOne({ where: { id: req.params.id }, attributes: ["email_confirm"] })
        if (obj) {
            if (obj.email_confirm == 0) {
                await User.update({ "email_confirm": 1 }, { where: { id: req.params.id } })
                const obj1 = await User.findOne({ where: { id: req.body.id }, attributes: ["email_confirm"] })
                if (obj1 && obj1.email_confirm == 1)
                    return res.status(201).json(obj1,);
                return res.status(400).json({ message: "error" });
            }
            return res.status(201).json(obj);
        }
        return res.status(400).json({ message: "user not exist" });

    }

    register = async (req, res) => {
        const obj = await User.findOne({ where: { email: req.body.email } });
        if (obj)
            return res.status(406).json({ message: 'email exist' })
        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password)
            return res.status(400).json({ message: 'All fields are required' })
        const hashedPwd = await bcrypt.hash(req.body.password, 10)

        const userObject = { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, email_confirm: req.body.email_confirm, password: hashedPwd }

        const user = await User.create(userObject)
        if (user) {
            sendEmailToUserf(req.body.email, `${req.body.first_name}Welcome to our app`, "Thank you for registering")////////כתיבה יפה של מייל
            return res.status(201).json(user)
        }
        else
            return res.status(400).json({ message: 'error cannt register' })
    }

    updateUserAuthorization = async (req, res) => {
        await User.update({ "authorization": req.body.authorization }, {
            where: { id: req.body.id }
        })
        const obj = await User.findOne({ where: { id: req.body.id }, attributes: ['authorization'] });
        if (obj && obj.authorization == req.body.authorization) {
            if (req.body.authorization == 0) {
                Comment.destroy({
                    where: { user_id: req.body.id, permission: 0 }
                })
                Peirush.destroy({
                    where: { user_id: req.body.id, permission: 0 }
                })
                Correction.destroy({
                    where: { user_id: req.body.id }
                })
            }
            return res.status(201).json({ obj });
        }
        return res.status(404).json({ message: 'error' }) ////id שגוי     
    }
}

const usersController = new UsersController();
module.exports = usersController;
