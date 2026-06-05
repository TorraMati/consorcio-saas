export function Badge({ status }) {
  const map = {
    pending:  <span className="badge-warning">Pendiente</span>,
    paid:     <span className="badge-success">Pagado</span>,
    overdue:  <span className="badge-danger">Vencido</span>,
    approved: <span className="badge-success">Aprobado</span>,
    rejected: <span className="badge-danger">Rechazado</span>,
    active:   <span className="badge-primary">Activo</span>,
    cancelled:<span className="badge-danger">Cancelado</span>,
  };
  return map[status] || <span className="badge-primary">{status}</span>;
}