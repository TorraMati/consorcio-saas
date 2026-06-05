export class CreateUnitDTO {
  constructor({ unit_number, floor, percentage, owner_id, tenant_user_id, building_id, tenant_id }) {
    this.unit_number = unit_number?.trim();
    this.floor = floor?.trim() || null;
    this.percentage = percentage ? parseFloat(percentage) : 0;
    this.owner_id = owner_id || null;
    this.tenant_user_id = tenant_user_id || null;
    this.building_id = building_id;
    this.tenant_id = tenant_id;
  }
}

export class UpdateUnitDTO {
  constructor({ unit_number, floor, percentage, owner_id, tenant_user_id, is_active }) {
    if (unit_number) this.unit_number = unit_number.trim();
    if (floor !== undefined) this.floor = floor?.trim() || null;
    if (percentage !== undefined) this.percentage = parseFloat(percentage) || 0;
    if (owner_id !== undefined) this.owner_id = owner_id;
    if (tenant_user_id !== undefined) this.tenant_user_id = tenant_user_id;
    if (is_active !== undefined) this.is_active = is_active;
  }
}