const Footer = () => {
  return (
    <footer className="bg-transparent">
      <hr className="my-3 border-gray-200 dark:border-gray-700" />
      <div className="flex flex-col items-center sm:flex-row sm:justify-between">
        <p className="text-sm text-fontColor">
          © Copyright 2024. All Rights Reserved.
        </p>
        <div className="flex mt-3 -mx-2 sm:mt-0">
          <a
            href="#"
            className="mx-2 text-sm text-fontColor transition-colors duration-300 hover:text-fontColor dark:hover:text-gray-300"
            aria-label="Reddit"
          >
            {" "}
            Teams{" "}
          </a>
          <a
            href="#"
            className="mx-2 text-sm text-fontColor transition-colors duration-300 hover:text-fontColor dark:hover:text-gray-300"
            aria-label="Reddit"
          >
            {" "}
            Privacy{" "}
          </a>
          <a
            href="#"
            className="mx-2 text-sm text-fontColor transition-colors duration-300 hover:text-fontColor dark:hover:text-gray-300"
            aria-label="Reddit"
          >
            {" "}
            Cookies{" "}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
