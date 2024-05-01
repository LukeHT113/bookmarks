import { IoAdd } from "react-icons/io5"
import Bookmark from "./Bookmark"
import { ChangeEvent, useState } from "react"
import { FiX, FiMinimize2, FiMaximize2 } from "react-icons/fi";

type Bookmark = {
  id: string,
  name: string,
  url: string
}

type Props = {
  categoryIndex: number,
  id: string,
  name: string,
  bookmarks: Bookmark[],
  editCategoryName: (categoryIdx: number, newName:string)=>void,
  deleteCategory: (categoryIdx: number)=>void,
  editBookmark: (e: React.MouseEvent, categoryIdx: number, bookmarkIdx: number)=>void,
  deleteBookmark: (e: React.MouseEvent, categoryIdx: number, bookmarkIdx: number)=>void,
  dragStart: (categoryIdx: number, bookmarkIdx: number)=>void,
  dragEnter: (categoryIdx: number, bookmarkIdx: number)=>void,
  dragEnd: ()=>void,
  openAddModal: (categoryId: string) => void
}

export default function Category({ categoryIndex, id, name, bookmarks, editCategoryName, deleteCategory, editBookmark, deleteBookmark, dragStart, dragEnter, dragEnd, openAddModal } : Props) {

  const [minimized, setMinimized] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(name);

  function passDeleteIndexes(e: React.MouseEvent, categoryIdx: number, bookmarkIdx: number) {
    deleteBookmark(e, categoryIdx, bookmarkIdx);
  }

  function passEditIndexes(e: React.MouseEvent, bookmarkIdx: number) {
    editBookmark(e, categoryIndex, bookmarkIdx);
  }

  function onChangeName(e: ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value);
  }
  
  function onSubmitName(e: React.FormEvent) {
    e.preventDefault();
    editCategoryName(categoryIndex, newName);
    setEditingName(false);
  }
  function confirmDelete() {
    if (window.confirm(`You are about to delete "${name}" and all of it's bookmarks.`)) {
      deleteCategory(categoryIndex);
    }
  }
  
  return (
    <div className={`bookmarks-container`}>
        {editingName ? 
        <form onSubmit={(e) => onSubmitName(e)}>
          <input size={newName.length > 0 ? newName.length : 1} autoFocus onChange={(e) => onChangeName(e)} value={newName} className="bookmarks-title-edit"></input>
          <input type="submit" hidden></input>
        </form>
        : <h2 onDoubleClick={() => setEditingName(true)} className="bookmarks-title">{name}{minimized ? ` (${bookmarks.length})` : ''}</h2>}
        <button onClick={() => setMinimized(prev => !prev)} className="bookmarks-minimize"><p>{minimized ? <FiMaximize2 /> : <FiMinimize2 />}</p></button>
        <button onClick={confirmDelete} className="bookmarks-delete"><p><FiX /></p></button>
        <div className={`bookmarks-inner ${minimized ? 'minimized' : ''}`}>
          {bookmarks.map((bookmark, index) => {
            return <Bookmark 
                      idx={index}
                      key={bookmark.id} 
                      id={bookmark.id} 
                      name={bookmark.name} 
                      url={bookmark.url} 
                      editBookmark={passEditIndexes}
                      deleteBookmark={(e) => passDeleteIndexes(e, categoryIndex, index)}
                      dragStart={() => dragStart(categoryIndex, index)}
                      dragEnter={() => dragEnter(categoryIndex, index)}
                      dragEnd={dragEnd}
                    />
          })}
          <button onDragEnter={() => dragEnter(categoryIndex, bookmarks.length)} onClick={() => openAddModal(id)} className="add-bookmark-container">
            <div className="add-bookmark-icon-container">
              <div className="add-bookmark-icon"><IoAdd /></div>
            </div>
            <p className="add-bookmark-title">Add Bookmark</p>
          </button>
        </div>
      </div>
  )
}
