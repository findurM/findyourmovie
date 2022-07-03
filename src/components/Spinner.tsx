import React from "react";

interface Props {}

const Spinner = () => {
  return (
    <div className="absolute min-h-screen min-w-full">
      <img src="/assets/Spinner.gif" className="m-auto my-[30%] w-[300px] h-[300px]" />
    </div>
  );
};

export default Spinner;
