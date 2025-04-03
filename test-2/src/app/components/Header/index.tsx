"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Table } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

type Props = {};

const Header = (props: Props) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="flex h-full w-full items-center justify-between gap-4">
          {/* Logo bên trái */}
          <a href="/" className={cn("logo h-[36px] w-[36px]")}>
            <Table width={36} height={36} />
          </a>
          {/* Toggle theme bên phải */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full p-2"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun width={16} height={16} className="z-10" />
            ) : (
              <Moon width={16} height={16} className="z-10" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
