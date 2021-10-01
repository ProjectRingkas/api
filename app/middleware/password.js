const bcrypt = require("bcrypt");

module.exports = {
  encrypt: async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  },
  compare: async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
  },
  createOTP: () => {
    return Math.floor(100000 + Math.random() * 900000)
  }
}