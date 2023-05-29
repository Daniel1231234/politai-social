"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import Button from "./ui/Button";
import useScrollPosition from "@/hooks/useScrollPosition";
import { FaGlobe } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HomePageContentProps {}

const HomePageContent: React.FC<HomePageContentProps> = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const scrollPosition = useScrollPosition();
  const router = useRouter();

  useEffect(() => {
    if (!headerRef.current) return;
    if (scrollPosition > 10) {
      headerRef.current.classList.remove("bg-transparent", "text-gray-900");
      headerRef.current.classList.add("bg-gray-900", "text-gray-50");
    } else {
      headerRef.current.classList.remove("bg-gray-900", "text-gray-50");
      headerRef.current.classList.add("bg-transparent", "text-gray-900");
    }
  }, [scrollPosition]);

  return (
    <>
      <nav
        ref={headerRef}
        id="header"
        className="fixed w-full z-30 top-0 left-0 text-gray-900"
      >
        <div className="w-full  mx-auto flex items-center justify-between mt-0">
          <Link href="/" className="pl-4 flex items-center">
            <span className="text-4xl font-bold tracking-tight  rounded-md p-2">
              Politai
            </span>
            <FaGlobe className="mr-2" />
            <span className="text-2xl">Social</span>
          </Link>
          <div
            className="w-full flex-grow lg:flex  mt-2 p-4  z-20"
            id="nav-content"
          >
            <ul className="flex justify-end flex-1 items-center">
              <li className="mr-3">
                <Button>
                  <Link href="/auth"> Sign In </Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="pt-24">
        <div className="px-3 mx-auto flex flex-wrap items-center justify-center ">
          <div className="w-full md:w-2/5 text-center md:text-left">
            <h1 className="my-4 text-5xl font-bold leading-tight">
              Connect with Politai-Social and Engage in Politics Like Never
              Before!
            </h1>
            <p className="mt-4 text-2xl leading-normal">
              Join our community and stay informed about political discussions,
              debates, and news. Make your voice heard!
            </p>
            <Button
              size="lg"
              className="mt-8 text-lg"
              onClick={() => router.push("/feed")}
            >
              Explore Politai now!
            </Button>
          </div>
          <div className="py-6 w-[450px] h-[450px] text-center relative">
            <Image
              fill
              sizes="60vw"
              priority
              className="rounded-full opacity-80 mx-auto"
              src="/images/hero.png"
              alt="Hero"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageContent;
