const Feedback = require("../models/Feedback");
const FeedbackForm = require("../models/FeedbackForm");
const getAnalytics = async (req,res) => {
 try {
  const [totalForms,totalResponses,forms,responses]=await Promise.all([FeedbackForm.countDocuments({isActive:true}),Feedback.countDocuments(),FeedbackForm.find({isActive:true}).select("title"),Feedback.find().select("form answers createdAt").sort({createdAt:-1}).limit(1000)]);
  const ratings=responses.flatMap(r=>Object.values(r.answers||{}).filter(v=>typeof v==="number"&&v>=1&&v<=5));
  const averageRating=ratings.length?Number((ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(2)):null;
  const satisfaction=ratings.length?Math.round(ratings.filter(v=>v>=4).length/ratings.length*100):null;
  const byForm=forms.map(f=>({formId:f._id,title:f.title,responses:responses.filter(r=>String(r.form)===String(f._id)).length}));
  return res.json({success:true,analytics:{totalForms,totalResponses,averageRating,satisfaction,byForm,recentResponses:responses.slice(0,10)}});
 } catch { return res.status(500).json({success:false,message:"Unable to load analytics"}); }
};
module.exports={getAnalytics};
