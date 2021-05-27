const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ADDRESS,
        subject: 'Welcome to the app!',
        text: `welcome to the app ${name}. Let me know how you're get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_ADDRESS,
        subject: 'Sorry to see you go...',
        text: `Dear ${name}, sorry to see you go. Hope to see you soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}