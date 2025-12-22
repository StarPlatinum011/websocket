import { Router } from "express";
import { registerUser, loginUser, userLogout } from "../controllers/authControllers.js";
const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser)
router.post("/logout", userLogout)

router.get("/", (req, res) => {
  res.json({ message: "Auth route" });
})


export default router;
