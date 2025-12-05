import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { withAdminAuth } from "@/middleware/adminAuth";

async function handler(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [contacts, total] = await Promise.all([
            Contact.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Contact.countDocuments({}),
        ]);

        return NextResponse.json({
            success: true,
            data: contacts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Admin Contacts API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

export const GET = withAdminAuth(handler);

export const PUT = withAdminAuth(async (req) => {
    try {
        await connectDB();
        // Mark all 'new' messages as 'read'
        await Contact.updateMany({ status: "new" }, { status: "read" });
        return NextResponse.json({ success: true, message: "All new messages marked as read" });
    } catch (error) {
        console.error("Admin Contacts Update Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update messages" },
            { status: 500 }
        );
    }
});
