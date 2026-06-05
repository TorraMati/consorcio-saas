export class CreateExpenseDTO {
  constructor({ building_id, amount, period, due_date, tenant_id }) {
    this.building_id = building_id;
    this.amount = parseFloat(amount);
    this.period = period; // formato "2026-03"
    this.due_date = due_date; // formato "2026-03-10"
    this.tenant_id = tenant_id;
  }
}

export class UpdateExpenseDTO {
  constructor({ amount, due_date, status }) {
    if (amount) this.amount = parseFloat(amount);
    if (due_date) this.due_date = due_date;
    if (status) this.status = status;
  }
}