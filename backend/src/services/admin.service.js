import { ApiError } from "../utils/api-error.js";
import * as repository from "../repositories/admin.repository.js";

function parsePositiveInteger(value, fieldName) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer`);
  }
  return number;
}

function getPagination(query) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));
  return { page, limit, offset: (page - 1) * limit };
}

function withPagination(result, page, limit) {
  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.max(1, Math.ceil(result.total / limit)),
    },
  };
}

export function getDashboard() {
  return repository.fetchDashboard();
}

export async function getUsers(query) {
  const { page, limit, offset } = getPagination(query);
  const result = await repository.findUsers({
    search: query.search,
    role: query.role,
    status: query.status,
    limit,
    offset,
  });
  return withPagination(result, page, limit);
}

export async function updateUserStatus(id, statusValue) {
  const userId = parsePositiveInteger(id, "User ID");
  const status = String(statusValue || "").toLowerCase();

  if (!['active', 'suspended'].includes(status)) {
    throw new ApiError(400, "Status must be active or suspended");
  }

  const user = await repository.changeUserStatus(userId, status);
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

export async function getWorkers(query) {
  const { page, limit, offset } = getPagination(query);
  const result = await repository.findWorkers({
    search: query.search,
    status: query.status,
    limit,
    offset,
  });
  return withPagination(result, page, limit);
}

export async function changeWorkerVerification(id, status, reason) {
  const workerId = parsePositiveInteger(id, "Worker ID");
  const cleanReason = String(reason || "").trim();

  if (status === "rejected" && !cleanReason) {
    throw new ApiError(400, "A rejection reason is required");
  }

  const worker = await repository.changeWorkerVerification({
    workerId,
    status,
    reason: cleanReason || null,
  });

  if (!worker) throw new ApiError(404, "Worker not found");
  return worker;
}

export async function getBookings(query) {
  const { page, limit, offset } = getPagination(query);
  const result = await repository.findBookings({
    search: query.search,
    status: query.status,
    city: query.city,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    limit,
    offset,
  });
  return withPagination(result, page, limit);
}

export function getServices() {
  return repository.findServices();
}

export async function toggleService(id) {
  const serviceId = parsePositiveInteger(id, "Service ID");
  const serviceRecord = await repository.toggleService(serviceId);
  if (!serviceRecord) throw new ApiError(404, "Service not found");
  return serviceRecord;
}

export function getCommission() {
  return repository.readCommission();
}

export async function updateCommission(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new ApiError(400, "Commission must be between 0 and 100");
  }
  return repository.saveCommission(rate);
}
