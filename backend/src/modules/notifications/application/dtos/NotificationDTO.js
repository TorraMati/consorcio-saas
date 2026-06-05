export class CreateNotificationDTO {
  constructor({ tenant_id, user_id, type, title, message, channel }) {
    this.tenant_id = tenant_id;
    this.user_id = user_id;
    this.type = type;
    this.title = title;
    this.message = message;
    this.channel = channel || 'in_app';
  }
}