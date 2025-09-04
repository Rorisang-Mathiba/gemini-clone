import { createContext, useState, useEffect } from "react";
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const makeTextLookNice = (responseText) => {
    let niceText = responseText;

    niceText = niceText.replace(/\*\*(.*?)\*\*/g, "【$1】");
    niceText = niceText.replace(/\*(.*?)\*/g, "/$1/");

    niceText = niceText.replace(/### (.*)/g, "● $1");
    niceText = niceText.replace(/## (.*)/g, "◆ $1");
    niceText = niceText.replace(/# (.*)/g, "▲ $1");

    niceText = niceText.replace(/^-\s+/gm, "• ");
    niceText = niceText.replace(/^\*\s+/gm, "• ");
    niceText = niceText.replace(/^(\d+)\.\s+/gm, "$1. ");

    niceText = niceText.replace(/\*/g, "");

    return niceText;
  };

  const onSent = async (prompt) => {
    if (isProcessing || loading) {
      console.log("Already processing a request, ignoring new one");
      return;
    }

    console.log("Sending message to Gemini...");

    setIsProcessing(true);

    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      let response;

      if (prompt !== undefined) {
        console.log("Using specific prompt:", prompt);
        response = await main(prompt);
        setRecentPrompt(prompt);
      } else {
        console.log("Using input box text:", input);
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await main(input);
      }

      console.log("Got response from Gemini:", response);

      const niceResponse = makeTextLookNice(response);
      console.log("Formatted response:", niceResponse);

      let responseWords = niceResponse.split(" ");
      let currentResponse = "";

      for (let i = 0; i < responseWords.length; i++) {
        const nextWord = responseWords[i];

        setTimeout(() => {
          currentResponse += nextWord + " ";
          setResultData(currentResponse);
        }, 75 * i);
      }

      setTimeout(() => {
        setLoading(false);
        setIsProcessing(false);
      }, 75 * responseWords.length + 500);
    } catch (error) {
      console.error("Error in onSent:", error);
      setLoading(false);
      setIsProcessing(false);
      setResultData("Sorry, there was an error processing your request.");
    }

    setInput("");
  };

  const newChat = () => {
    console.log("Starting new chat...");
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    setInput("");
    setIsProcessing(false);
  };

  const contextValue = {
    prevPrompts,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,

    setPrevPrompts,
    setRecentPrompt,
    onSent,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
