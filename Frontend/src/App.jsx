import { useState } from "react";
import NexoraChatUI from "./test";

function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  const askGemini = async () => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setAnswer(data.text);
  };

  return (
 <NexoraChatUI/>
  );
}

export default App;