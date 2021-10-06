import { API_URL } from "../../constants/const";
import FileSaver from 'file-saver';
import axios, { AxiosResponse } from 'axios';
import Notify from "../elements/Notify";

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
  const APIUrl = `${API_URL}/download/download?function=${functional}&variation=${population}&structure=${structure}`

  Notify.info("Your file will start to download soon")
  const headers = {
    'Content-Type': 'application/json',
    Accept: '*'
  };
  axios.post<string[], AxiosResponse>(APIUrl, inputArr, { headers: headers })
    .then((response) => {
      const blob = new Blob([response.data], {type: 'application/csv'});
      FileSaver.saveAs(blob, 'pepvep-results.csv');
      Notify.sucs("Your file has been downloaded")
    })
    .catch(() => Notify.err("File download failed. Please try again"));
}

export function sendDownloadEmail(file: File | null, searchTerms: string[], functional: boolean, population: boolean, structure: boolean,
  email: string, jobName: string) {
  const type = file === null ? 'search' : 'file';
  const APIUrl = `${API_URL}/download/${type}?email=${email}&jobName=${jobName}&function=${functional}&variation=${population}&structure=${structure}`

  Notify.info("Your job submitted successfully, report will be sent to your email " + email)
  if (file !== null) {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post(APIUrl, formData, config)
      .then(() => Notify.sucs(`Check your email ${email} for results`))
      .catch(() => Notify.err(`Job ${jobName} failed. Please try again`));
  } else {
    const headers = {
      'Content-Type': 'application/json',
      Accept: '*'
    };
    axios.post(APIUrl, searchTerms, { headers: headers })
      .then(() => Notify.sucs(`Check your email ${email} for results of job ${jobName}`))
      .catch(() => Notify.err(`Job ${jobName} failed. Please try again`));
  }
}