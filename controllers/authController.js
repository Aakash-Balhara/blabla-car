const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AuthDb = require("../module/authDb");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

exports.getHome = (req, res) => {
    // console.log("At /home, req.user =", req.user);
    res.status(200).render("home");
};


exports.getSignin = (req, res) => {
    res.status(200).render("signin");
};


exports.register = async (req, res) => {
    try {
        const { firstName, lastName, dob, email, password } = req.body;
        console.log("REGISTER BODY:", req.body);
        const exist = await AuthDb.findOne({ email });
        console.log(exist);
        if (exist) {
            return res.status(409).send("already register");
        }

        if (!firstName || !lastName || !dob || !email || !password) {
            return res.status(409).send("fill the required field");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new AuthDb(
            {
                ...req.body,
                password: hashPassword,
                isVerified: false
            });
        await newUser.save();

        const verifyToken = jwt.sign({ id: newUser._id, email }, secret, { expiresIn: "10m" });
        const verifyLink = `http://localhost:3300/verifyEmail?token=${verifyToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email - BlaBlaCar",
            html: `<p>Click below to verify your email:</p>
                   <a href="${verifyLink}">${verifyLink}</a>`
        });

        res.status(200).send("Verification email sent. Please check your inbox.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Registration failed.");
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AuthDb.findById(decoded.id);
        console.log("decoded user", user);
        if (!user) return res.status(404).send("User not found.");

        if (user.isVerified) return res.send("Email already verified.");

        user.isVerified = true;
        await user.save();

        res.render("verifyEmail");
    } catch (err) {
        console.error(err);
        res.status(400).send("Invalid or expired token.");
    }
};
exports.getSuccessPage = (req, res) => {
    res.status(200).render("successEmail");
};

exports.getLogin = (req, res) => {
    res.status(200).render("login");
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthDb.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: "invalid" });
    }
    if (!user.isVerified) {
        return res.status(403).json({ error: "Please verify your email first." });
    }
    if (!email || !password) {
        return res.status(409).json("fill the required field");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        const token = jwt.sign({ id: user._id, email: user.email }, secret);
        res.cookie("token", token, {
            httpOnly: true,
        });

        res.status(200).json({ message: "Login successful" });
    }
    else {
        res.status(401).json({ error: "invalid" });
    }
};



exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
};


exports.getForget = (req, res) => {
    res.render("forget");
};


exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await AuthDb.findOne({ email });
    if (!user) {
        return res.status(404).send("User not found");
    }
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10m' });

    const link = `http://localhost:3300/reset?token=${token}`;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Link",
        html: `<p>Click the link to reset your password:</p><a href="${link}">${link}</a>`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(400).send("Failed to send mail");
        }
        res.status(200).send("reset link send on your email");
    })
};


exports.getReset = async (req, res) => {
    const token = req.query.token;
    try {
        const decode = jwt.verify(token, secret);
        const exist = await AuthDb.findById(decode.id);
        if (exist) {
            res.status(200).render("reset", { token });
        }
        else {
            res.status(401).send("invalid token");
        }
    } catch {
        res.status(401).send("invalid token");
    }
};


exports.resetPassword = async (req, res) => {
    const { password, confirm, token } = req.body;

    if (!password || !confirm) {
        return res.status(409).send("fill the required field");
    }

    try {
        const decode = jwt.verify(token, secret);
        if (password !== confirm) {
            return res.status(400).send("confirm password not matched");
        }

        const hashnewPassword = await bcrypt.hash(password, 10);
        await AuthDb.findByIdAndUpdate(decode.id, { password: hashnewPassword });
        res.status(200).send("password change successful");
    }
    catch {
        res.status(500).send("invalid token");
    }
};
