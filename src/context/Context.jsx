import { createContext, useState } from "react";
import runChat from "../config/gemini"; // Assuming this handles the AI call

// Create Context
export const Context = createContext();

const ContextProvider = (props) => {
  // State variables 
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Function to simulate delayed rendering of response
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  // Handle text prompts
  const onSent = async (prompt) => {
    if (!prompt || typeof prompt !== "string") {
      console.error("Invalid prompt provided:", prompt);
      return;
    }

    // Reset state before processing
    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      console.log("Sending prompt to runChat:", prompt);
      const response = await runChat(prompt); // Await the response from runChat
      console.log("Response received from runChat:", response);

      // Process the response to create a new response string
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      setPrevPrompts((prev) => [...prev, prompt]);
      setRecentPrompt(prompt);
    } catch (error) {
      console.error("Error during runChat:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // New function to handle image upload
  const onImageUploaded = (imageDataUrl) => {
    // Create an image element HTML snippet.
    const imageHTML = `<br/><img src="${imageDataUrl}" alt="Uploaded Image" style="max-width: 100%; margin-top: 10px;" /><br/>`;
    // Append the image to current conversation.
    setResultData((prev) => prev + imageHTML);
  };

  // Context value to be shared
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    onImageUploaded // expose new function to children components
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
