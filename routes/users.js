const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user"); // Corrected the path to the user model
const bcrypt = require("bcrypt"); // Corrected the require statement

// Update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }); // Added { new: true } to return the updated document
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

//get a user 

router.get("/:id", async (req,res)=>{
    try{
        const user= await User.findById(req.params.id);
        const {password, updatedAt, ...other}=user._doc;
        res.status(200).json(other);
    } catch(err){
      res.status(403).json(err);
    }
  });


  // follow a user 
router.put("/:id/follow", async (req,res)=>{
if(req.body.userId!==req.params.id){
  try{
    const user= await User.findById(req.params.id);
    const curruser=await User.findById(req.body.userId);
  if(!user.followers.includes(req.body.userId)){
    await user.updateOne({ $push: {followers: req.body.userId}});
    await curruser.updateOne({$push:{followings: req.params.id}});
  }else{
    return res.status(403).json("you already follow ");
  }
  }catch(err){
   res.status(500).json(err);
  }
}else{
  return res.status(403).json("You cannot follow yourself");
}
});


//unfollow
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});



module.exports = router;