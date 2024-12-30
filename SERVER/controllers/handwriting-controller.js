const fs = require('fs');
const db = require('../models/index');
const Handwriting = db.handwritings;
const Peirush = db.peirushim;
const Comment = db.comments;
const User = db.users;
const Correction = db.corrections;
const Navigation = db.navigation;

const base64toFile = require('node-base64-to-file');
const path = require("path")
const { v4: uuid } = require("uuid")

class HandWritingController {
    GetAll = async (req, res) => {
        var both = { tree: [], handwritings: [] };
        var obj = await Navigation.findAll();
        if (obj) {
            both.tree = obj;
            const obj1 = await Handwriting.findAll( );
            if (obj1)
                both.handwritings = obj1;
            return res.status(200).json(both)
        }
        return res.status(404).json({ message: 'error' })
    }

    getHandwritingByIdWithPeirushim = async (req, res) => {

        const obj = await Handwriting.findOne({ where: { id: req.params.id} , attributes: [ "image_path","transcription",'description'] });
        if (obj) { 
            const hanwriting =  {
                                    image_path: fs.readFileSync(obj.image_path, { encoding: 'base64' }),
                                    transcription: obj.transcription,
                                    description:obj.description
                                }
                               
            const prshm = await Peirush.findAll({ where: { handwriting_id: req.params.id, permission: 1 } });
            return res.status(200).json({ handwriting: hanwriting, peirushim: prshm })
        }
        return res.status(404).json({ message: 'error!!' })
    }

    // getHandwritingByIdWithPeirushim2 = async (req, res) => {//////נתיבים/ קבצים?????????????????????????????????????
    //     const obj = await Handwriting.findOne({ where: { id: req.params.id } });
    //     const details = { id: obj.id, description: obj.description, path_id: obj.path_id };
    //     if (obj) {
    //         const base64String = 'data:image/png;base64,iVBORw0KGgo...';
    //         var imagePath;
    //         var handwritingPath;
    //         // create an image with the a given name ie 'image'
    //         try {
    //             // imagePath = await base64toFile(base64String, { filePath: 'D:', fileName: "sssssss" , types: ['png'], fileMaxSize: 3145728 });
    //             imagePath = await base64toFile(base64String, { filePath: obj.image_path, fileName: obj.image_name, types: [obj.image_type], fileMaxSize: 3145728 });
    //             console.log(imagePath)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //         //   try {
    //         //     handwritingPath = await base64toFile(base64String, { filePath: obj.transcription, fileName: obj.transcription_name , types: obj.transcription_type, fileMaxSize: 3145728 });
    //         //     console.log(handwritingPath)
    //         //   } catch (error) {
    //         //     console.log(error)
    //         //   }

    //         const prshm = await Peirush.findAll({ where: { handwriting_id: req.params.id, permission: 1 } });
    //         return res.status(200).json({ details: details, image: imagePath, handwriting: handwritingPath, peirushim: prshm })
    //     }
    //     return res.status(404).json({ message: 'error' })
    // }

    // getAllComments = async (req, res) => {
    //     const cmmnt = await Comment.findAll({ where: { peirush_id: req.body.id, permission: 1 } });
    //     if (cmmnt)
    //         return res.status(200).json(cmmnt)
    //     return res.status(507).json({ message: "not success" })
    // }

    // getHandwritingsDesByFolderId = async (req, res) => {
    //     if (req.params.id) {
    //         const obj = await Handwriting.findAll({ where: { path_id: req.params.id }, attributes: ["id", "description"] });/////נתיבים/ קבצים???????????????????????????????????????
    //         if (obj)
    //             return res.status(200).json(obj)
    //     }
    //     return res.status(404).json({ message: 'error' })
    // }

    addHandwriting = async (req, res) => {
        // הירוקים הם בשביל להעלות תמונה כרגע רק כדי לבנות את הנתיב
        let imagePath = ""
        const folder = path.join(__dirname, "..", "images")
        // const filename = `${uuid()}`
        const filename = req.body.image_path;
        // const fileUrl = `${folder}\\${filename}.png`
        const fileUrl = `${folder}\\${filename}`
        // const base64String = req.body.image_path;

        // try {
        //     imagePath = await base64toFile(base64String, { filePath: folder, fileName: filename, types: ['png'], fileMaxSize: 3145728 });
        // }
        // catch (error) {
        //     return res.status(400).json({ message: 'error occured while loading image' })
        // }

        const obj = await Handwriting.create({ image_path: fileUrl, transcription: req.body.transcription, description: req.body.description, path_id: req.body.path_id });
        console.log("fileUrl", obj);
        if (obj)
            return res.status(201).json(obj)
        return res.status(507).json({ message: "not succcess" })
    }

