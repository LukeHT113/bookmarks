import { useEffect, useRef, useState } from 'react'
import './App.css'
import {v4 as uuidv4 } from 'uuid';
import AddModal from './components/AddModal';
import Bookmark from './components/Bookmark';
import EditModal from './components/EditModal';
import Category from './components/Category';
import { BiPlus } from 'react-icons/bi';

type Bookmark = {
  id: string,
  name: string,
  url: string
}

type Category = {
  id: string,
  name: string,
  bookmarks: Bookmark[]
}

type editIndexes = {
  categoryIdx: number,
  bookmarkIdx: number
}

function App() {

  const [bookmarks, setBookmarks] = useState<Category[]>([{
    id: uuidv4(),
    name: 'General',
    bookmarks: []
  }]);
  const [addModalOpened, setAddModalOpened] = useState<boolean>(false);
  const [editModalOpened, setEditModalOpened] = useState<boolean>(false);
  const [newBookmark, setNewBookmark] = useState<Bookmark>({
    id: '',
    name: '',
    url: ''
  });
  const [editedBookmark, setEditedBookmark] = useState<Bookmark>({
    id: '',
    name: '',
    url: ''
  })
  const [categoryAddId, setCategoryAddId] = useState<string>('');
  const [editIndexes, setEditIndexes] = useState<editIndexes>({categoryIdx: -1, bookmarkIdx: -1});

  useEffect(() => {
    if (localStorage.getItem('bookmarks')) {
      setBookmarks(JSON.parse(localStorage.getItem('bookmarks') as string))
    }
  
    return () => {
      
    }
  }, [])
  
  // Category functions
  function addCategory() {
    const updatedBookmarks = [...bookmarks, {
      id: uuidv4(),
      name: 'New Category',
      bookmarks: []
    }]
    setBookmarks(updatedBookmarks);
  }
  function changeCategoryName(categoryIdx: number, newName: string) {
    const arr = bookmarks;
    arr[categoryIdx].name = newName;
    localStorage.setItem('bookmarks', JSON.stringify(arr));
    setBookmarks([...arr]);
  }
  function deleteCategory(categoryIdx: number) {
    const arr = bookmarks;
    arr.splice(categoryIdx, 1);
    localStorage.setItem('bookmarks', JSON.stringify(arr));
    setBookmarks([...arr]);
  }

  function openAddModal(categoryId: string) {
    setCategoryAddId(categoryId);
    setAddModalOpened(true);
  }

  function addBookmark() {
    const uuid = uuidv4();
    const categoryIndex = bookmarks.findIndex(category => category.id === categoryAddId);
    if (categoryIndex === -1) {
      console.error('category not found');
      return
    }
    const updatedBookmarks = bookmarks.map((category, idx) => {
      if (idx === categoryIndex) {
        return {
          id: category.id,
          name: category.name,
          bookmarks: [...category.bookmarks, {
            id: uuid,
            name: newBookmark.name,
            url: newBookmark.url
          }]
        }
      } else {
        return category
      }
    })
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    setNewBookmark({
      id: '',
      name: '',
      url: ''
    });
    setAddModalOpened(false);
  }

  function updateNewBookmark(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'name') {
      setNewBookmark(prev => {
        return {
          id: prev.id,
          name: e.target.value,
          url: prev.url
        }
      })
    } else {
      setNewBookmark(prev => {
        return {
          id: prev.id,
          name: prev.name,
          url: e.target.value
        }
      })
    }
  }

  function editOpen(e: React.MouseEvent, categoryIdx: number, bookmarkIdx: number) {
    e.preventDefault();
    setEditIndexes({categoryIdx: categoryIdx, bookmarkIdx: bookmarkIdx});
    setEditedBookmark(bookmarks[categoryIdx].bookmarks[bookmarkIdx]);
    setEditModalOpened(true);
  }

  function updateEditedBookmark(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === 'name') {
      setEditedBookmark(prev => {
        return {
          id: prev.id,
          name: e.target.value,
          url: prev.url
        }
      })
    } else {
      setEditedBookmark(prev => {
        return {
          id: prev.id,
          name: prev.name,
          url: e.target.value
        }
      })
    }
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (editIndexes.categoryIdx === -1 || editIndexes.bookmarkIdx === -1) {
      return false;
    }
    const arr = bookmarks;
    const editTarget = arr[editIndexes.categoryIdx].bookmarks[editIndexes.bookmarkIdx];
    arr[editIndexes.categoryIdx].bookmarks[editIndexes.bookmarkIdx] = {...editTarget,
      name: editedBookmark.name,
      url: editedBookmark.url
    }

    setBookmarks([...arr]);
    localStorage.setItem('bookmarks', JSON.stringify(arr));
    setEditModalOpened(false);
  }

  function deleteBookmark(e: React.MouseEvent, categoryIdx: number, bookmarkIdx: number) {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to delete this bookmark?`)) {
      return  false;
    }
    const updatedBookmarks = bookmarks.map((category, idx) => {
      if (idx === categoryIdx) {
        return {
          id: category.id,
          name: category.name,
          bookmarks: bookmarks[categoryIdx].bookmarks.filter((_bookmark, idx) => idx !== bookmarkIdx)
        }
      } else {
        return category
      }
    })
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addBookmark();
  }

  const dragBookmark = useRef<editIndexes>({
    categoryIdx: -1,
    bookmarkIdx: -1
  });
  const draggedOverBookmark = useRef<editIndexes>({
    categoryIdx: -1,
    bookmarkIdx: -1
  });

  function dragStart(categoryIdx: number, bookmarkIdx: number) {
    dragBookmark.current = {categoryIdx: categoryIdx, bookmarkIdx: bookmarkIdx};
  }

  function dragEnter(categoryIdx: number, bookmarkIdx: number) {
    draggedOverBookmark.current = {categoryIdx: categoryIdx, bookmarkIdx: bookmarkIdx};
  }

  function handleSort() {
    const arr = bookmarks;
    if (dragBookmark.current.categoryIdx === draggedOverBookmark.current.categoryIdx) {
      arr[dragBookmark.current.categoryIdx].bookmarks = arrayMove(arr[dragBookmark.current.categoryIdx].bookmarks, dragBookmark.current.bookmarkIdx, draggedOverBookmark.current.bookmarkIdx);
      localStorage.setItem('bookmarks', JSON.stringify(arr));
      setBookmarks([...arr]);
    } else {
      arr[draggedOverBookmark.current.categoryIdx].bookmarks.push(arr[dragBookmark.current.categoryIdx].bookmarks[dragBookmark.current.bookmarkIdx]);
      arr[dragBookmark.current.categoryIdx].bookmarks.splice(dragBookmark.current.bookmarkIdx, 1);
      arr[draggedOverBookmark.current.categoryIdx].bookmarks = arrayMove(arr[draggedOverBookmark.current.categoryIdx].bookmarks, arr[draggedOverBookmark.current.categoryIdx].bookmarks.length-1, draggedOverBookmark.current.bookmarkIdx);
      localStorage.setItem('bookmarks', JSON.stringify(arr));
      setBookmarks([...arr]);
    }
  }

  function arrayMove(arr: Bookmark[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push();
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  return (
    <>
      <section className="category-container">
        {bookmarks.map((category, index) => {
          return <Category 
                    categoryIndex={index}
                    key={category.id} 
                    id={category.id} 
                    name={category.name} 
                    bookmarks={category.bookmarks} 
                    editCategoryName={changeCategoryName}
                    deleteCategory={deleteCategory}
                    editBookmark={editOpen}
                    deleteBookmark={deleteBookmark}
                    dragStart={dragStart}
                    dragEnter={dragEnter}
                    dragEnd={handleSort}
                    openAddModal={openAddModal}
                  />
        })}
        <button onClick={addCategory} className="add-category-button"><BiPlus /></button>
      </section>
      <AddModal
        isOpened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
      >
        <div className='modal-inner'>
          <h2 className='modal-title'>Add Bookmark</h2>
          <form className='modal-form' onSubmit={handleSubmit}>
            <label className='modal-label' htmlFor="add-name">Name</label>
            <input className='modal-input' autoFocus name='name' id='add-name' value={newBookmark.name} onChange={(e) => updateNewBookmark(e)}></input>
            <label className='modal-label' htmlFor="add-link">URL</label>
            <input className='modal-input' name='link' id='add-link' value={newBookmark.url} onChange={(e) => updateNewBookmark(e)}></input>
            <div className="modal-button-container">
              <button className='modal-button' onClick={() => setAddModalOpened(false)} type='button'>Cancel</button>
              <button disabled={(newBookmark.name === '' || newBookmark.url === '') ? true : false} className='modal-button' type='submit'>Done</button>
            </div>
          </form>
        </div>
      </AddModal>
      <EditModal
        isOpened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
      >
        <div className="modal-inner">
          <h2 className='modal-title'>Edit Bookmark</h2>
          <form className='modal-form' onSubmit={(e) => handleEdit(e)}>
            <label className='modal-label' htmlFor="edit-name">Name</label>
            <input className='modal-input' autoFocus name='name' id='edit-name' value={editedBookmark.name} onChange={(e) => updateEditedBookmark(e)}></input>
            <label className='modal-label' htmlFor="edit-link">URL</label>
            <input className='modal-input' name='link' id='edit-link' value={editedBookmark.url} onChange={(e) => updateEditedBookmark(e)}></input>
            <div className="modal-button-container">
              <button className='modal-button' type='submit'>Done</button>
            </div>
          </form>
        </div>
      </EditModal>
    </>
  )
}

export default App
