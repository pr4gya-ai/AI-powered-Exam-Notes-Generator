import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            tlsAllowInvalidCertificates: true,
            retryWrites: true
        });
        console.log("DB connected");
    } catch (error) {
        console.log("DB connection error", error);
        process.exit(1);
    }
};

export default connectDb;