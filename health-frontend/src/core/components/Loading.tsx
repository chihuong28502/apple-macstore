import ProgressCustom from "./ProgressCustom";
function Loading() {
  return (
    <div className="py-9 text-center w-[200px] ">
      <p className=" text-4xl font-black bg-gradient-to-r from-darkTextDiscoverService via-darkTextTitleBlue to-darkTextTitlePink bg-clip-text text-transparent uppercase">
        TopClick
      </p>
      <div className="w-full max-w-[200px]">
        <ProgressCustom />
      </div>
    </div>
  );
}

export default Loading;
