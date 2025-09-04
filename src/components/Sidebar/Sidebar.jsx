import React, { useState, useContext } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../Context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  // Load recent prompts from localStorage on component mount
  const [recentChats, setRecentChats] = useState(() => {
    const saved = localStorage.getItem("recentChats");
    return saved ? JSON.parse(saved) : [];
  });

  // Function to handle new chat creation
  const handleNewChat = () => {
    newChat(); // Reset the chat
    setExtended(false); // Close sidebar if needed
  };

  // Function to handle clicking on a recent chat
  const handleRecentChatClick = (prompt) => {
    setRecentPrompt(prompt);
    onSent(prompt); // Send the selected prompt
    setExtended(false); // Close sidebar after selection
  };

  // Function to clear recent chats
  const clearRecentChats = () => {
    setRecentChats([]);
    localStorage.removeItem("recentChats");
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="Menu"
        />
        <div
          className="new-chat"
          onClick={handleNewChat}
          style={{ cursor: "pointer" }}
        >
          <img src={assets.plus_icon} alt="New Chat" />
          {extended ? <p>New Chat</p> : null}
        </div>

        {extended ? (
          <div className="recent">
            <div className="recent-header">
              <p className="recent-title">Recent Chats</p>
              {prevPrompts.length > 0 ? (
                prevPrompts.map((item, index) => (
                  <div
                    key={index}
                    className="recent-entry"
                    onClick={() => handleRecentChatClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={assets.message_icon} alt="Chat" />
                    <p title={item}>{item.slice(0, 18)}...</p>
                  </div>
                ))
              ) : (
                <p className="no-chats">No recent chats</p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="Help" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="Activity" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Settings" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
