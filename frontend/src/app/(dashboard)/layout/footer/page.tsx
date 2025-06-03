'use client';
import React from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import { Heading } from "@/components/Heading";
const Footer = () => {
  return (
    <Box sx={{ pt: 6, textAlign: "center" }}>
      <Heading variant="body">
        © {new Date().getFullYear()} All rights reserved by{" "}
        <Link href="https://www.wrappixel.com">
          Wrappixel.com
        </Link>{" "}
      </Heading>
    </Box>
  );
};

export default Footer;
    