    addPeirush = async (req, res) => {
        if (!req.body.user_id)
            return res.status(406).json({ message: 'user not connected' })
        const user = await User.findOne({ where: { id: req.body.user_id }, attributes: ["authorization"] });
        if (user.authorization == 0)
            return res.status(406).json({ message: 'blocked user' })
        var permission = 0;
        if (user.authorization == 2)
            permission = 1;
        const obj = await Handwriting.findOne({ where: { id: req.body.handwriting_id } });
        if (obj) {
            const p = {
                "handwriting_id": req.body.handwriting_id,
                "user_id": req.body.user_id,
                "peirush_text": req.body.peirush_text,
                "permission": permission
            }
            const perush = await Peirush.create(p);
            if (perush)
                return res.status(201).json(perush)
            return res.status(507).json({ message: "not success" })
        }
        return res.status(400).json({ message: 'error😊' })
    }

    // addComment = async (req, res) => {
    //     if (!req.body.user_id)
    //         return res.status(406).json({ message: 'user not connected' })
    //     const user = await User.findOne({ where: { id: req.body.user_id }, attributes: ["authorization"] });
    //     if (user.authorization == 0)
    //         return res.status(406).json({ message: 'blocked user' })
    //     var permission = 0;
    //     if (user.authorization == 2)
    //         permission = 1;
    //     const obj = await Peirush.findOne({ where: { id: req.body.peirush_id } });
    //     if (obj) {
    //         const p = {
    //             "peirush_id": req.body.peirush_id,
    //             "user_id": req.body.user_id,
    //             "comment_text": req.body.comment_text,
    //             "permission": permission
    //         }
    //         const cmmnt = await Comment.create(p);
    //         if (cmmnt)
    //             return res.status(201).json(cmmnt)
    //         return res.status(507).json({ message: "not success" })
    //     }
    //     else
    //         return res.status(400).json({ message: 'error not find a handwriting' })
    // }

    addCorrections = async (req, res) => {
        if (!req.body.user_id)
            return res.status(406).json({ message: 'user not connected' })
        const user = await User.findOne({ where: { id: req.body.user_id }, attributes: ["authorization"] });
        if(!user)
            return res.status(400).json({ message: 'error not find a user' })
        if (user.authorization == 0)
            return res.status(406).json({ message: 'blocked user' })
        const obj = await Handwriting.findOne({ where: { id: req.body.handwriting_id } });
        if (obj) {
            const crrct = await Correction.create(req.body);
            if (crrct)
                return res.status(201).json(crrct)
            return res.status(507).json({ message: "not success" })
        }
        else
            return res.status(400).json({ message: 'error not find a handwriting' })
    }

    updatePath = async (req, res) => {// אפשר לשלוח שתי םרמטרים בנתיב?
        await Handwriting.update({ "path_id": req.params.path }, {
            where: { id: req.params.id }
        });
        const obj = await Handwriting.findOne({ where: { id: req.params.id } });
        if (obj && obj.path == req.params.path)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    updateDescription = async (req, res) => {
        await Handwriting.update({ "description": req.body.description }, {
            where: { id: req.params.id }
        });
        const obj = await Handwriting.findOne({ where: { id: req.params.id } });
        if (obj && obj.description == req.body.description)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    updateImage = async (req, res) => {
        await Handwriting.update({ "image_path": req.body.image_path, "image_name": req.body.image_name, "image_type": req.body.image_type }, {
            where: { id: req.params.id }
        });
        const obj = await Handwriting.findOne({ where: { id: req.params.id } });
        if (obj && obj.description == req.body.description)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    updateTranscription = async (req, res) => {
        await Handwriting.update({ "transcription": req.body.transcription }, {
            where: { id: req.params.id }
        });
        const obj = await Handwriting.findOne({ where: { id: req.params.id } });
        if (obj && obj.transcription == req.body.transcription)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }
    

    deleteHandwrting = async (req, res) => {
        if (await Handwriting.findOne({ where: { id: req.params.id } })) {
            await Peirush.destroy({
                include: [{ model: Comment }],
                where: { handwriting_id: req.params.id }
            })
            const check = await Peirush.findAll({ where: { handwriting_id: req.params.id } });
            if (!check.length) {
                const flag = await Handwriting.destroy({ where: { id: req.params.id } })
                if (flag) {
                    return res.status(201).json({ message: 'ok' })
                }
            }
            return res.status(404).json({ message: 'error' })
        }
        return res.status(201).json({ message: 'not exist such file' })
    }
}

const handWritingController = new HandWritingController();
module.exports = handWritingController;