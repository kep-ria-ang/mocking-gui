import { useCallback, useEffect, useRef, useState } from 'react';

type InlineCssModule = { default: string };

const loadMockingGUIStyles = async () => {
  const mod = (await import('../styles/index.css?inline')) as InlineCssModule;
  return mod.default;
};

export const useMockingGUIStyles = (isReady: boolean) => {
  const [isStyleLoading, setIsStyleLoading] = useState(false);
  const [styleText, setStyleText] = useState<string | undefined>(undefined);
  const styleLoadStartedRef = useRef(false);

  const ensureStyles = useCallback(async () => {
    if (styleLoadStartedRef.current) return;
    styleLoadStartedRef.current = true;
    setIsStyleLoading(true);
    try {
      setStyleText(await loadMockingGUIStyles());
    } finally {
      setIsStyleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady) void ensureStyles();
  }, [isReady, ensureStyles]);

  return { styleText, isStyleLoading };
};
