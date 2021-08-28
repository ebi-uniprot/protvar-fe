import React from 'react';

const InvalidTableRows = (props)=> (props.invalidInputs.map(input => invalidRow(input)));

function invalidRow(invalidInput){
  return <tr key={invalidInput}>
    <td>{invalidInput.chromosome}</td>
    <td>{invalidInput.start}</td>
    <td>{invalidInput.id}</td>
    <td>{invalidInput.ref}</td>
    <td>{invalidInput.alt}</td>
    <td colSpan="12">Input: {invalidInput.inputString} -- Message: {invalidInput.invalidReason}</td>
  </tr>
}

export default InvalidTableRows;