import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";
export const userApp = exp.Router();


// Public: Read articles of all authors (no authentication required)
userApp.get("/public-articles", async (req, res) => {
  try {
    const articlesList = await ArticleModel.find({ isArticleActive: true });
    res.status(200).json({ message: "articles", payload: articlesList });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

//Read articles of all authors (USER only)
userApp.get("/articles", verifyToken("USER"), async (req, res) => {
  const articlesList = await ArticleModel.find({ isArticleActive: true });
  res.status(200).json({ message: "artciles", payload: articlesList });
});

//Add comment to an article
userApp.put("/articles", verifyToken("USER"), async (req, res) => {
  //get body from req
  const { articleId, comment } = req.body;
  //check article
  const articleDocument = await ArticleModel
                          .findOne({ _id: articleId, isArticleActive: true })
                           .populate("comments.user");

  console.log(articleDocument);
  //if article not found
  if (!articleDocument) {
    return res.status(404).json({ message: "Article not found" });
  }
  //get user id
  const userId = req.user?.id;
  //add comment to comments array of articleDocument
  articleDocument.comments.push({ user: userId, comment: comment });
  //save
  await articleDocument.save();
  //send res
  res.status(200).json({ message: "Comment added successfully", payload: articleDocument });
});
