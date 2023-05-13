import DefaultPageLayout from "../../layout/DefaultPageLayout";
import "./HelpPage.css";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
//import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

function HelpPageContent() {
    const [markdown, setMarkdown] = useState("")

    useEffect(() => {
        fetch(window.location.href + ".md")
            .then((res) => res.text())
            .then((text) => setMarkdown(text));
    });

    return <div className="container help">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
    </div>
}

function HelpPage() {
    return <DefaultPageLayout content={<HelpPageContent />} />
}
export default HelpPage;