import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  wrapperId?: string;
}

const Portal = ({ children, wrapperId = "portal-root" }: PortalProps) => {
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(wrapperId);
    let created = false;

    if (!element) {
      element = document.createElement("div");
      element.id = wrapperId;
      document.body.appendChild(element);
      created = true;
    }

    setWrapper(element);

    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  return wrapper ? createPortal(children, wrapper) : null;
};

export default Portal;
