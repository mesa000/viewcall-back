const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ---  Step 1: Request password recovery ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    
    const resetURL = `https://leaderflix-frontend.vercel.app/reset_password?token=${resetToken}`;
    //const resetURL = `http://localhost:5173/reset_password?token=${resetToken}`;
    
    const msg = {
      to: user.email,
      from: "nextstepoficioal@gmail.com", 
      subject: "Recuperación de contraseña",
      html: `
        <p>Has solicitado recuperar tu contraseña</p>
        <p>Haz clic aquí: <a href="${resetURL}">${resetURL}</a></p>
      `,
    };

    await sgMail.send(msg);
    res.json({ msg: "Se envió un email para recuperar tu contraseña" });
  } catch (err) {
    console.error("ForgotPassword error:", err.response?.body || err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// --- Step 2: Reset password ---
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Token inválido o expirado" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
