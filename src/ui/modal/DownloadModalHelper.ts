import Notify from "../elements/Notify";
import {downloadFileInput,downloadTextInput} from "../../services/ProtVarService";
import {DownloadResponse} from "../../types/DownloadResponse";
import {LOCAL_DOWNLOADS} from "../../constants/const";
import {FormData} from '../../types/FormData'
import {AppState} from "../App";

export function processDownload(functional: boolean, population: boolean, structure: boolean,
                                email: string, jobName: string, state: AppState, formData?: FormData) {

    const handleSucc = (downloadRes: DownloadResponse) => {
        let localDownloads = JSON.parse(localStorage.getItem(LOCAL_DOWNLOADS) || "[]")
        localStorage.setItem(LOCAL_DOWNLOADS, JSON.stringify([...localDownloads, downloadRes]));
        Notify.sucs(`Job ${downloadRes.downloadId} submitted. Check the Downloads page. `)
    }

    const handleErr = () => {
        Notify.err(`Job ${jobName} failed. Please try again.`)
    }

    let file = formData?.file || state.file || null;
    let assembly = formData?.assembly?.toString() || state.assembly.toString();
    let userInputs: string[] = [];

    if (!file) {
        userInputs = formData?.userInputs ||
          state.textInput.split(/[\n,]/).filter(i => !i.trimStart().startsWith("#"));
    }

    if (file) {
        downloadFileInput(file, assembly, email, jobName, functional, population, structure)
          .then((response) => handleSucc(response.data))
          .catch(handleErr);
    } else {
        downloadTextInput(userInputs, assembly, email, jobName, functional, population, structure)
          .then((response) => handleSucc(response.data))
          .catch(handleErr);
    }
}