import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, message } = await req.json();

        console.log("Contact API received:", { name, email, message });

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Please provide all fields" },
                { status: 400 }
            );
        }

        const newContact = await Contact.create({
            name,
            email,
            message,
        });

        console.log("Contact saved:", newContact);

        return NextResponse.json(
            { success: true, message: "Message sent successfully", data: newContact },
            { status: 201 }
        );
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send message" },
            { status: 500 }
        );
    }
}
