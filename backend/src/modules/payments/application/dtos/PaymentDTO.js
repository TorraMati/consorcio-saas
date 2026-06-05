export class CreatePaymentDTO {
  constructor({ expense_id, method, tenant_id, user_id }) {
    this.expense_id = expense_id;
    this.method = method; // 'mercadopago' | 'transfer'
    this.tenant_id = tenant_id;
    this.user_id = user_id;
  }
}