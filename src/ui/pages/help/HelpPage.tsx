import DefaultPageLayout from "../../layout/DefaultPageLayout";
import "./HelpPage.css";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import {uriTransformer} from "react-markdown";
import {useLocation } from 'react-router-dom';
import {TITLE} from "../../../constants/const";

function HelpPageContent() {
    const [markdown, setMarkdown] = useState("")
    useEffect(() => {
        document.title = 'Help - ' + TITLE;
    }, []);

    const addHelpPrefix = function (uri: string) {
        if (uri.startsWith('#'))
            return window.location.pathname + uri
        return uriTransformer(uri)
    }

    useEffect(() => {
        fetch(window.location.pathname + ".md")
            .then((res) => res.text())
            .then((text) => setMarkdown(text));
    }, []);


    const { hash } = useLocation();
    useEffect(() => {
        if (!markdown)
            return
        // if not a hash link, scroll to top
        if (hash === '') {
            window.scrollTo(0, 0);
        } else { // else scroll to id
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 0);
        }
    }, [markdown, hash]); // do this on route change

    return <div className="container help">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} transformLinkUri={addHelpPrefix} remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
}

function HelpPage() {
    return <DefaultPageLayout content={<HelpPageContent />} />
}
export default HelpPage;