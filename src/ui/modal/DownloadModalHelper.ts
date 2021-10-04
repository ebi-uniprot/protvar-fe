import { API_URL } from "../../constants/const";
import FileSaver from 'file-saver';
import axios, { AxiosResponse } from 'axios';

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

  const headers = {
    'Content-Type': 'application/json',
    Accept: '*'
  };
  axios.post<string[], AxiosResponse>(APIUrl, inputArr, {
    headers: headers
  }).then((response) => {
    let blob = new Blob([response.data], {
      type: 'application/csv'
    });
    FileSaver.saveAs(blob, 'pepvep.csv');
  });
}

export function sendDownloadEmail(file: File | null, searchTerms: string[], functional: boolean, population: boolean, structure: boolean,
  email: string, jobName: string) {
  const type = file === null ? 'search' : 'file';
  const APIUrl = `${API_URL}/download/${type}?email=${email}&jobName=${jobName}&function=${functional}&variation=${population}&structure=${structure}`

  if (file !== null) {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post(APIUrl, formData, config).then((response) => {
      console.log('response -> ' + response.data);
    });
  } else {
    const headers = {
      'Content-Type': 'application/json',
      Accept: '*'
    };
    axios.post(APIUrl, searchTerms, {
      headers: headers
    }).then((response) => {
      console.log('response -> ' + response.data);
    });
  }
}