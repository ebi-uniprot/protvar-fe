import React, {useEffect, useState} from "react";
import {LOCAL_DOWNLOADS, LOCAL_RESULTS} from "../../constants/const";
import useLocalStorage from "../../hooks/useLocalStorage";
import {SET_ITEM} from "../../context/LocalStorageContext";
import CollapsibleSidebar from "./Sidebar/CollapsibleSidebar";

const DefaultPageContent = (props: {
  children: React.JSX.Element
}) => {
  const { children } = props
  const { getItem } = useLocalStorage();
  const [numResults, setNumResults] = useState<number>((getItem<any[]>(LOCAL_RESULTS) || []).length)
  const [numDownloads, setNumDownloads] = useState<number | null>((getItem<any[]>(LOCAL_DOWNLOADS) || []).length)

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail === LOCAL_RESULTS)
        setNumResults((getItem<any[]>(LOCAL_RESULTS) || []).length);
      else if (e.detail === LOCAL_DOWNLOADS)
        setNumDownloads((getItem<any[]>(LOCAL_DOWNLOADS) || []).length)
    };

    // Listen for changes in localStorage
    window.addEventListener(SET_ITEM, handleStorageChange as EventListener);

    return () => {
      // Clean up the listener
      window.removeEventListener(SET_ITEM, handleStorageChange as EventListener);
    };
  }, [getItem]);

  return (
    <div className="page-content">
      <CollapsibleSidebar
        numResults={numResults}
        numDownloads={numDownloads}
      />
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

export default DefaultPageContent
