import { Metadata } from "next";
import KeywordPage from "./HotKeywordsPage";

export const metadata: Metadata = {
  title: "Keywords",
};

function page() {
  return (
    <>
      <KeywordPage />
    </>
  );
}

export default page;
