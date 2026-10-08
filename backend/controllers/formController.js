const FeedbackForm = require("../models/FeedbackForm");

const createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    if (!title?.trim() || !Array.isArray(questions) || questions.length === 0) return res.status(400).json({ success:false, message:"Title and at least one question are required" });
    const form = await FeedbackForm.create({ title:title.trim(), description:description?.trim(), questions, createdBy:req.user.id });
    res.status(201).json({ success:true, form });
  } catch (error) { res.status(500).json({ success:false, message:"Unable to create feedback form" }); }
};

const listForms = async (req,res) => {
  try { const forms=await FeedbackForm.find({isActive:true}).sort({createdAt:-1}); res.json({success:true,forms}); }
  catch { res.status(500).json({success:false,message:"Unable to fetch feedback forms"}); }
};

const listMyForms = async (req,res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user.id };
    const forms = await FeedbackForm.find(filter).sort({createdAt:-1});
    res.json({success:true,forms});
  } catch { res.status(500).json({success:false,message:"Unable to fetch your feedback forms"}); }
};

const getForm = async (req,res) => {
  try { const form=await FeedbackForm.findById(req.params.id); if(!form) return res.status(404).json({success:false,message:"Form not found"}); res.json({success:true,form}); }
  catch { res.status(400).json({success:false,message:"Invalid form id"}); }
};

const updateForm = async (req,res) => {
  try {
    const form=await FeedbackForm.findById(req.params.id);
    if(!form) return res.status(404).json({success:false,message:"Form not found"});
    if(String(form.createdBy)!==String(req.user.id) && req.user.role!=="admin") return res.status(403).json({success:false,message:"Not authorized"});
    const {title,description,questions,isActive}=req.body;
    if(title!==undefined) form.title=title.trim();
    if(description!==undefined) form.description=description.trim();
    if(questions!==undefined) { if(!Array.isArray(questions)||!questions.length) return res.status(400).json({success:false,message:"At least one question is required"}); form.questions=questions; }
    if(isActive!==undefined) form.isActive=Boolean(isActive);
    await form.save(); res.json({success:true,form});
  } catch { res.status(500).json({success:false,message:"Unable to update feedback form"}); }
};

const deleteForm = async (req,res) => {
  try {
    const form=await FeedbackForm.findById(req.params.id);
    if(!form) return res.status(404).json({success:false,message:"Form not found"});
    if(String(form.createdBy)!==String(req.user.id) && req.user.role!=="admin") return res.status(403).json({success:false,message:"Not authorized"});
    await form.deleteOne(); res.json({success:true,message:"Feedback form deleted"});
  } catch { res.status(500).json({success:false,message:"Unable to delete feedback form"}); }
};

module.exports={createForm,listForms,listMyForms,getForm,updateForm,deleteForm};
