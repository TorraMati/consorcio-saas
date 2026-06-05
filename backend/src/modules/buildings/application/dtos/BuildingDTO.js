export class CreateBuildingDTO {
  constructor({ unit_number, floor, owner_id, tenant_user_id, tenant_id }) {
    this.unit_number = unit_number?.trim();
    this.floor = floor?.trim() || null;
    this.owner_id = owner_id || null;
    this.tenant_user_id = tenant_user_id || null;
    this.tenant_id = tenant_id;
  }
}

export class UpdateBuildingDTO {
  constructor({ unit_number, floor, owner_id, tenant_user_id, is_active }) {
    if (unit_number) this.unit_number = unit_number.trim();
    if (floor) this.floor = floor.trim();
    if (owner_id !== undefined) this.owner_id = owner_id;
    if (tenant_user_id !== undefined) this.tenant_user_id = tenant_user_id;
    if (is_active !== undefined) this.is_active = is_active;
  }
}