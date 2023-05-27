import FeedHeader from "./feedCmps/FeedHeader";
import Link from "next/link";
import Image from "next/image";
import getCurrentUser from "@/actions/getCurrentUser";
import { notFound } from "next/navigation";
import { Group, HomeIcon } from "lucide-react";
import { BsGithub } from "react-icons/bs";
import MobileFeedLayout from "./feedCmps/MobileFeedLayout";
import AppFooter from "@/components/AppFooter";

export const metadata = {
  title: "feed",
  description: "A social app",
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await getCurrentUser();
  if (!user) return notFound();

  return (
    <section className="bg-light-1">
      <div className="md:hidden">
        <MobileFeedLayout user={user} />
      </div>
      <div className="hidden md:block">
        <FeedHeader user={user} />
      </div>
      <div className="w-full flex gap-8 h-[calc(100vh-66px)]">
        <div className="hidden md:flex  w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r dark:border-none px-6">
          <nav className="flex flex-1 flex-col border-r-4">
            <ul
              role="list"
              className="flex flex-1 flex-col justify-between gap-y-7"
            >
              <li>
                <div className="text-sm font-semibold leading-6 text-gray-700 ">
                  Overview
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  <li>
                    <Link
                      href="/feed/profile"
                      className="text-gray-700 hover:text-indigo-600 hover:bg-secondery group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold items-center"
                    >
                      <span className="text-gray-400  border-gray-200 ">
                        <Image
                          className="rounded-full"
                          width={36}
                          height={36}
                          src={user?.image!}
                          alt={user?.name as string}
                        />
                      </span>
                      <span className="truncate">{user?.name}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/feed"
                      className="text-gray-700 hover:text-indigo-600 hover:bg-secondery group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold items-center"
                    >
                      <span className="text-gray-400 border-gray-400">
                        <HomeIcon className="h-9 w-9 rounded-full" />
                      </span>
                      <span className="truncate">Feed</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/feed/groups"
                      className="text-gray-700 hover:text-indigo-600 hover:bg-secondery group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold items-center"
                    >
                      <span className="text-gray-400 border-gray-400">
                        <Group className="h-9 w-9 rounded-full" />
                      </span>
                      <span className="truncate">Groups</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="py-4">
                <AppFooter />
              </li>
            </ul>
          </nav>
        </div>
        <aside className="py-16 px-6 md:py-12  w-full overflow-y-auto">
          {children}
        </aside>
      </div>
    </section>
  );
};

export default Layout;
