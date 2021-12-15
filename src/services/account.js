const sgMail = require("@sendgrid/mail");

const sendGrid =
  "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";

sgMail.setApiKey(sendGrid);

const sendEmail = (email, name) => {
  const msg = {
    to: email,
    from: "sarvesh.18cs068@sode-edu.in",
    subject: "Thanks For Joining Tasky",
    text: `Welcome to the app ${name}. Let me know how you feel about the app.`,
    html: `<h1>Welcome to the app ${name}. Let me know how you feel about the app.</h1>`,
  };

  sgMail
    .send(msg)
    .then(() => console.log("Email Sent"))
    .catch((error) => console.error(error));
};

module.exports = { sendEmail };
