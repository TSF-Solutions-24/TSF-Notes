import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import NoteCard from '../../components/card/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from "moment";
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/card/EmptyCard';
import notes from '../../../public/empty-notes.png'
import noNotes from '../../assets/no-notes.png';
Modal.setAppElement('#root');

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  });

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    });
  };

  const openAddNoteModal = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null });
  };

  const closeModal = () => {
    setOpenAddEditModal({ ...openAddEditModal, isShown: false });
  };

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const [allNotes, setAllNotes] = useState([]);
  const [originalNotes, setOriginalNotes] = useState([]); // Store original notes

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes');
      if (response.data && response.data.notes) {
        console.log("Fetched notes:", response.data.notes); // Check fetched data
        setAllNotes(response.data.notes);
        setOriginalNotes(response.data.notes); // Store original notes
      }
    } catch (err) {
      console.log("An unexpected error occurred while fetching notes.");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete('/delete-note/' + noteId);
      if (response.data && !response.data.note) {
        showToastMessage('Note deleted successfully', 'delete');
        getAllNotes();
      }
    } catch (err) {
      console.log("An unexpected error occurred while deleting the note.");
    }
  };

  const [searchFound, setSearchFound] = useState(true);
  const searchNote = async (query) => {
    if (!query) {
      setAllNotes(originalNotes);
      setSearchFound(!searchFound);
      return;
    }
    try {
      const response = await axiosInstance.get('/search-notes', {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put('/update-note-pin/' + noteId, {
        isPinned: !noteData.isPinned
      });
      if (response.data && response.data.note) {
        showToastMessage(
          noteData.isPinned ? 'Note unpinned successfully' : 'Note pinned successfully',
          'pin'
        );
        getAllNotes();
      }
    } catch (err) {
      console.log("An unexpected error occurred while updating the pin status.");
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} searchNote={searchNote} />
      <div className=''>
        {
          allNotes.length > 0 ? (
            <div className='grid grid-cols-3 gap-4 m-10'>
              {allNotes.map((item) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={moment(item.createdOn).format('Do MMM YYYY')}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard img={ searchFound ? noNotes : notes} text={searchFound ? `Oops! No Notes found matching your search` : `Start Creating Your First Note! Click Add Button to add your notes in the form of thoughts, ideas and reminders. Let's get Started`}/>
          )
        }
      </div>
      <button
        className='bg-blue-500 p-3 rounded-2xl absolute right-0 bottom-1 m-6'
        onClick={openAddNoteModal}
      >
        <MdAdd className='text-4xl text-white font-bold' />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          }
        }}
        contentLabel="Add/Edit Note Modal"
        className="bg-white p-8 rounded-md max-w-lg mx-auto mt-20"
      >
        <AddEditNotes
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={closeModal}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
