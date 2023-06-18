const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  const messgae = {
    to: email,
    from: "mauryavikash922@gmail.com",
    subject: "Welcome to Task Manager app",
    text: `Its good to have onboard you ${name} on task manager , lets manage your task `,
  };
  sgMail.send(messgae);
};
const sendFarewellEmail = (email, name) => {
  const messgae = {
    to: email,
    from: "mauryavikash922@gmail.com",
    subject: "Farewll form Task Manager app",
    text: `${name} its very that you'r no longer with our service . Please share your valuable feedback with us.`,
  };
  sgMail.send(messgae);
};

module.exports = {
  sendFarewellEmail,
  sendWelcomeEmail,
};
