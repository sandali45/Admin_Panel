import { asyncHandler } from "../utils/async-handler.js";
import * as service from "../services/admin.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await service.getDashboard();
  res.json({ success: true, data });
});

export const getUsers = asyncHandler(async (req, res) => {
  const result = await service.getUsers(req.query);
  res.json({ success: true, ...result });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await service.updateUserStatus(
    req.params.id,
    req.body?.status
  );
  res.json({ success: true, message: "User status updated", data: user });
});

export const getWorkers = asyncHandler(async (req, res) => {
  const result = await service.getWorkers(req.query);
  res.json({ success: true, ...result });
});

export const approveWorker = asyncHandler(async (req, res) => {
  const worker = await service.changeWorkerVerification(
    req.params.id,
    "approved"
  );
  res.json({ success: true, message: "Worker approved", data: worker });
});

export const rejectWorker = asyncHandler(async (req, res) => {
  const worker = await service.changeWorkerVerification(
    req.params.id,
    "rejected",
    req.body?.reason
  );
  res.json({ success: true, message: "Worker rejected", data: worker });
});

export const getBookings = asyncHandler(async (req, res) => {
  const result = await service.getBookings(req.query);
  res.json({ success: true, ...result });
});

export const getServices = asyncHandler(async (req, res) => {
  const data = await service.getServices();
  res.json({ success: true, data });
});

export const toggleService = asyncHandler(async (req, res) => {
  const data = await service.toggleService(req.params.id);
  res.json({ success: true, message: "Service status updated", data });
});

export const getCommission = asyncHandler(async (req, res) => {
  const rate = await service.getCommission();
  res.json({ success: true, data: { commissionRate: rate } });
});

export const updateCommission = asyncHandler(async (req, res) => {
  const data = await service.updateCommission(req.body?.commissionRate);
  res.json({ success: true, message: "Commission updated", data });
});
