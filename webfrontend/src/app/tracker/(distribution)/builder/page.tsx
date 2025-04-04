"use client";
import { useState } from "react";

export default function BuilderPage() {
  const [isSwitch, setSwitch] = useState<string>("crypto");

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <button
        className={`mr-5 px-4 py-2 rounded-md ${
          isSwitch === "other"
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        } transition-all duration-500 ease-in-out`}
        onClick={() => setSwitch("other")}
      >
        Other
      </button>
      <div className="shadow-flyzerShadow p-6 bg-white rounded-lg">
        Custom Shadow Effect
      </div>
      <button
        className={`mr-5 px-4 py-2 rounded-md ${
          isSwitch === "crypto"
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        } transition-all duration-500 ease-in-out`}
        onClick={() => setSwitch("crypto")}
      >
        Crypto
      </button>
      <div>{isSwitch === "crypto" ? <p>crypto</p> : <p>others</p>}</div>
    </div>
  );
}
