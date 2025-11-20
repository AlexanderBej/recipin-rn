import * as Clipboard from 'expo-clipboard';
import { useCallback, useState } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  }, []);

  return { copy, copied };
};
