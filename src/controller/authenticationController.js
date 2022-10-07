const User = require("../model/userModel")
const bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")
const { ValidToken } = require("../config/commonFunction")
const { verifyEmailSend } = require("../config/commonFunction")
const { OAuth2Client } = require("google-auth-library")
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT)
const Wallet = require("../model/walletModel")


exports.registerController = async (req, res) => {
  try {
    let { email, password } = req.body
    email = email.toLowerCase()
    let otp = Math.floor(100000 + Math.random() * 900000)
    User.findOne({ email: email }).then(async (result) => {
      if (result) {
        res.send({ success: false, message: "Email already exist" })
      } else {
        let token = createJwtToken(email, "")
        let hashPassword = await bcrypt.hash(password, 10)
        let isMailSend = await verifyEmailSend(otp, email)
        if (isMailSend) {
          await User.create({ email: email, otp: otp, password: hashPassword, type: "email/password" }).then(async (result) => {
            if (result) {

              res.send({ success: true, message: "register successfully", token: token, isVerify: false })
              await Wallet.create({ userId: result._id, "coins": { coin: "USDT", coinCount: 100 } })
            }
          })
            .catch((err) => {
              res.send({ success: false, message: err.message })
            })
        } else {
          res.send({ success: false, message: err.message })
        }
      }
    })
  } catch (error) {
    res.send({ success: false, message: err.message })
  }
}
exports.googleRegisterController = (req, res) => {
  try {
    let { token } = req.headers
    googleAuthentication(token, res)
  } catch (err) {
    res.status(400).send({ error_message: err.message })
  }
}

exports.googleLoginController = async (req, res) => {
  try {
    let { token } = req.headers
    let otp = Math.floor(100000 + Math.random() * 900000)
    await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT })
      .then((result) => {
        const { email } = result.getPayload()
        User.findOne({ email: email })
          .then(async (result) => {
            if (result) {
              let token = createJwtToken(result.email, result._id)
              res.send({
                success: true,
                message: "login successfully",
                token: token,
              })
            } else {
              await User.create({
                type: "google",
                email,
                isEmailVerified: false,
                otp: otp,
              })
                .then(async (Data) => {
                  await User.findOne({ email: email }).then(async (result) => {
                    if (result) {
                      if (result.isEmailVerified === false) {
                        await verifyEmailSend(otp, email)
                      }
                    }
                  })
                  let token = createJwtToken(Data.email, Data._id)
                  res.send({
                    success: true,
                    message: "success",
                    token: token,
                  })
                })
                .catch((err) => {
                  res.send({ success: false, message: err.message })
                })
            }
          })
          .catch((err) => {
            res.send({ success: false, message: err.message })
          })
      })
      .catch(() => {
        res.send({ success: false, message: "google token is expired" })
      })
  } catch (error) {
    res.send({ success: false, message: error.message })
  }
}

