import prisma from "../db.js";

const MAX_RESULTS = 50;

export const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    const where = {};

    if (bloodGroup) {
      where.bloodGroup = bloodGroup;
    }

    if (city) {
      where.city = {
        equals: city,
        mode: "insensitive",
      };
    }

    const donors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        bloodGroup: true,
        city: true,
      },
      take: MAX_RESULTS,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      donors,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to search donors",
    });
  }
};