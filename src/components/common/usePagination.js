import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function usePagination(
  searchFunc,
  searchParam,
  storeName,
  listName,
  totalNumberName
) {
  let curPage = 1;
  searchParam.curPage = curPage;
  const resultList = useSelector(state => state[storeName][listName]);
  const totalNumber = useSelector(state => state[storeName][totalNumberName]);
  const waiting = useSelector(state => state.common.waiting);

  useEffect(() => {
    searchFunc(searchParam);
  }, [searchFunc, searchParam]);

  useEffect(() => {
    function handleMouseWheel() {
      let top = document.body.scrollTop || document.documentElement.scrollTop;
      if (
        resultList.length < totalNumber &&
        !waiting &&
        top + document.body.clientHeight === document.body.scrollHeight
      ) {
        curPage++;
        searchParam.curPage = curPage;
        searchFunc(searchParam);
      }
    }
    document.body.addEventListener("wheel", handleMouseWheel);
    return () => {
      document.body.removeEventListener("wheel", handleMouseWheel);
    };
  }, [resultList, totalNumber, curPage, searchFunc, searchParam, waiting]);
}
