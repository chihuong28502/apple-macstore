"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div
      className="w-16 h-8  rounded-full p-1 cursor-pointer flex items-center"
      onClick={toggleTheme}
      animate={{
        backgroundColor: resolvedTheme === "dark" ? "#4b4b4b" : "#D1D5DB",
      }}
    >
      <motion.div
        className="w-6 h-6 rounded-full flex items-center justify-center"
        animate={{
          x: resolvedTheme === "dark" ? 32 : 0,
          backgroundColor: resolvedTheme === "dark" ? "#1F2937" : "#FBBF24",
        }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        {resolvedTheme === "dark" ? (
          <FiMoon className="text-white" />
        ) : (
          <FiSun className="text-white" />
        )}
      </motion.div>
    </motion.div>
  );
};

export default DarkModeToggle;
