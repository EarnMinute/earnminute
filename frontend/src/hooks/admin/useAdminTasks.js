import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";

function useAdminTasks() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/admin/all?page=${page}`);

    const data = res.data?.data;

    if (Array.isArray(data)) {
      setTotalPages(1);
      return data;
    }

    if (data?.tasks) {
      setTotalPages(data.totalPages || 1);
      return data.tasks;
    }

    setTotalPages(1);
    return [];
  };

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["adminTasks", page],
    queryFn: fetchTasks,
  });

  const deleteTask = async (id) => {
    await API.delete(`/tasks/admin/${id}`);
    queryClient.invalidateQueries(["adminTasks"]);
  };

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : tasks.filter((task) => task.status === activeTab);

  return {
    tasks,
    filteredTasks,
    isLoading,
    page,
    setPage,
    totalPages,
    activeTab,
    setActiveTab,
    selectedTask,
    setSelectedTask,
    deleteTask,
  };
}

export default useAdminTasks;