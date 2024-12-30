import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom"
import React from "react";
import 'primeicons/primeicons.css';

export const createTree = (all = [], x) => {
    var arr = all.filter(a => a.parent_id == x.id);
    for (let index = 0; index < arr.length; index++) {
        const obj = arr[index];
        obj['key'] = x.id ? `${x.key}-${index}` : `${index}`;
        var children = createTree(all, obj);
        obj['children'] = children ? children : [];
        obj['isNav'] = false; 
        obj['expandedIcon'] = 'pi pi-folder-open text-yellow-600';
        obj['collapsedIcon']= 'pi pi-folder text-yellow-600';

    }
    return arr;
}

export const enterHanwriting = (all = [], tree, arrtree) => {
    all.forEach(h => {
        var x = arrtree.find(element => element.id == h.path_id)
        var path =[];
        while(x.parent_id){
            path.push(x.parent_id)
            x = arrtree.find(element => element.id == x.parent_id)
        }
        var tmptree =tree;
        for (let index = path.length -1; index >= 0; index--) {
            tmptree = tmptree.find(element => element.id == path[index]).children;
        }
        tmptree.find(element => element.id ==h.path_id).children.push({ isNav: true,id: h.id, key: `${x.key}-${x['children'].length}`, icon: 'pi pi-fw pi-file' , label:h.description,});

    });
    return tree;
}


export const createTreeManager = (all = [], x) => {
    var arr = all.filter(a => a.parent_id == x.id);
    for (let index = 0; index < arr.length; index++) {
        const obj = arr[index];
        obj['key'] = x.id ? `${x.key}-${index}` : `${index}`;
        var children = createTree(all, obj);
        obj['children'] = children ? children : [];
        obj['icon']='pi pi-fw pi-inbox';
        obj['isNav'] = false; 
    }
    return arr;
}

export const enterHanwritingManager = (all = [], tree, arrtree) => {
    
    all.forEach(h => {
        var x = arrtree.find(element => element.id == h.path_id)
        var path =[];
        while(x.parent_id){
            path.push(x.parent_id)
            x = arrtree.find(element => element.id == x.parent_id)
        }
        var tmptree =tree;
        for (let index = path.length -1; index >= 0; index--) {
            tmptree = tmptree.find(element => element.id == path[index]).children;
        }
        tmptree.find(element => element.id ==h.path_id).children.push({ isNav: true,id: h.id, key: `${x.key}-${x['children'].length}`, icon: 'pi pi-fw pi-file' , label:h.description,});

    });
    return tree;
}


export const orderCorrections = (data = [])=>{
    console.log("i iiiiiii");
    var newData = [];
    data.forEach(c=>{
        newData.push({id:c.id, description:c.description, quantity:c.corrections.length, corr:c.corrections})
    })
    return newData;
}
export const orderPeirush = (data = [])=>{
    var newData = [];
    data.forEach(c=>{
         newData.push({id:c.id, description:c.description, quantity:c.peirushims.length, perr:c.peirushims })
    })
    return newData;
}
// export const orderComments = (data = [])=>{
//     var newData = [];
//     data.forEach(c=>{
//         newData.push({id:c.id, description:c.description, quantity:c.comments.length})
//     })
//     return newData;
// }

export const showPath =(y, arrtree)=>{
    var x = arrtree.find(element => element.id == y)
    var path =""+x.label;
    while(x){
        x = arrtree.find(element => element.id == x.parent_id)
        if (x) 
            path = x.label+ "/ " +path;
    }
    return path
}


// code: 'zx23zc42c',
// name: 'Teal T-Shirt',
// description: 'Product Description',
// category: 'Clothing',
// quantity: 3

//         "id": 3,
//         "image_path": "E:מסלולפרויקט גמרכתב יד.jpg",
//         "image_name": "",
//         "image_type": "",
//         "transcription_path": "M",
//         "transcription_name": "",
//         "transcription_type": "",
//         "description": "rhrrrrrr",
//         "path_id": 3,
//         "corrections": [
//             {
//                 "id": 2,
//                 "handwriting_id": 3,
//                 "word_index": 14,
//                 "new_word": "oooooo",
//                 "original_word": "uuuuuuuuuuuuu",
//                 "user_id": 27,
//                 "date": "2002-12-12"
//             },
//             {
//                 "id": 1,
//                 "handwriting_id": 3,
//                 "word_index": 2,
//                 "new_word": "racheli",
//                 "original_word": "rach",
//                 "user_id": 27,
//                 "date": "2022-01-01"


//     id: '1000',
//     code: 'f230fh0g3',
//     name: 'Bamboo Watch',
//     description: 'Product Description',
//     image: 'bamboo-watch.jpg',
//     price: 65,
//     category: 'Accessories',
//     quantity: 24,
//     inventoryStatus: 'INSTOCK',
//     rating: 5


export const orderUsers = (data = [])=>{
    var newUser = [];
    data.forEach(user => {newUser.push({id:user.id, name:user.first_name, lastName: user.last_name, verified: user.email_confirm==0?false:true, status:user.authorization==0?'משתמש חסום':user.authorization==1?'משתמש': 'מנהל', emailAddress:user.email})})
    return newUser;
}
