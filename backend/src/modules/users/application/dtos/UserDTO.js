export class CreateUserDTO {
  constructor({ email, password, first_name, last_name, phone, role, tenant_id }) {
    this.email = email?.trim().toLowerCase();
    this.password = password;
    this.first_name = first_name?.trim();
    this.last_name = last_name?.trim();
    this.phone = phone?.trim() || null;
    this.role = role;
    this.tenant_id = tenant_id;
  }
}

export class UpdateUserDTO {
  constructor({ first_name, last_name, phone, is_active }) {
    if (first_name) this.first_name = first_name.trim();
    if (last_name) this.last_name = last_name.trim();
    if (phone) this.phone = phone.trim();
    if (is_active !== undefined) this.is_active = is_active;
  }
}