import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(req) {
    try {
        const { amount } = await req.json();

        if (!amount) {
            return NextResponse.json(
                { message: "Amount is required" },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
        });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
