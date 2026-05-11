import { PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { panelZIndex } from '@constants/zIndex';
import { createPortal } from 'react-dom';

import { ShadowContainerContext } from './shadowContext';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const ShadowRootPortal = (props: PropsWithChildren<{ styleText?: string }>) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<ShadowRoot | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    rootRef.current = root;

    let mount = root.querySelector('#mocking-gui-shadow-mount') as HTMLElement | null;
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'mocking-gui-shadow-mount';
      root.appendChild(mount);
    }

    mount.style.pointerEvents = 'auto';

    // Radix UI's DismissableLayer listens on `document` for outside-click detection.
    // In Shadow DOM, pointerdown events are retargeted to the shadow host when they
    // cross the boundary, breaking Radix's contains() check. Re-dispatch as a
    // composed event so document-level listeners receive the real composedPath.
    const bridgePointerDown = (e: Event) => {
      const pe = e as PointerEvent;
      // When clicking the trigger of an *already-open* Radix overlay (Select,
      // Popover, DropdownMenu…), skip re-dispatch so DismissableLayer doesn't
      // race with the trigger's own toggle handler (close → re-open → stuck open).
      // Only skip for open triggers (`data-state="open"`); clicking a *closed*
      // trigger must still be bridged so any currently-open overlay can dismiss.
      const isOpenRadixToggleTrigger = pe
        .composedPath()
        .some(
          el =>
            el instanceof Element &&
            el.getAttribute('data-state') === 'open' &&
            el.hasAttribute('aria-expanded'),
        );
      if (isOpenRadixToggleTrigger) return;

      const synth = new PointerEvent(pe.type, { ...pe, bubbles: true, composed: true });
      host.dispatchEvent(synth);
    };
    root.addEventListener('pointerdown', bridgePointerDown, { capture: true });

    const syncDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      mount.classList.toggle('dark', isDark);
    };

    syncDarkMode();

    const observer = new MutationObserver(syncDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    setMountNode(mount);
    return () => {
      observer.disconnect();
      root.removeEventListener('pointerdown', bridgePointerDown, { capture: true });
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mount = root.querySelector('#mocking-gui-shadow-mount') as HTMLElement | null;
    if (mount) {
      mount.setAttribute('data-ready', '');
    }

    if (!props.styleText) {
      if (styleRef.current && styleRef.current.parentNode === root) {
        styleRef.current.remove();
      }
      styleRef.current = null;
      return;
    }

    if (!styleRef.current) {
      const style = document.createElement('style');
      style.setAttribute('data-mocking-gui-isolated', 'true');
      style.textContent = props.styleText;
      root.appendChild(style);
      styleRef.current = style;
      return;
    }

    if (styleRef.current.textContent !== props.styleText) {
      styleRef.current.textContent = props.styleText;
    }
  }, [props.styleText, mountNode]);

  return (
    <div
      ref={hostRef}
      id="mocking-gui-shadow-host"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: panelZIndex.host,
      }}
    >
      {mountNode
        ? createPortal(
            <ShadowContainerContext.Provider value={mountNode}>
              {props.children}
            </ShadowContainerContext.Provider>,
            mountNode,
          )
        : null}
    </div>
  );
};

export default ShadowRootPortal;
