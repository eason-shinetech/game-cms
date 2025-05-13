"use client"

import { useEffect, useMemo, useState } from "react";
import { HeaderContainer } from "../_components/header-container";
import { Main } from "../_components/main";
import axios from "axios";
import { DataTable } from "@/components/commons/data-table";
import { getColumns } from "./_components/columns";
import { GameUserList } from "@/data/game-user-schema";

const UsersPage = () => {
  const [data, setData] = useState<GameUserList[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const columns = useMemo(
    () => getColumns(() => setRefreshKey((k) => k + 1)),
    []
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/game/users");
      const data = response.data as GameUserList[];
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
      fetchData();
    }, [refreshKey]);

  return (
    <Main fixed>
      <HeaderContainer>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        </div>
      </HeaderContainer>
      <DataTable columns={columns} data={data}/>
    </Main>
  );
};

export default UsersPage;
