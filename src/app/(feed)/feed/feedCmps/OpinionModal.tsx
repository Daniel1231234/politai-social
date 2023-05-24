"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import TextareaAutosize from "react-textarea-autosize";
import Button from "@/components/ui/Button";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getInitialTopics } from "@/helpers";

interface OpinionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User;
}

const initialTopics = getInitialTopics();

const animatedComponents = makeAnimated();

const OpinionModal: React.FC<OpinionModalProps> = ({
  isOpen,
  setIsOpen,
  user,
}) => {
  const [opinion, setOpinion] = useState<string>();
  const [topics, setTopics] = useState<String[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectTopics = (topics: any) => {
    const topicValues = topics.map((item: any) => item.value);
    setTopics(topicValues);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/opinion/add", {
        opinion,
        topics,
      });
      console.log(res);
      toast.success("Opinion added Successfully!");
      setOpinion("");
      setIsOpen(false);
    } catch (err) {
      toast.error("Something went wrong, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create new opinion
                </Dialog.Title>
                <div className="mt-2">
                  <TextareaAutosize
                    rows={4}
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                    placeholder={`Make your voice heard, ${user.name}!`}
                    className="block w-full resize-none  border-0 bg-transparent  text-gray-900 placeholder:text-gray-400 placeholder:ml-3 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="mt-2 flex flex-col gap-4">
                  <span className="text-sm font-bold">Topics:</span>
                  <ReactSelect
                    onChange={selectTopics}
                    closeMenuOnSelect={false}
                    className="h-full block"
                    components={animatedComponents}
                    options={initialTopics}
                    isMulti
                  />
                </div>

                <div className="mt-4">
                  <Button
                    isLoading={isLoading}
                    className=" !bg-blue-100 w-full  text-blue-900 hover:!bg-blue-200 "
                    onClick={onSubmit}
                  >
                    Post
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OpinionModal;