exports.loginController = (req, res) => {
  try {
    let { email, password } = req.body
    email = email.toLowerCase()
    let otp = Math.floor(100000 + Math.random() * 900000)
    User.findOne({ email: email })
      .then(async (Data) => {
        if (Data) {
          // email found and check password
          if (Data.password) {
            let isValidPassword = await bcrypt.compare(
              password,
              Data.password
            )
            if (isValidPassword) {
              let token = createJwtToken(Data.email, Data._id)

              let isMailSend = await verifyEmailSend(otp, Data.email, Data.username)
              if (isMailSend) {
                User.findOneAndUpdate({ email: Data.email }, { otp: otp })
                  .then(() => {
                    res.send({
                      success: true,
                      message: "login successfully",
                      token: token,
                      isVerify: false,
                    })
                  })
                  .catch((err) => {
                    res.send({ success: false, message: err.message })
                  })
              } else {
                res.send({
                  success: false,
                  error_message: "Something wrong,please try again later",
                })
              }

            } else {
              res.send({ success: false, message: "Invalid password" })
            }
          } else {
            res.send({
              success: false,
              error_message: "Please try with google login",
            })
          }
        } else {
          res.send({ success: false, message: "Please register first" })
        }
      })
      .catch((err) => {
        res.send({ success: false, message: err.message })
      })
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.verifyOtpController = async (req, res) => {
  try {
    let { token } = req.headers
    const { phoneOtp, type } = req.body
    const tokenData = ValidToken(token)
    let updateObject
    if (type === "phone") {
      updateObject = { isPhoneVerified: true, phoneOtp: 0 }
      User.findOneAndUpdate(
        { email: tokenData.data.email, phoneOtp: phoneOtp },
        updateObject
      )
        .then((result) => {
          if (result) {
            let token = createJwtToken(result.email, result._id);
            res.send({
              success: true,
              message: "success",
              token: token,
              isVerify: true,
            });
          } else {
            res.send({ success: false, message: "Invalid otp" });
          }
        })
        .catch((err) => {
          res.send({ success: false, message: err.message });
        });
    } else {
      updateObject = {
        isEmailVerified: true,
        otp: 0
      }
      User.findOneAndUpdate(
        { email: tokenData.data.email, otp: otp },
        updateObject
      )
        .then((result) => {
          if (result) {
            res.send({
              success: true,
              message: "success",
              token: token,
              isVerify: true,
              data: data,
            })
          } else {
            res.send({ success: false, message: "Invalid otp" })
          }
        })
        .catch((err) => {
          res.send({ success: false, message: err.message })
        })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.forgotPasswordController = async (req, res) => {
  try {
    let { email } = req.body
    email = email.toLowerCase()
    var isUserAvailable = await User.findOne({ email: email })
    let token = await createJwtToken(email, "")
    let forgotLink = process.env.FRONTEND_URL + "reset?token=" + token
    if (isUserAvailable) {
      var mailOptions = {
        from: "youremail@gmail.com",
        to: email,
        subject: "Email verification code",
        html: `<p>Forgot password link <a href=${forgotLink}>Click me<a></p>`,
      }
      await transporter.sendMail(
        mailOptions,
        function (error, info) {
          if (error) {
            res.send({ success: false, message: error })
          } else {
            res.send({
              success: true,
              message: "Please check your email for password change",
            })
          }
        }
      )
    } else {
      res.send({ success: false, message: "Email is not available" })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.resetPasswordController = async (req, res) => {
  try {
    let { token } = req.headers
    const { password } = req.body
    const tokenData = await ValidToken(token)
    if (tokenData) {
      let hashPassword = await bcrypt.hash(password, 10)
      User.findOneAndUpdate(
        { email: tokenData.data.email },
        { password: hashPassword }
      )
        .then(() => {
          res.send({ success: true, message: "success" })
        })
        .catch((err) => {
          res.send({ success: false, message: err.message })
        })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.sendPhoneVerificationCodeController = async (
  req,
  res
) => {
  try {
    const { phoneNumber } = req.body
    const { token } = req.headers
    let countryCode = "+91"
    const tokenData = await ValidToken(token)
    if (tokenData) {

      let otp = Math.floor(100000 + Math.random() * 900000)

      User.findOneAndUpdate(
        { email: tokenData.data.email },
        { phoneOtp: otp, countryCode, phoneNumber }
      )
        .then(() => {
          res.send({ success: true, message: "OTP sent to registered mobile number" })
        })
        .catch((err) => {
          res.send({ success: false, message: err.message })
        })
    } else {
      res.send({ success: false, message: "user not found" })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.detailsController = async (req, res) => {
  try {
    const { token } = req.headers
    const { username, source, referCode, userType } = req.body
    const tokenData = ValidToken(token)
    if (tokenData) {
      await User.findOne({ email: tokenData.data.email, username: username }).then((result) => {
        if (result) {
          res.send({ success: false, message: "Username already exists ,please try another Username" })
        }
        else {
          User.findOneAndUpdate({ email: tokenData.data.email }, {
            username: username, referCode: referCode, source: source, userType
          }).then(() => {
            res.send({ success: true, message: "details added successfully" })
          }).catch((err) => {
            res.send({ success: false, message: err.message })
          })
        }
      })
    } else {
      res.send({ success: false, message: "user not found" })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

// let s = "savan"
// let k = "key"
// let k2 = "key2"

// let token = jwt.sign({ data: { s: "savan" } }, k)
// console.log("token", token);

// let token2 = jwt.sign({ data: { s: token } }, k2)
// console.log("token2", token2);

// let decrypt = jwt.verify(token2, k)
// console.log("decrypt", decrypt);

// let decrypt2 = jwt.verify(decrypt.data.s, k)
// console.log("decrypt2", decrypt2);

exports.APIkeysController = async (req, res) => {
  try {
    const { token } = req.headers
    const { accountName, key, secret } = req.body
    const tokenData = ValidToken(token)
    if (tokenData) {
      let encryptedKey = await doubleEncryption(key, tokenData.data.email)
      let encryptedSecret = await doubleEncryption(secret, tokenData.data.email)
      User.findOneAndUpdate({ email: tokenData.data.email }, {
        accountName, key: encryptedKey, secret: encryptedSecret
      }).then(() => {
        res.send({ success: true, message: "credentials added successfully" })
      }).catch((err) => {
        res.send({ success: false, message: err.message })
      })
    } else {
      res.send({ success: false, message: "user not found" })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.progressStepController = async (req, res) => {
  try {
    const { token } = req.headers
    const { step } = req.body
    const tokenData = ValidToken(token)
    if (tokenData) {
      User.findOneAndUpdate({ email: tokenData.data.email }, { registerProgressStep: step }).then(() => {
        res.send({ success: true })
      }).catch((err) => {
        res.send({ success: false, message: err.message })
      })
    } else {
      res.send({ success: false, message: "user not found" })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}


exports.getCompletedStepController = async (req, res) => {
  try {
    const { token } = req.headers
    const tokenData = ValidToken(token)
    if (tokenData) {
      User.findOne({ email: tokenData.data.email }).then((result) => {
        res.send({ step: result.registerProgressStep, success: true })
      }).catch((err) => {
        res.send({ success: false, message: err.message })
      })
    } else {
      res.send({ success: false, message: "user not found" })
    }
  } catch (err) {
    res.send({ success: false, message: err.message })
  }
}

exports.imgUploder = (req, res) => {
  try {
    let imgURL = null
    if (req.file) {
      imgURL = `uploads/${req.file.filename}`
    }
    let { username, bio } = req.body
    User.findOneAndUpdate({ username: username }, { image: imgURL, bio: bio }).then((result) => {
      res.send({ success: true, message: "profile updated successfully" })
    }).catch((err) => {
      res.send({ success: false, message: err.message })
    })
  } catch (error) {
    res.send({ success: false, message: error.message })

  }

}
//comman functions
const createJwtToken = (email, id) => {
  return jwt.sign({ data: { email: email, id: id } }, "this is secret key", {
    expiresIn: 60 * 60 * 60,
  })
}

const doubleEncryption = async (keys, secretKey) => {
  let encryption1 = jwt.sign({ data: { key: keys } }, secretKey, { expiresIn: 60 * 60 * 60, })
  let encryption2 = jwt.sign({ data: { key: encryption1 } }, secretKey, { expiresIn: 60 * 60 * 60, })
  return encryption2
}

const googleAuthentication = async (
  token,
  res
) => {
  try {
    let otp = Math.floor(100000 + Math.random() * 900000)
    googleClient
      .verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT,
      })
      .then((result) => {
        const { email } = result.getPayload()
        User.findOne({ email: email })
          .then(async (result) => {
            if (result) {
              res.status(200).send({
                success: false,
                message: "email already registered.",
              })
            } else {
              await User.create({
                type: "google",
                email,
                isEmailVerified: false,
                otp: otp,
              })
                .then(async (Data) => {
                  let isMailSend = await verifyEmailSend(otp, email)
                  if (isMailSend) {
                    let token = createJwtToken(Data.email, Data._id)
                    res.status(201).send({
                      success: true,
                      message: "register successfull.",
                      token: token,
                    })
                  }
                })
                .catch((err) => {
                  res.status(404).send({
                    error_message: err.message,
                  })
                })
            }
          })
          .catch((err) => {
            res.status(404).send({
              error_message: err.message,
            })
          })
      })
      .catch(() => {
        res.send({
          error_message: "google token is expired",
        })
      })
  } catch (err) {
    res.status(400).send({ error_message: err.message })
  }
}