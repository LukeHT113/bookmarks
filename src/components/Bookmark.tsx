import { useState } from "react"
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";

type Props = {
  idx: number,
  id: string,
  name: string,
  url: string,
  editBookmark: (e: React.MouseEvent, idx: number)=>void,
  deleteBookmark: (e: React.MouseEvent)=>void,
  dragStart: ()=>void,
  dragEnter: ()=>void,
  dragEnd: ()=>void,
}

export default function Bookmark({ idx, id, name, url, editBookmark, deleteBookmark, dragStart, dragEnter, dragEnd }: Props) {

  const [overlayShown, setOverlayShown] = useState(false);
  const [menuShown, setMenuShown] = useState(false);

  function enterOverlay() {
    setOverlayShown(true);
  }

  function exitOverlay() {
    setOverlayShown(false);
  }

  function getDomainFromUrl(url: string) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a.hostname;
  }

  function openMenu(e: React.MouseEvent) {
    e.preventDefault();
    document.body.classList.add('menu-open');
    setMenuShown(true);
  }

  function openEdit(e: React.MouseEvent, idx: number) {
    editBookmark(e, idx);
    document.body.classList.remove('menu-open');
    setMenuShown(false);
  }

  return (
    <>
      {menuShown ? <div onClick={(e) => {
        e.preventDefault();
        document.body.classList.remove('menu-open');
        setMenuShown(false);
      }} className="bookmark-overlay">
      </div> : null}
      <a 
      draggable 
      onDragStart={dragStart}
      onDragEnter={dragEnter}
      onDragEnd={dragEnd}
      onDragOver={(e) => e.preventDefault()}
      onMouseEnter={enterOverlay} 
      onMouseLeave={exitOverlay} 
      key={id} 
      href={url} 
      className="bookmark"
    >
      <button onClick={(e) => {
        setOverlayShown(false);
        openMenu(e);
      }} className={`bookmark-options ${overlayShown && !menuShown ? '' : 'hidden'}`}><HiDotsVertical /></button>
      <div className={`bookmark-menu ${menuShown ? '' : 'hidden'}`}>
        <button onClick={(e) => {
          document.body.classList.remove('menu-open');
          deleteBookmark(e)
        }}><MdDelete /></button>
        <button onClick={(e) => openEdit(e, idx)}><MdEdit /></button>
      </div>
      <div className="bookmark-icon-container"><img className="bookmark-icon" alt={`${name} favicon`} src={`https://icons.duckduckgo.com/ip3/${getDomainFromUrl(url)}.ico`}></img></div>
      <p className="bookmark-title">{name}</p>
    </a>
    </>
    
  )
}
