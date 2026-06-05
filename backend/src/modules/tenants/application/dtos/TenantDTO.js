export class CreateTenantDTO {
  constructor({ name, address, cuit }) {
    this.name = name?.trim();
    this.address = address?.trim();
    this.cuit = cuit?.trim() || null;
    this.slug = name?.trim().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}

export class UpdateTenantDTO {
  constructor({ name, address, cuit, is_active }) {
    if (name) this.name = name.trim();
    if (address) this.address = address.trim();
    if (cuit) this.cuit = cuit.trim();
    if (is_active !== undefined) this.is_active = is_active;
  }
}