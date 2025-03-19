import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
  const [extended, setExtended] = useState(false); // State to manage sidebar extension
  const { onSent, prevPrompts, setRecentPrompt,newChat} = useContext(Context); // Extracting values from context

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt); // Set the selected prompt as the recent prompt
    await onSent(prompt); // Call the onSent function to process the prompt
  };

  return (
    <div className='sidebar'>
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)} // Toggle sidebar extension
          className='menu'
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        <div onClick={()=>newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="New Chat Icon" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => (
              <div
                key={index} // React requires a unique key for mapped elements
                onClick={() => loadPrompt(item)} // Load the prompt when clicked
                className="recent-entry"
              >
                <img src={assets.message_icon} alt="Message Icon" />
                <p>{item} ...</p> {/* Truncate the prompt */}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="Help Icon" />
          {extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="Activity Icon" />
          {extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Settings Icon" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
