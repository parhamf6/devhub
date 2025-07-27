import React from 'react';
import { Github } from 'lucide-react';
const GithubButton = () => {
  return (
    <button className=" cursor-pointer text-white  bg-gradient-to-r from-gray-800 to-black  rounded-full border border-gray-600 hover:scale-105 duration-200 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900">
      <Github />
    </button>
  );
}

export default GithubButton;
