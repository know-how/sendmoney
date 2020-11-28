const keys = require('../config/keys');
///new user account
const newUserSignup = ({ name, email, _id }) => {
    const uid_link = `${process.env.DOMAIN}/users/${_id}`
    const template = {
      from: `${name}<${email}>`,
      to: process.env.EMAIL,
      subject: `${name} - New Account Request`,
      text: `A new user has signed up.\r\nName: ${name}\r\n${uid_link}`,
      html: `<p>A new user has signed up.</p><p>Name: ${name}</p><p><a href="${uid_link}">${uid_link}</a></p>`
    }
  
    return template
}

const userAccepted = ({ name, email, _id }) => {
    const uid_link = `${process.env.DOMAIN}/users/${_id}`
    const template = {
      from: process.env.EMAIL,
      to: `${name}<${email}>`,
      subject: `${name} - An account h`,
      text: `Please note that an account has been created .\r\n agentCode: ${name}\r\n${uid_link}`,
      html: `<p>A new user has signed up.</p><p>Name: ${name}</p><p><a href="${uid_link}">${uid_link}</a></p>`
    }
  
    return template
}

  ///new auction
  const changePassword = ({ name, email, resetCode }) => {
    const uid_link = `${process.env.LOCALHOST}/shared/view-auctions`
    const template = {
      from: `SendMoney <${keys.mail.user}>`,
      to: 'knowhowkwaramba@gmail.com',//process.env.EMAIL,
      subject: `${name} - Reseting Password`,
      text: `Reset password Code is : .\r\n ${resetCode}`,
      html: `<p>Reset password code is:</p><p> ${resetCode}</p>`
    }
  
    return template
  }

  const newTransactionMailer = (data) => {
    const uid_link = `${process.env.LOCALHOST}/shared/view-auction?auction_id=data.id`
    const template = {
      from: `Swaggify <${keys.mail.user}>`,
      to: `${data.email}`,//process.env.EMAIL,
      subject: `New transaction`,
      text: `${data.msg} .\r\nName: ${data.auction_name}\r\n${uid_link}`,
      html: `<p>${data.msg}.</p><p>Auction name: ${data.auction_name}</p><p><a href="${uid_link}">Click me to visit swaggify auction</a></p>`
    }
  
    return template
  }
  
  module.exports = {
    changePassword,
    newTransactionMailer,
    newUserSignup,
  }
  
