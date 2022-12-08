const express = require("express");
const router = express.Router();
const noteModel = require("./schema/noteModel");
const fetchUser = require("./middlewares/fetchUser");

router.post("/save", fetchUser, async (req,res)=>{
 try{
 const Notes = await  noteModel.create({
    userId: req.user,
    title: req.body.title,
    tag: req.body.tag,
    description: req.body.description
  });
  Notes.save();
  res.status(200).json({Notes});
 }catch(err){
   res.status(500).send("Error occured");
 }
})

// get notes corresponding to id
router.get("/getnotes", fetchUser, async (req,res)=>{
 try{
   let id = req.user;
 let notes = await noteModel.find().where("userId"). equals(id);
  res.status(200).json({notes});
 }catch(err){
   res.status(500).send("Error occured");
 }
})

// get all notes http://localhost:/4000/api/note/getallnotes 
router.get("/getallnotes", async (req,res)=>{
 try{
   let notes = await noteModel.find();
  res.status(200).json({notes});
 }catch(err){
   res.status(500).send("Error occured");
 }
})

// put request to update notes
router.put("/update/:id", fetchUser, async (req,res)=>{
 try{
   const {title, description, tag} = req.body;
   const newNote = {};
if(title){newNote.title = title}
if(description){newNote.description = description}
if(tag){newNote.tag = tag}

   let notes = await noteModel.findById(req.params.id);
   if(notes.userId.toString() !== req.user){
     return res.status(401).send("note not found");
   }
   notes = await noteModel.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
   
  res.status(200).json({notes});
 }catch(err){
   res.status(500).send("Error occured");
 }
})

// to delete note from database
router.delete("/delete/:id", fetchUser, async (req,res)=>{
 try{
   

   let notes = await noteModel.findById(req.params.id);
   if(notes.userId.toString() !== req.user){
     return res.status(401).send("note not found");
   }
   notes = await noteModel.findByIdAndDelete(req.params.id);
   
  res.status(200).json({msg: "successfully deleted"});
 }catch(err){
   res.status(500).send("Error occured");
 }
})
module.exports = router;