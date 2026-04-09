export const ADMIN_PORTAL_ROLES = [
  "MANAGER",
  "STAFF_APARTMENT",
  "STAFF_SERVICE",
  "STAFF_SECURITY",
  "STAFF",
];

const STAFF_ROLES = [
  "STAFF_APARTMENT",
  "STAFF_SERVICE",
  "STAFF_SECURITY",
  "STAFF",
];

export const ADMIN_SECTION_ACCESS = {
  dashboard: ADMIN_PORTAL_ROLES,
  roles: ["MANAGER", "STAFF_APARTMENT"],
  residentAccount: ["MANAGER", "STAFF_APARTMENT"],
  accounts: ["MANAGER"],
  apartmentLayout: ["MANAGER", "STAFF_APARTMENT"],
  apartmentTypes: ["MANAGER", "STAFF_APARTMENT"],
  stayHistory: ["MANAGER", "STAFF_APARTMENT"],
  contracts: ["MANAGER", "STAFF_APARTMENT"],
  utilitiesInvoices: ["MANAGER", "STAFF_SERVICE"],
  services: ["MANAGER", "STAFF_SERVICE"],
  bookings: ["MANAGER", "STAFF_SERVICE"],
  serviceFees: ["MANAGER", "STAFF_SERVICE"],
  visitors: ["MANAGER", "STAFF_SECURITY"],
  news: ADMIN_PORTAL_ROLES,
  complaints: ADMIN_PORTAL_ROLES,
};

export const canAccessAdminSection = (role, sectionKey) => {
  const normalizedRole = String(role ?? "").toUpperCase();
  const allowedRoles = ADMIN_SECTION_ACCESS[sectionKey] ?? [];
  return allowedRoles.includes(normalizedRole);
};

export const isStaffPortalRole = (role) =>
  STAFF_ROLES.includes(String(role ?? "").toUpperCase());

export const canManageNews = (role) =>
  ADMIN_PORTAL_ROLES.includes(String(role ?? "").toUpperCase());

export const canReplyComplaints = (role) =>
  ADMIN_PORTAL_ROLES.includes(String(role ?? "").toUpperCase());

export const getDefaultAdminPath = (role) => {
  const normalizedRole = String(role ?? "").toUpperCase();

  switch (normalizedRole) {
    case "MANAGER":
      return "/admin";
    case "STAFF_APARTMENT":
      return "/admin/resident-account";
    case "STAFF_SERVICE":
      return "/admin/utilities-invoices";
    case "STAFF_SECURITY":
      return "/admin/visitors";
    case "STAFF":
      return "/admin/news";
    default:
      return "/";
  }
};
