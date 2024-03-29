import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
  Card,
  CardBody,
} from "@nextui-org/react";
import { ModalDataType } from "@/types/ModalDataType";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchedTasks } from "@/api/task/task";
import Task from "../components/Task";

function SearchTaskModal({ isOpen, onClose }: ModalDataType) {
  const [searchParam, setSearchParam] = useState<string>("");

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["tasks", searchParam],
    queryFn: () => fetchSearchedTasks(searchParam),
    enabled: false,
  });

  useEffect(() => {
    if (searchParam.length < 1) return;
    refetch();
  }, [searchParam, refetch]);

  return (
    <div className="overflow-hidden">
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="dark bg-opacity-90"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                Search Tasks
              </ModalHeader>
              <ModalBody>
                <Input
                  className="text-white"
                  label="Search"
                  variant="bordered"
                  placeholder="Enter your search"
                  type="text"
                  onChange={(e) => setSearchParam(e.target.value)}
                  endContent={
                    <div className="focus:outline-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative w- h-6 my-auto text-gray-400 bottom-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  }
                />
                <Divider className="my-4" />
                <div className="flex flex-col gap-2 w-full h-72 overflow-y-scroll px-4">
                  {data && data.length > 0 ? (
                    data.map((task) => (
                      <div className="pb-5" key={task.id}>
                        <Task
                          id={task.id}
                          description={task.description}
                          due={task.due}
                          createdAt={task.createdAt}
                          category={task.category}
                          priority={task.priority}
                          status={task.status}
                          updatedAt={task.updatedAt}
                          userId={task.userId}
                          onContextMenu={() => {}}
                        />
                      </div>
                    ))
                  ) : (
                    <Card className="bg-gray-800 bg-opacity-35">
                      <CardBody className="flex items-center">
                        <p>No recent searches</p>
                      </CardBody>
                    </Card>
                  )}
                  {isPending && <span>Loading...</span>}
                  {isError && <span>Error: {error.message}</span>}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SearchTaskModal;
