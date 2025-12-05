import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { withAdminAuth } from "@/middleware/adminAuth";

async function handler(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // pending, payment_success, payment_failed
        const minAmount = searchParams.get("minAmount");
        const maxAmount = searchParams.get("maxAmount");
        const period = searchParams.get("period"); // weekly, monthly, yearly, total
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const query = {};

        // Status Filter
        if (status && status !== "all") {
            query.status = status;
        }

        // Amount Filter
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseFloat(minAmount);
            if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
        }

        // Date Filter (Period)
        if (period && period !== "total") {
            const now = new Date();
            let startDate = new Date();

            if (period === "weekly") {
                startDate.setDate(now.getDate() - 7);
            } else if (period === "monthly") {
                startDate.setMonth(now.getMonth() - 1);
            } else if (period === "yearly") {
                startDate.setFullYear(now.getFullYear() - 1);
            }

            query.createdAt = { $gte: startDate };
        }

        const skip = (page - 1) * limit;

        const [donations, totalCount] = await Promise.all([
            Donation.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Donation.countDocuments(query),
        ]);

        // Calculate Summary Stats (based on current filters)
        // We might want stats for the *entire* dataset or just the filtered one.
        // Usually dashboard stats are global, but "filters... then total" suggests filtered totals.
        // Let's aggregate the total amount for the current query.
        const statsAggregation = await Donation.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]);

        const summary = statsAggregation[0] || { totalAmount: 0, count: 0 };

        return NextResponse.json({
            success: true,
            data: donations,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: Math.ceil(totalCount / limit),
            },
            summary: {
                totalAmount: summary.totalAmount,
                count: summary.count,
            },
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}

export const GET = withAdminAuth(handler);
