const nodemailer = require('nodemailer')
const dotenv = require("dotenv");
const Seller = require('../../models/seller');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
dotenv.config();

exports.forgotPassword = async( req , res) => {
    const {email} = req.body

    try {
        const seller = await Seller.findOne({email});

        if(!seller){
            return res.status(404).json({ message: "Seller not found" });
        }

        const token = jwt.sign({ id : seller._id} , "secret" , {expiresIn : '3h'});

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `http://localhost:3001/reset-password/${seller._id}/${token}`
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: seller.email,
            subject: "Reset Your Password",
            html: `
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetLink}" target="_self" rel="noreferrer noopener">${resetLink}</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        }

        transporter.sendMail(mailOptions , (error , info) => {
            if(error){
                console.log("Email Error:", error);
        return res.status(500).json({ message: "Failed to send email" });
            }else {
                return res.status(200).json({ message: "Reset link sent successfully" });
            }
        })
    } catch (error) {
        console.error("Error:", e);
        res.status(500).json({ message: "Server error" });
    }
}

exports.resetPassword = async (req , res) => {
    const {id , token} = req.params;
    const {password} = req.body;

    try {
        const decoded = jwt.verify(token , "secret");

        if(decoded.id !== id){
            return res.status(401).json({ message: "Invalid token or seller ID" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = await Seller.findByIdAndUpdate(
            {_id : id},
            {password : hashedPassword},
            {new : true}
        );

        if(!seller){
            return res.status(404).json({message : "Seller not found"})
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: seller.email,
            subject: "Password Reset Successfully",
            html: `
                <p>Hello ${seller.name},</p>
                <p>Your password has been reset successfully. If you did not perform this action, please contact our support StyleVerse team immediately.</p>
            `,
        };
        
        await transporter.sendMail(mailOptions);
        res
        .status(200)
        .json({ message: "Password reset successfully and email sent." });
    } catch (error) {
        console.error("Error in resetPass:", error);

        if (error.name === "TokenExpiredError") {
        return res
            .status(401)
            .json({ message: "Reset link expired. Please request a new one." });
        }

        res.status(500).json({ message: "Server error" });
    }
}