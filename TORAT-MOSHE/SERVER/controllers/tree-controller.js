const db = require('../models/index');
const Navigation = db.navigation;
const Handwriting = db.handwritings;
const handWritingController = require('./handwriting-controller');


// makeArrays = async(head)=>{  
//     var folders =[];   
//     var parent = await Navigation.findAll({where:{parent_id: head.id}}) 
//         parent.forEach(element => {
//         console.log("------"+element.id)
//     });
//     for (let index = 0; index < parent.length; index++) {
//         const obj= parent[index];  
//         var child = await makeArrays(obj);
//         if(child){
//             const r = {obj:{child}};
//             folders.push(r); 
//         }
//     }
//     return folders;
// }

deleteFolder1 = async (id, res) => {
    const obj = await Navigation.findAll({ where: { parent_id: id } });
    for (let index = 0; index < obj.length; index++) {
        const check = await deleteFolder1(obj[index].id, res);
        if (!check)
            return false;
    }
    const hand = await Handwriting.findAll({ where: { path_id: id } });
    for (let index = 0; index < hand.length; index++) {
        const check = await handWritingController.deleteHandwrting({ params: { id: hand[index].id } }, res);
        if (!check)
            return false;
    }
    if (await Navigation.destroy({ where: { id: id } }, {}))
        return true;
    return false;
}



class TreeController {
    // getAll = async(req, res)=>{
    //     var obj = await Navigation.findAll();
    //     if(obj)
    //         return res.status(201).json(obj)         
    //     return res.status(404).json({ message: 'error' })      
    // }

    getAllParentFolders = async (req, res) => {
        var parent = await Navigation.findAll({ where: { parent_id: null } })
        if (parent)
            return res.status(201).json(parent);
        return res.status(400).json({ message: "error" });
    }

    getAllFoldersByParent = async (req, res) => {
        var children = await Navigation.findAll({ where: { parent_id: req.params.id } })
        if (children)
            return res.status(201).json(children);
        return res.status(400).json({ message: "error" });
    }

    getAllDescriptions = async (req, res) => {
        const folders = await Navigation.findAll({ attributes: ["id", "description"] });
        const files = await Handwriting.findAll({ attributes: ["id", "description"] });
        if (folders && files)
            return res.status(200).json({ folders: folders, files: files })
        return res.status(404).json({ message: "error" })
    }

    addFolder = async (req, res) => {
        var parent;
        if (req.body.parent_id)
            parent = await Navigation.findOne({ where: { id: req.body.parent_id } })
        else
            parent = 1
        if (parent) {
            const n = await Navigation.create(req.body);
            if (n)
                return res.status(201).json(n)
            return res.status(400).json({ message: "error" })
        }
        return res.status(400).json({ message: "parent not found" })
    }

    updateParent = async (req, res) => {
        if (req.params.parent == null || await Navigation.findOne({ where: { parent_id: req.params.parent } })) {
            await Navigation.update({ "parent_id": req.params.parent }, {
                where: { id: req.params.id }
            });
            const obj = await Navigation.findOne({ where: { id: req.params.id } });
            if (obj && obj.parent_id == req.params.parent)
                return res.status(201).json(obj)
            return res.status(404).json({ message: 'not update' })
        }
        return res.status(404).json({ message: 'parent is not exist' })
    }

    updateDescription = async (req, res) => {
        await Navigation.update({ "description": req.body.description }, {
            where: { id: req.params.id }
        });
        const obj = await Navigation.findOne({ where: { id: req.params.id } });
        if (obj && obj.description == req.body.description)
            return res.status(201).json(obj)
        return res.status(404).json({ message: 'error' })
    }

    deleteFolder = async (req, res) => {
        const flag = await deleteFolder1(req.params.id, res);
        if (flag)
            return res.status(201).json({ message: 'ok' })
        return res.status(404).json({ message: 'error' })
    }

    deleteFolders = async (req, res) => {
        const folders = req.body.folders;
        try {
            for (let index = 0; index <folders.length; index++) {
                const element = folders[index];
                const flag = await deleteFolder1(element, res);
                if (!flag)
                    return res.status(404).json({ message: 'errorrrrrrr' })
            }
        } catch (error) {
            return res.status(404).json({ message: 'error' })
        }   
        return res.status(201).json({ message: 'ok' })
    }
}

const treeController = new TreeController();
module.exports = treeController;