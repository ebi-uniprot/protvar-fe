import Notify from "../elements/Notify";
import {downloadFileInput,downloadTextInput} from "../../services/ProtVarService";
import {DownloadResponse} from "../../types/DownloadResponse";
import {LOCAL_DOWNLOADS} from "../../constants/const";
import {AppState} from "../App";

export function processDownload(state: AppState, functional: boolean, population: boolean, structure: boolean,
                                email: string, jobName: string) {

    const handleSucc = (downloadRes: DownloadResponse) => {
        let localDownloads = JSON.parse(localStorage.getItem(LOCAL_DOWNLOADS) || "[]")
        localStorage.setItem(LOCAL_DOWNLOADS, JSON.stringify([...localDownloads, downloadRes]));
        Notify.sucs(`Job ${downloadRes.downloadId} submitted. Check My Downloads page. `)
    }

    const handleErr = () => {
        Notify.err(`Job ${jobName} failed. Please try again.`)
    }

    if (state.file !== null) {
        downloadFileInput(state.file, state.assembly.toString(), email, jobName, functional, population, structure)
            .then((response ) => handleSucc(response.data))
            .catch(handleErr);
    } else {
        const userInputs = state.textInput.split(/[\n,]/)
          .filter(i => !i.trimStart().startsWith("#"))
        downloadTextInput(userInputs, state.assembly.toString(), email, jobName, functional, population, structure)
            .then((response ) => handleSucc(response.data))
            .catch(handleErr);
    }
}
