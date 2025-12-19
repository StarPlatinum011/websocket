import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";
const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
})

router.get("/", (req, res) => {
  res.json({ message: "Auth route" });
})


export default router;
