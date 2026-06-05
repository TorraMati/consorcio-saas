export class ConfigureInterestDTO {
  constructor({ is_enabled, percentage, grace_days }) {
    this.is_enabled = is_enabled ?? false;
    this.percentage = parseFloat(percentage) || 0;
    this.grace_days = parseInt(grace_days) || 0;
  }
}