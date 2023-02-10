import FileSaver from 'file-saver';
import Notify from "../elements/Notify";
import {downloadMappings, emailFileInput, emailTextInput} from "../../services/ProtVarService";

export function download(file: File | null, searchTerms: string[], functional: boolean, population: boolean, structure: boolean) {
  if (file !== null) {
    let inputArr: Array<string> = [];
    file.text()
      .then(text => text.split('\n'))
      .then(lines => {
        for (const dataRow of lines) {
          if (dataRow.length > 1 && !dataRow.startsWith("#"))
            inputArr.push(dataRow);
        }
        downloadAndSaveToFile(inputArr, functional, population, structure)
      })
  } else {
    downloadAndSaveToFile(searchTerms, functional, population, structure)
  }
}

function downloadAndSaveToFile(inputArr: Array<string>, functional: boolean, population: boolean, structure: boolean) {
  Notify.info("Your file will start to download soon")
  downloadMappings(inputArr, functional, population, structure)
    .then((response) => {
      const blob = new Blob([response.data], {type: 'application/csv'});
      FileSaver.saveAs(blob, 'ProtVar-results.csv');
      Notify.sucs("Your file has been downloaded")
    })
    .catch(() => Notify.err("File download failed. Please try again"));
}

export function sendDownloadEmail(file: File | null, searchTerms: string[], functional: boolean, population: boolean, structure: boolean,
  email: string, jobName: string) {
  Notify.info("Your job submitted successfully, report will be sent to your email " + email)
  if (file !== null) {
    emailFileInput(file, email, jobName, functional, population, structure)
      .then(() => Notify.sucs(`Check your email ${email} for results`))
      .catch(() => Notify.err(`Job ${jobName} failed. Please try again`));
  } else {
    emailTextInput(searchTerms, email, jobName, functional, population, structure)
      .then(() => Notify.sucs(`Check your email ${email} for results of job ${jobName}`))
      .catch(() => Notify.err(`Job ${jobName} failed. Please try again`));
  }
}