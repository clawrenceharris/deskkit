"use client"
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
interface AuthLayoutProps {
  children: React.ReactNode;
  authType: "login" | "sign-up";
}
export function AuthLayout({ children, authType }: AuthLayoutProps) {
  return (
    
      <Card className="w-full ring-0 bg-surface rounded-none max-w-110 mx-auto shadow-none overflow-y-auto h-full">
        <CardHeader className="border-b flex items-center">
         <Image src="/images/logo-secondary.png" alt="deskkit Logo" width={80} height={80}/>
          <CardTitle className="text-2xl flex items-center font-semibold">
            Welcome to deskkit!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-full items-center">
          {children}
        </CardContent>
        <CardFooter className="text-sm justify-center">
          {authType === "sign-up"
            ? "Already have an account?"
            : "Don't have an account?"}
          <Link
            href={authType === "login" ? "/auth/sign-up" : "/auth/login"}
            className="font-medium ml-1 underline btn-link text-primary"
          >
            {authType === "login" ? "Sign up" : "Log in"}
          </Link>
        </CardFooter>
      </Card>
  );
}
