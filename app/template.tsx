"use client";
import { motion } from "framer-motion";
import React from "react";

const variants = {
  hidden: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.main
        variants={variants}
        initial="hidden"
        animate="enter"
        transition={{ type: "linear", delay: 0.2, duration: 0.4 }}
      >
        {children}
      </motion.main>
    </>
  );
}
