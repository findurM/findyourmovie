import React from "react";

interface Props {}

const Spinner = () => {
  return (
    <div className="my-[10%] w-full">
      <img className="mx-auto" src="/assets/Spinner.gif" />
    </div>
  );
};

export default Spinner;
