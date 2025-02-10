import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const verifySignature = (orderId, paymentId, signature) => {
    const keySecret = process.env.RAZORPAY_SECRET_ID;

    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(orderId + "|" + paymentId)
        .digest("hex");

    return expectedSignature === signature;
};

export async function POST(request) {
    try {
        const { orderId, razorpayPaymentId, razorpaySignature } =
            await request.json();

        if (!verifySignature(orderId, razorpayPaymentId, razorpaySignature)) {
            return NextResponse.json(
                { message: "Payment verification failed", isOk: false },
                { status: 400 }
            );
        }

        // Store successful payment in DB (if needed)

        return NextResponse.json(
            { message: "Payment verified successfully", isOk: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
