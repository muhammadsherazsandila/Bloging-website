import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h", // Token will expire in 24 hours
      algorithm: "HS256", // Using HMAC SHA-256 algorithm
    }
  );
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export { generateToken, verifyToken };
