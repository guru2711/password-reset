const express = require("express")
const mongoose = require("mongoose")
const resetpassword = require("./modal/mail")
const crypto = require("crypto")
// import { response } from "express"
require("dotenv").config()
const nodemailer = require("nodemailer")
 
const cors = require("cors")

const app = express()

const PORT = 3000
app.use(express.json())

app.use(cors())


// connect to db
mongoose.connect("mongodb+srv://Guru:Guru777@cluster0.ke7v2.mongodb.net/passwordresetflow?retryWrites=true&w=majority",() => {
    console.log("Connected to MongoDB - passwordresetflow")
})


app.post("/", async (req,res) => {
try{
    const mail = new resetpassword({
        email:req.body.emailid
    })
     const user=  await mail.save()
        console.log(user.email)

        // const usermail = await mail.find({email: req.body.emailid})
    //    console.log(usermail)
        if(user === null){
            console.log("email is not in database")
            res.status(403).send("email is not in db")
        }else{
            const token = crypto.randomBytes(20).toString("hex")
            console.log(token)
            user.update({
                resetpasswordToken : token,
                resetpasswordExpires : Date.now() +  360000,
            })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.EMAIL_ADDRESS}`,
                pass:`${process.env.EMAIL_PASSWORD}`,
            }
        })

        const mailOptions = {
            from: "sumathijayapaal@gmail.com",
            to: `${mail.email}`,
            subject:"Link To Rest Password",
            text:
            "you ar receiving this you requested to reset of the password.\n.\n"
            +"http://localhost:3001/passwordreset"
        }
        console.log("sending mail")

        transporter.sendMail(mailOptions), (err, response) => {
            if(err){
                console.error("there was an error:", err)
            }else{
                console.log("here is the res:", response)
                res.status(200).json("recovery email sent")
            }
        }
        res.send("passwordresetflow")
}catch(err){
    console.log("error in posting data", err)
}
})


app.listen(process.env.PORT || PORT,() => {
    console.log("Server is running @ " + PORT)
})