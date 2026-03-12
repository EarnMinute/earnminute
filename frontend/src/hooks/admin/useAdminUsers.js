import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";

function useAdminUsers() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    const res = await API.get(`/users/admin/all?page=${page}`);

    const data = res.data;

    if (Array.isArray(data)) {
      setTotalPages(1);
      return data;
    }

    if (data?.users) {
      setTotalPages(data.totalPages || 1);
      return data.users;
    }

    return [];
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers", page],
    queryFn: fetchUsers,
  });

  const changeRole = async (id, role) => {
    await API.patch(`/users/admin/role/${id}`, { role });
    queryClient.invalidateQueries(["adminUsers"]);
  };

  const deleteUser = async (id) => {
    await API.delete(`/users/admin/${id}`);
    queryClient.invalidateQueries(["adminUsers"]);
  };

  return {
    users,
    isLoading,
    page,
    setPage,
    totalPages,
    changeRole,
    deleteUser
  };
}

export default useAdminUsers;