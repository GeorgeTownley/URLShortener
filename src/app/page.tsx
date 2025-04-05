"use client";

import { useState } from "react";
import { createTestKey } from "./actions";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    try {
      const { key } = await createTestKey();
      setMessage(`Created key: ${key} (expires in 100s)`);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating test key");
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      DaisyUI Button
    </button>
  );
}
