import prisma from "../db.js";

export const createRequest = async (req, res) => {
  try {

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body missing",
      });
    }

    const {
      patientName,
      bloodGroup,
      hospital,
      city,
      unitsRequired,
    } = req.body;

    const request = await prisma.bloodRequest.create({
      data: {
        patientName,
        bloodGroup,
        hospital,
        city,
        unitsRequired,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      request,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.bloodRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            bloodGroup: true,
            city: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await prisma.bloodRequest.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bloodRequest.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Request deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};