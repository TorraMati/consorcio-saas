export class CreateAmenityDTO {
  constructor({ name, description, capacity, open_time, close_time, slot_duration_minutes, tenant_id }) {
    this.name = name?.trim();
    this.description = description?.trim() || null;
    this.capacity = parseInt(capacity) || 1;
    this.open_time = open_time;
    this.close_time = close_time;
    this.slot_duration_minutes = parseInt(slot_duration_minutes) || 60;
    this.tenant_id = tenant_id;
  }
}

export class UpdateAmenityDTO {
  constructor({ name, description, capacity, open_time, close_time, slot_duration_minutes, is_active }) {
    if (name) this.name = name.trim();
    if (description !== undefined) this.description = description?.trim() || null;
    if (capacity) this.capacity = parseInt(capacity);
    if (open_time) this.open_time = open_time;
    if (close_time) this.close_time = close_time;
    if (slot_duration_minutes) this.slot_duration_minutes = parseInt(slot_duration_minutes);
    if (is_active !== undefined) this.is_active = is_active;
  }
}