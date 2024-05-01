import { useEffect, useRef } from "react"

type Props = {
  isOpened: boolean,
  onClose: () => void,
  children: React.ReactNode
}

const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
  const r = element.getBoundingClientRect();

  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  );
}

export default function AddModal({isOpened, onClose, children}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal();
      document.body.classList.add("modal-open");
    } else {
      ref.current?.close();
      document.body.classList.remove("modal-open");
    }
  }, [isOpened]);

  return (
    <dialog className="add-modal" ref={ref} onCancel={onClose} onClick={(e) => ref.current && !isClickInsideRectangle(e as unknown as MouseEvent, ref.current) && onClose()}>
      {children}
    </dialog>
  )
}
