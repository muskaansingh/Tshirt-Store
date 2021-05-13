const User = require("../models/user");
const Order = require("../models/order");

// its a middleware
exports.getUserById =(req, res, next, id)=>{
    User.findById(id).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"No User was found in database"
            })
        }

        req.profile = user;
        next();
    });
};


exports.getUser = (req, res) =>{
    // TODO: get back here for password
    
// We only make this property undefined i.e hidden only at the user profile not on the DB

    req.profile.salt = "";
 // req.profile.salt = undefined; undefined ---hides the salt property
    
     req.profile.encry_password = undefined;
     req.profile.createdAt = undefined;
     req.profile.updatedAt = undefined;

  return res.json(req.profile);
  
}

// controller for user info updation

exports.updateUser = (req, res) =>{
    User.findByIdAndUpdate(
        {_id : req.profile._id}, //find user
        {$set: req.body},  // update user
        {new: true, userFindAndModify: false},
        (err,user) =>{
            if(err){
                return res.status(400).json({
                    error: "Update in the database is not done!"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
        }
    )
}

//controller for creating purchase list

exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) =>{
        if(err){
            return res.stats(400).json({
                error:"No order in this account"
            });
        }
        return res.json(order);
    });
}

//controller for updating or pushing order in purchase list
// in this we store the purchase order in purchases[] array using push method

exports.pushOrderInPurchaseList = (req, res, next) =>{

    let purchases = [] 
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })

    // store this in DB

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}}, //update the user purchases (in user.js file) to the local purchases of the user
        {new: true}, // it sends back the updated data not the old data
        (err, purchases) => {
            if(err) {
                return res.status(400).json({
                    error: "Unable to save the purchase list"
                });
            }
            next();
        }); 
};
 