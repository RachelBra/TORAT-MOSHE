const fs = require('fs');
const db = require('../models/index');
const Handwriting = db.handwritings;
const Peirush = db.peirushim;
const Comment = db.comments;
const User = db.users;
const Correction = db.corrections;
const Navigation = db.navigation;
const path = require("path")
const { v4: uuid } = require("uuid")
const multer = require("multer");

// 📂 תיקיות לשמירת קבצים
const imagesFolder = path.join(__dirname, "..", "assets\\images");
const transcriptionsFolder = path.join(__dirname, "..", "assets\\transcriptions");

//  `multer` - הגדרת אחסון ושמות קבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("In multer");
        if (file.mimetype.startsWith("image/")) {
            cb(null, imagesFolder); // שמירת תמונות ב-`images/`
        } else {
            cb(null, transcriptionsFolder); // שמירת קבצי טקסט ב-`transcriptions/`
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}-${file.originalname}`); // שם ייחודי לכל קובץ
    }
});

const upload = multer({ storage });


class HandWritingController {
    // saveBase64File = (base64Data, fileName, folderPath) => {
    //     console.log("I am hear! 1");
    //     const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    //     if (!matches || matches.length !== 3) {
    //         throw new Error("❌ פורמט Base64 לא תקין.");
    //     }
    
    //     const fileType = matches[1]; // image/jpeg או text/plain
    //     const fileExtension = fileType.split("/")[1]; // jpg, txt וכו'
    //     const fileContent = Buffer.from(matches[2], "base64"); // המרה לבינארי
    
    //     const fullFileName = `${fileName}.${fileExtension}`;
    //     const filePath = path.join(folderPath, fullFileName);
    
    //     fs.writeFileSync(filePath, fileContent);
    //     console.log("I am hear! ", filePath);
    
    //     return filePath;
    // };

    addHandwriting = async(req, res) => {
        try {
            console.log("📥 קיבלנו בקשה:", req.files, req.body);

            // וידוא שכל הנתונים התקבלו
            if (!req.files || !req.files.handwriting || !req.files.transcription) {
                return res.status(400).json({ error: "❌ יש להעלות גם תמונה וגם תמלול." });
            }

            const handwritingPath = "/images/" + req.files.handwriting[0].filename;
            const transcriptionPath = "/transcriptions/" + req.files.transcription[0].filename;

            const { description, path_id } = req.body;

            if (!description || !path_id) {
                return res.status(400).json({ error: "❌ חסרים פרמטרים (תיאור או מזהה נתיב)" });
            }

            // 📝 שמירת הנתונים במסד הנתונים
            const newHandwriting = await Handwriting.create({
                image_path: handwritingPath,
                transcription: transcriptionPath,
                description: description,
                path_id: path_id
            });

            return res.status(201).json(newHandwriting);
        } catch (error) {
            console.error("❌ שגיאה בהעלאת הקובץ:", error);
            return res.status(500).json({ error: "❌ שגיאה בשמירת הנתונים" });
        }
    }

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

    addHandwritingOld = async (req, res) => {
        console.log("I am hear! 1");
        // הירוקים הם בשביל להעלות תמונה כרגע רק כדי לבנות את הנתיב
        const imagesFolder = path.join(__dirname, "..", "images")
        const transcriptionsFolder = path.join(__dirname, "..", "transcriptions")
        try {
            const { handwriting, transcription, description, path_id } = req.body;
            console.log(handwriting);
            
            if (!handwriting || !transcription || !description || !path_id) {
                return res.status(400).json({ error: "❌ נתונים חסרים בבקשה" });
            }
    
            // שמירת התמונה
            const handwritingPath = saveBase64File(handwriting.file, handwriting.fileName, imagesFolder);
            
            // שמירת קובץ התמלול
            const transcriptionPath = saveBase64File(transcription.file, transcription.fileName, transcriptionsFolder);
            const status = await Handwriting.create({ image_path: handwritingPath, transcription: transcriptionPath, description: description, path_id: path_id });

            if (status)
                return res.status(201).json(obj)         
            return res.status(500).json({ error: " שגיאה בשמירת הנתונים" });
        } catch (error) {
            console.error("❌ שגיאה בהעלאת הקובץ:", error);
            return res.status(500).json({ error: "❌ שגיאה בשמירת הקובץ" });
        }
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
module.exports = { handWritingController, upload };
