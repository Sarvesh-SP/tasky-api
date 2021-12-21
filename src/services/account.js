require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const sendGrid = process.env.SG_KEY;

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

const cancelEmail = (email, name) => {
	const msg = {
		to: email,
		from: process.env.EMAIL,
		subject: "What happend?",
		text: `Hey, ${name}. Let me know what made you stop using our service, so that we could make it better.🤦‍♂️`,
		html: `<h1>What happend ${name}🤷‍♀️</h1>
    <p>Hey, ${name}. Let me know what made you stop using our service, so that we could make it better.</p>
    <p>GoodBye ${name}😢, We gonna miss ya😭</p>`,
	};

	sgMail
		.send(msg)
		.then(() => console.log("Email Sent"))
		.catch((error) => console.error(error));
};

module.exports = { sendEmail, cancelEmail };
