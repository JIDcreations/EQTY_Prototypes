import { useCallback, useRef, useState } from 'react';

export default function useToast(timeoutMs = 1600) {
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  const show = useCallback(
    (nextMessage = 'Saved') => {
      setMessage(nextMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setMessage(''), timeoutMs);
    },
    [timeoutMs]
  );

  const hide = useCallback(() => {
    setMessage('');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    message,
    visible: Boolean(message),
    show,
    hide,
  };
}
