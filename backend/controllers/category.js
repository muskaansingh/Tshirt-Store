const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
   
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error:"Category not found in DB"
            })
        }
        req.Category = cate;
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {  // Category is the model which we were created
        if(err){
            return res.status(400).json({
                error:"Not able to save Category in the DB"
            });
        }  
        res.json({category}); 
    }); 
};

exports.getCategory = (req, res) => {
    return res.json(res.category);
};

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if(err){
        return res.status(400).json({
            error: "NO categories found"
        });
    }
    res.json(categories);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name; // updating category.name define in category model

    category.save((err, updateCategory) => {
        if(err){
            return res.status(400).json({
                error:"Failed to update Category"
            });
        }
        res.json(updateCategory);
    });
};

exports.deleteCategory = (req, res) =>{
    const category = req.category; //it extracting the things from the parameters
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error:"Failed to delete Category"
            });
        }
        res.json({
           message: "Successfully Deleted" 
        });   
    });
};