import { Inbox } from 'lucide-react';

export function EmptyState({ message = 'No hay datos para mostrar' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-textSecondary gap-3">
      <Inbox className="w-10 h-10 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}