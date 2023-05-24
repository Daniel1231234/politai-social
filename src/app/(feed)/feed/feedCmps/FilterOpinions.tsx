import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react";

interface FilterOpinionsProps {
  topics: { value: string; label: string }[];
  handleFilter: any;
}

const FilterOpinions: React.FC<FilterOpinionsProps> = ({
  topics,
  handleFilter,
}) => {
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Call initially to set the initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const visibleTopics = showAllTopics
    ? topics
    : isMediumScreen
    ? topics.slice(0, 3)
    : topics.slice(0, 5);

  return (
    <Tab.Group>
      <Tab.List
        className={cn(
          "flex flex-row relative w-full space-x-1 rounded-xl p-1 justify-between",
          {
            "flex-wrap gap-2": showAllTopics,
          }
        )}
      >
        {visibleTopics.map((topicName, idx) => (
          <Tab
            key={idx}
            onClick={() => handleFilter(topicName.value)}
            className={({ selected }) =>
              cn(
                "rounded-lg py-2.5 text-sm font-medium leading-5 ",
                "focus:outline-none",
                {
                  "bg-secondery text-blue-700": selected,
                  "text-gray-900 hover:bg-secondery hover:text-blue-700":
                    !selected,
                  "w-auto ml-2": isMediumScreen && showAllTopics,
                  "w-full": !isMediumScreen && !showAllTopics,
                }
              )
            }
          >
            #{topicName.value}
          </Tab>
        ))}
        {!showAllTopics && (
          <button
            className="text-gray-900 hover:bg-secondery p-1"
            onClick={() => setShowAllTopics(true)}
          >
            <ArrowRightFromLineIcon />
          </button>
        )}
        {showAllTopics && (
          <button
            className="text-gray-900 hover:bg-secondery p-1"
            onClick={() => setShowAllTopics(false)}
          >
            <ArrowLeftFromLineIcon />
          </button>
        )}
      </Tab.List>
    </Tab.Group>
  );
};

export default FilterOpinions;
