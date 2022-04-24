var Email = require("../models/email.model");

var nodemailer = require("nodemailer");
var mongoose = require("mongoose");

// Login with admin email
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "noreplytechcompany@gmail.com",
    // pass: "0933997980",
    clientId:
      "793985566124-i7v2tb11i21rfsqel8an89596mahctaa.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken:
      "1//04GVL0Pjcc-BwCgYIARAAGAQSNwF-L9Ir_mEmDdncq3SqhQzGaVuOqVN9rcqy7nPehoiLFNPX7-2Ja5ANUtqhpLL6W3xlokhNdOk",
    accessToken:
      "ya29.A0ARrdaM8OKkgrulRZxs__Q4JrrVUE1-t6LMmIBn8_UZD67Ld4z93O5Pmr8bUY6uo-EAgMollArzW3bBOQwwdh5Jfpvgo3vc_mxgqCsCsjY0V8uLJsPLPMiaq8s3cYL7i_HpCqNYlfgE6MvMibasoHqS2kDh0B",
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Kết nối thành công!");
  }
});
module.exports.index = async function (req, res) {
  console.log("check");

  Email.findOneAndUpdate(
    { _id: req.params.idUser, "sendedEmail.emailId": req.params.idEmail },
    {
      $set: {
        "sendedEmail.$.isSeen": true,
      },
    },
    function (error) {
      if (error) {
        console.log(error);
      }
    }
  );

  var emailList = await Email.find();

  res.send(emailList);
};
module.exports.list = async function (req, res) {
  var email = await Email.find();
  res.json(email);
};
module.exports.info = function (req, res) {
  var id = req.params.id;
  Email.findById({ _id: id }).then(function (email) {
    res.json(email);
  });
};
module.exports.updateEmail = function (req, res) {
  var id = req.params.id;
  Email.findByIdAndUpdate(id, req.body, function (error) {
    if (error) {
      console.log(error);
    }
  });
  res.status(200).send("ok");
};
module.exports.postEmail = async function (req, res) {
  var email = req.body.subscriber;
  var emailData = await Email.findOne({ subscriberEmail: email });
  if (emailData) {
    return res.status(400).send("Email already subscriber!");
  }
  await Email.create({
    subscriberEmail: email,
    sendedEmail: [
      {
        emailId: new mongoose.mongo.ObjectId(),
        isSeen: false,
      },
    ],
  });

  var mailOptions = {
    from: "18521118@gm.uit.edu.vn",
    to: email,
    subject: "Cảm ơn bạn đã đăng kí nhận tin mới tại SOBER shop",
    text: "Cảm ơn bạn đã đăng kí nhận tin mới tại SOBER shop",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.status(200).send("Subscriber for news successful!");
};
module.exports.deleteSubscriber = async function (req, res) {
  await Email.findByIdAndRemove({ _id: req.body.id });
  res.status(200).send("ok");
};
