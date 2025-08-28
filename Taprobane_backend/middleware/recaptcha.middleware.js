const axios = require("axios");

function verifyRecaptcha(required = true) {
  return async (req, res, next) => {
    try {
      // ng-recaptcha will send the token in this field (make sure frontend passes it)
      const token =
        req.body?.captchaToken || req.body?.["g-recaptcha-response"];

      if (!token) {
        if (!required) return next();
        return res.status(400).json({ message: "Captcha token missing" });
      }

      const secret = process.env.RECAPTCHA_SECRET_KEY;
      if (!secret) {
        // Safer default: fail if not configured
        return res
          .status(500)
          .json({ message: "Captcha server not configured" });
      }

      const { data } = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret,
            response: token,
            remoteip: req.ip, // optional
          },
          timeout: 8000,
        }
      );

      if (!data?.success) {
        return res.status(400).json({
          message: "Captcha verification failed",
          errorCodes: data?.["error-codes"] || [],
        });
      }

      next();
    } catch (err) {
      console.error("reCAPTCHA verify error:", err?.message || err);
      return res
        .status(502)
        .json({ message: "Captcha verification error. Try again." });
    }
  };
}

module.exports = verifyRecaptcha;
