import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import StudentModel from "./models/Student.js";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/school");

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10).then(async (hash) => {
    await StudentModel.create({ name, email, password: hash })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  });
});

// Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find tkarenge user ko by email 
        const user = await StudentModel.findOne({ email });
        if (user) {
            // Compare both password by hash
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const accessToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                const refreshToken = jwt.sign({ email: email }, "jwt-refresh-token-secret-key", { expiresIn: '5m' });
                res.cookie('accessToken', accessToken, { maxAge: 60000 });
                res.cookie('refreshToken', refreshToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });
                return res.json({ Login: true });
            } else {
                return res.json({ Login: false, Message: "Invalid credentials" });
            }
        } else {
            return res.json({ Login: false, Message: "User not found" });
        }
    } catch (error) {
        res.json({ error: 'Internal Server Error' });
    }
});

// Logout API
app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: "Logged out successfully" });
});

// Middleware to verify user
const verifyUser = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        if (renewToken(req, res)) {
            next();
        }
    } else {
        jwt.verify(accessToken, 'jwt-access-token-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Token" });
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
};

// Token renewal function
const renewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    let exist = false;
    if (!refreshToken) {
        return res.json({ valid: false, message: "No Refresh token" });
    } else {
        jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: "Invalid Refresh Token" });
            } else {
                const accessToken = jwt.sign({ email: decoded.email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
                res.cookie('accessToken', accessToken, { maxAge: 60000 });
                exist = true;
            }
        });
    }
    return exist;
};
app.get("/dashboard", verifyUser, (req, res) => {
  return res.json({ valid: true, message: "authorized" });
});

app.listen(3001, () => {
  console.log("Server is Running");
});
