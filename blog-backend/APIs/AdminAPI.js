import exp from 'express'
import { UserModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

export const adminApp = exp.Router();

//login for admin
adminApp.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //find user by email
  const user = await UserModel.findOne({ email: email });
  //if user not found
  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }
  // block login if user is deactivated
  if (user.isUserActive === false) {
    return res.status(403).json({ message: "Your account has been deactivated. Please contact admin." });
  }
  //compare password
  const isMatched = await compare(password, user.password);
  //if passwords not matched
  if (!isMatched) {
    return res.status(400).json({ message: "Invalid password" });
  }
  //create jwt
  const signedToken = sign(
    {
      id: user._id,
      email: email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "10h",
    },
  );

  //set token to res header as httpOnly cookie
  res.cookie("token", signedToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  //remove password from user document
  let userObj = user.toObject();
  delete userObj.password;

  //send res
  res.status(200).json({ message: "login success", payload: userObj });
});



//read all articles
adminApp.get("/articles", verifyToken("ADMIN"), async (req, res) => {
  //read artcles
  const articlesList = await ArticleModel.find({ isArticleActive: true });
  //send res
  res.status(200).json({ message: "artciles", payload: articlesList });
});


//see all the users and authors
adminApp.get("/admin/users",verifyToken("ADMIN"),async (req, res) => {
    try {
      const users = await UserModel.find({
        role: { $in: ["USER", "AUTHOR"] }
      }).select("-password");

      return res.status(200).json({
        message: "Users fetched successfully",
        data: users
      });

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
);


//deactive any user/author
adminApp.patch(
  "/admin/deactivate/:id",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (user.role === "ADMIN") {
        return res.status(403).json({
          message: "Admin cannot be deactivated"
        });
      }

      user.isUserActive = false;
      await user.save();

      return res.status(200).json({
        message: "User deactivated successfully"
      });

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
);

// activate any user/author
adminApp.patch(
  "/admin/activate/:id",
  verifyToken("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (user.role === "ADMIN") {
        return res.status(403).json({
          message: "Admin cannot be activated"
        });
      }

      user.isUserActive = true;
      await user.save();

      return res.status(200).json({
        message: "User activated successfully"
      });

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
);

//logout
adminApp.get("/logout", (req, res) => {
  //delete token from cookie storage
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  //send res
  res.status(200).json({ message: "Logout success" });
});



