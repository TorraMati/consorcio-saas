export class CreateReservationDTO {
  constructor({ amenity_id, date, start_time, end_time, tenant_id, user_id }) {
    this.amenity_id = amenity_id;
    this.date = date; // formato "2026-03-10"
    this.start_time = start_time; // formato "10:00"
    this.end_time = end_time; // formato "11:00"
    this.tenant_id = tenant_id;
    this.user_id = user_id;
  }
}