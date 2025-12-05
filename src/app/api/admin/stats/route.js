import { connectDB } from "@/lib/mongodb";
import Volunteer from "@/models/Volunteer";
import Photo from "@/models/PhotoGallery";
import Video from "@/models/VideoGallery";
import Donation from "@/models/Donation";
import Resource from "@/models/Resource";
import Contact from "@/models/Contact";
import { apiHandler, successResponse } from "@/lib/api-utils";
import { withAdminAuth } from "@/middleware/adminAuth";

const getStats = async (req) => {
    await connectDB();

    const [
        volunteerCount,
        pendingVolunteerCount,
        photoCount,
        videoCount,
        resourceCount,
        recentVolunteers,
        donationStats,
        recentDonations,
        unreadContactsCount
    ] = await Promise.all([
        Volunteer.countDocuments({}),
        Volunteer.countDocuments({ status: "pending" }),
        Photo.countDocuments({}),
        Video.countDocuments({}),
        Resource.countDocuments({}),
        Volunteer.find({}).sort({ createdAt: -1 }).limit(5).lean(),
        Donation.aggregate([
            { $match: { status: "payment_success" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        Donation.find({ status: "payment_success" }).sort({ createdAt: -1 }).limit(5).lean(),
        Contact.countDocuments({ status: "new" })
    ]);

    return successResponse({
        counts: {
            volunteers: volunteerCount,
            pendingVolunteers: pendingVolunteerCount,
            photos: photoCount,
            videos: videoCount,
            resources: resourceCount,
            totalDonations: donationStats[0]?.total || 0,
            unreadContacts: unreadContactsCount
        },
        recentActivity: {
            volunteers: recentVolunteers,
            donations: recentDonations
        }
    });
};

export const GET = withAdminAuth(apiHandler(getStats));
