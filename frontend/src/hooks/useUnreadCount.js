import { useEffect, useState } from 'react';
import client from '../api/client';

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    client.get('/notifications/unread-count')
      .then(res => setCount(res.data.count))
      .catch(() => setCount(0));

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      client.get('/notifications/unread-count')
        .then(res => setCount(res.data.count))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return count;
}