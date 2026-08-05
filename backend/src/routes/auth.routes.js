import { Router } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    if (
      email !== String(process.env.ADMIN_EMAIL || "").toLowerCase() ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: 1,
        email,
        role: "admin",
        name: "ITX Admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: 1,
          email,
          role: "admin",
          name: "ITX Admin",
        },
      },
    });
  })
);

export default router;
