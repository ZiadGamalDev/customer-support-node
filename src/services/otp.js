import crypto from "crypto";

const otp = {
  generate(length = 6, minutes = 10) {
    return {
      code: this.generateCode(length),
      expiry: this.generateExpiry(minutes),
    }
  },

  generateCode(length = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  },

  generateExpiry(minutes = 10) {
    return new Date(Date.now() + minutes * 60 * 1000);
  },

  isExpired(expiry) {
    return new Date() > expiry;
  },
};

export default otp;
