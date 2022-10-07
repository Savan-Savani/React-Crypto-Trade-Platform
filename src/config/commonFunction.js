var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
const ejs = require('ejs')
const path = require('path')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv')
dotenv.config();


exports.ValidToken = (token) => {
    let data = jwt.verify(token, 'this is secret key')
    return data
}

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken =
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                console.log("error", err);
            }
            return token
        })

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};

exports.verifyEmailSend = async (otp, email, username) => {
    let data

    //for registration
    if (username) {
        data = await ejs.renderFile(path.join(__dirname + '/emailTemplates/loginOtpMail.ejs'), { OTP: otp, subject: "email verification", username: username })
    } else {
        data = await ejs.renderFile(path.join(__dirname + '/emailTemplates/registerOtpMail.ejs'), { OTP: otp, subject: "email verification", username: email })
    }


    const sendEmail = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        emailTransporter.sendMail(emailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("Email sent: " + info.response)
            }
        });
    };
    sendEmail({
        subject: "Email verification code",
        html: data,
        to: email,
        from: "youremail@gmail.com",
    });

    return true
}

exports.infoEmailSend = async (email, username, coin, coinCount, action, error) => {
    let data
    if (error === "error") {
        data = await ejs.renderFile(path.join(__dirname + '/emailTemplates/orderFailedMail.ejs'), { username: username, coin: coin, amount: coinCount, action: action })
    } else {
        data = await ejs.renderFile(path.join(__dirname + '/emailTemplates/orderDetailMail.ejs'), { username: username, coin: coin, amount: coinCount, action: action })
    }

    var mailOptions = {
        from: "youremail@gmail.com",
        to: email,
        subject: "Email verification code",
        html: data,
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log("Email sent: " + info.response)
        }
    })
    return true
}