import User from "../../database/models/user.model.js";
import { compare, hash } from "../../utils/crypto.js";
import template from "../../utils/template.js";
import sendEmail from "../../services/email.js";
import otp from "../../services/otp.js";

class PasswordService {
  async sendResetEmail(email) {
    const user = await User.findOne({ email });

    user.otp = otp.generate();
    await user.save();

    const emailTemplate = template("email/password.otp.html").replace(
      "{{otp}}",
      user.otp.code
    );

    await sendEmail(user.email, "Your Password Reset OTP", emailTemplate);
  }

  async reset(email, otpCode, newPassword) {
    const user = await User.findOne({ email });

    if (!user.otp || user.otp.code !== otpCode) {
      throw new Error("Invalid OTP");
    }

    if (otp.isExpired(user.otp.expiry)) {
      throw new Error("OTP has expired");
    }

    user.password = await hash(newPassword);
    user.otp = undefined;
    await user.save();
  }

  async confirm(user, password) {
    if (!(await compare(password, user.password))) {
      throw new Error("Password is incorrect");
    }
  }

  async updatePassword(user, oldPassword, newPassword, confirmPassword) {
    if (!(await compare(oldPassword, user.password))) {
      throw new Error("Old password is incorrect");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Confirm password should match password");
    }

    user.password = await hash(newPassword);
    await user.save();
  }
}

export default new PasswordService();
