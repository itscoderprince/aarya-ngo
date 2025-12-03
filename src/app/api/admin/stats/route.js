import { connectDB } from "@/lib/mongodb";
import Volunteer from "@/models/Volunteer";
import Photo from "@/models/PhotoGallery";
import Video from "@/models/VideoGallery";
import Resource from "@/models/Resource";
import { apiHandler, successResponse } from "@/lib/api-utils";
import { verifyToken, withAdminAuth } from "@/middleware/adminAuth";

const getStats = async (req) => {
    await connectDB();

    const [
        volunteerCount,
        pendingVolunteerCount,
        photoCount,
        videoCount,
        resourceCount,
        recentVolunteers
    ] = await Promise.all([
        Volunteer.countDocuments({}),
        Volunteer.countDocuments({ status: "pending" }),
        Photo.countDocuments({}),
        Video.countDocuments({}),
        Resource.countDocuments({}),
        Volunteer.find({}).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    return successResponse({
        counts: {
            volunteers: volunteerCount,
            pendingVolunteers: pendingVolunteerCount,
            photos: photoCount,
            videos: videoCount,
            resources: resourceCount,
        },
        recentActivity: {
            volunteers: recentVolunteers
        }
    });
};

export const GET = withAdminAuth(apiHandler(getStats));
