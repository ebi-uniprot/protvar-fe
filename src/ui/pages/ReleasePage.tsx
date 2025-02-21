import DefaultPageLayout from "../layout/DefaultPageLayout";
import React, {useEffect, useState} from "react";
import {TITLE} from "../../constants/const";
import "./ReleasePage.css"
import ReleaseNotes from "./release/ReleaseNote";
import Statistics from "./release/Statistics";

function ReleasePageContent() {
  //var today = new Date();
  //var dd = String(today.getDate()).padStart(2, '0');
  //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //var yyyy = today.getFullYear();
  useEffect(() => {
    document.title = `Release | ${TITLE}`;
  }, []);

  const [activeTab, setActiveTab] = useState<'release-notes' | 'statistics'>('statistics');

  return <div className="release-container">
    <div className="release-tabs">
      <button
        className={activeTab === 'statistics' ? 'active' : ''}
        onClick={() => setActiveTab('statistics')}
      >
        Statistics
      </button>
      <button
        className={activeTab === 'release-notes' ? 'active' : ''}
        onClick={() => setActiveTab('release-notes')}
      >
        Release Notes
      </button>
    </div>

    <div className="release-content">
      {activeTab === 'statistics' && <Statistics/>}
      {activeTab === 'release-notes' && <ReleaseNotes/>}
    </div>
  </div>
}

function ReleasePage() {
  return <DefaultPageLayout content={<ReleasePageContent/>}/>
}

export default ReleasePage;