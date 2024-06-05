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

  // 필터
  const filteredData = data.filter((val) => {
    const includesSearch = val.name
      .toLowerCase()
      .includes(searchVal.toLowerCase());
    const matchesCountry = country === "all" ? true : val.country === country;

    return includesSearch && matchesCountry;
  });

  // 정렬
  const sortedData = filteredData.sort((a, b) => {
    const dateA = new Date(a.registeredDate ?? "").getTime();
    const dateB = new Date(b.registeredDate ?? "").getTime();
    switch (sortOrder) {
      case "latest":
        return dateB - dateA;
      case "oldest":
        return dateA - dateB;
      case "upRate":
        return (b.rate || 0) - (a.rate || 0);
      case "downRate":
        return (a.rate || 0) - (b.rate || 0);
      case "countReviews":
        return (b.reviews?.length || 0) - (a.reviews?.length || 0);
      default:
        return 0;
    }
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
