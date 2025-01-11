const FirstLogin = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-2/3">
      <h3 className="font-semibold text-2xl text-heavygray">
        {" "}
        Add your first holding!{" "}
      </h3>
      <p className="text-sm text-lightgray mt-2.5 mb-11">
        {" "}
        To show your portfolio data on your dashboard you have to add your first
        holding.
      </p>
      <button className="flex flex-row justify-center items-center text-white text-2xl bg-blue rounded-sm w-8 h-8 ">
        {" "}
        +{" "}
      </button>
    </div>
  );
};

export default FirstLogin;
