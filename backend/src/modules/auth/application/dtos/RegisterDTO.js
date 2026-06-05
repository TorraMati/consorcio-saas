export class RegisterDTO {
  constructor({ email, password, first_name, last_name, phone, role, tenant_id }) {
    this.email = email?.trim().toLowerCase();
    this.password = password;
    this.first_name = first_name?.trim();
    this.last_name = last_name?.trim();
    this.phone = phone?.trim() || null;
    this.role = role;
    this.tenant_id = tenant_id || null;
  }
}