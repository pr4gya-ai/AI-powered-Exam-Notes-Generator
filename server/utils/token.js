import jwt from 'jsonwebtoken';

export const generateToken = async (userId)=> {
    try {
        // jwt.sign expects a plain object as payload
        const payload = { userId };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});
        console.log('Generated token:', token);
        return token;
    }
    catch (err) {
        console.error('Error generating token:', err);
        throw err; // rethrow so callers can handle
    }
}
