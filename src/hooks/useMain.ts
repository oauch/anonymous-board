import { ChangeEvent, useEffect, useState } from "react";
import { MoviesProps } from "../types/Movies";

function useMain() {
  const [data, setData] = useState<MoviesProps[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [viewType, setViewType] = useState("list");
  const [sortOrder, setSortOrder] = useState("latest");
  const [country, setCountry] = useState("all");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const handleCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  // 필터 (나라별)
  const filteredData = data.filter((val) => {
    const includesSearch = val.name
      .toLowerCase()
      .includes(searchVal.toLowerCase());
    const matchesCountry = country === "all" ? true : val.country === country;

    return includesSearch && matchesCountry;
  });

  // 정렬 (시간순)
  const sortedData = filteredData
    .filter((val) => val.name.toLowerCase().includes(searchVal))
    .sort((a, b) => {
      const dateA = new Date(a.registeredDate ?? "").getTime();
      const dateB = new Date(b.registeredDate ?? "").getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/movies", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return {
    searchVal,
    handleSearch,
    handleSortChange,
    handleCountry,
    setViewType,
    sortedData,
    viewType,
  };
}

export default useMain;
