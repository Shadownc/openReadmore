export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "USER";
  status: "ACTIVE" | "DISABLED";
};
