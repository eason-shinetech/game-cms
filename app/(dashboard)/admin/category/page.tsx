"use client";

import { useEffect, useMemo, useState } from "react";
import { HeaderContainer } from "../_components/header-container";
import { Main } from "../_components/main";
import axios from "axios";
import { DataTable } from "@/components/commons/data-table";
import { getColumns } from "./_components/columns";
import { GameCategoryList } from "@/data/game-category-schema";

const CategoryPage = () => {
  const [data, setData] = useState<GameCategoryList[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const columns = useMemo(
    () => getColumns(() => setRefreshKey((k) => k + 1)),
    []
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/game/category/stats");
      const data = response.data as GameCategoryList[];
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
          <h2 className="text-2xl font-bold tracking-tight">Category List</h2>
        </div>
      </HeaderContainer>
      <DataTable columns={columns} data={data} />
    </Main>
  );
};

export default CategoryPage;
