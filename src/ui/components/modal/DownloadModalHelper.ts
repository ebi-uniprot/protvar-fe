import { API_URL } from "../../../constants/const";
import PapaParse from 'papaparse';
import FileSaver from 'file-saver';
import axios from 'axios';

export function download(file: File | null, searchTerms: string[], functional: boolean, population: boolean, structure: boolean) {
  if (file !== null) {
    let inputArr: Array<string> = [];
    PapaParse.parse(file, {
      step: (row, parser) => {
        const dataRow = row.data.join(' ');
        if (dataRow.length > 1 && !dataRow.startsWith("#"))
          inputArr.push(dataRow);
      },
      complete: () => {
        downloadAndSaveToFile(inputArr, functional, population, structure)
      }
    });
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
  axios.post(APIUrl, inputArr, {
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
    axios.post(APIUrl, formData, {
      headers: config
    }).then((response) => {
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