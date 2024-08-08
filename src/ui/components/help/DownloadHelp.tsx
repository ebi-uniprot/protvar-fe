import React from "react";
import {HelpBtn} from "./HelpBtn";
import {downloadStatus} from "../../pages/download/DownloadPage";


export const DownloadHelp = () => {
  return <HelpBtn title="" content={<DownloadHelpContent/>} />
}

const DownloadHelpContent = () => {
  return <div className="help-section">
    <h5>About My Result Download</h5>

    <p>1. <strong>Full Input Download</strong></p>
    <ul>
      <li>When downloading the complete results for a specific input (e.g., <code>XYZ</code>), the download ID will be
        the same as the input ID.
      </li>
      <li><strong>Example:</strong> For input <code>XYZ</code>, the download ID will be <code>XYZ</code>.</li>
    </ul>

    <p>2. <strong>Partial Download by Page</strong></p>
    <ul>
      <li>If downloading a specific page, or if the default page size has been changed, the download ID will include
        additional information to indicate this.
      </li>
      <li><strong>Example:</strong>
        <ul>
          <li>For page one of input <code>XYZ</code>, the download ID will be <code>XYZ-1</code>.</li>
          <li>For page one with a page size of 50, the download ID will be <code>XYZ-1-50</code>.</li>
        </ul>
      </li>
    </ul>

    <p><strong>General Format</strong></p>
    <p>The format for download IDs is as follows: <code>UUID[-<em>page</em>][-<em>pageSize</em>]</code></p>

    <p><strong>Components:</strong></p>
    <ul>
      <li><code>UUID</code>: The unique identifier for the input.</li>
      <li><code>page</code> (optional): Indicates the specific page number being downloaded.</li>
      <li><code>pageSize</code> (optional): Indicates the number of results per page if it differs from the default.</li>
    </ul>

    <p><strong>Download Annotations</strong></p>
    <p>Downloads can be customised with or without annotations:</p>
    <ul>
      <li>If functional information is checked in the download option, <code>-fun</code> is appended to the download ID.
      </li>
      <li>If population information is checked in the download option, <code>-pop</code> is appended to the download ID.
      </li>
      <li>If structure information is checked in the download option, <code>-str</code> is appended to the download ID.
      </li>
    </ul>

    <p><strong>General Format with Annotations</strong></p>
    <p>The format for download IDs with options is as
      follows: <code>UUID[-fun][-pop][-str][-<em>page</em>][-<em>pageSize</em>]</code></p>

    <p><strong>Whole Protein Downloads</strong></p>
    <p>The same format applies for whole protein downloads, but the UniProt accession is used as the ID instead of the
      randomly generated UUID for custom inputs. The format for whole protein download IDs
      is: <code>ACCESSION[-fun][-pop][-str][-<em>page</em>][-<em>pageSize</em>]</code>.</p>

    <p>This ensures that download file names accurately reflect the scope of the data they contain, helping to keep
      files organised.</p>

    <p><strong>Download Management</strong></p>
    <p>Use <em>edit</em> <i className="bi bi-pencil"></i>, <em>download</em> <i
      className="bi bi-download"></i> and <em>delete</em> <i className="bi bi-trash"></i> to manage downloads.</p>

    <p><strong>Download Status</strong></p>
    <ul>
      <li><span className={downloadStatus[1].icon}></span> <em>{downloadStatus[1].text}:</em> The download is prepared and
        available for retrieval.
      </li>
      <li><span className={downloadStatus[0].icon}></span> <em>{downloadStatus[0].text}:</em> The download is currently
        being prepared and will be available soon.
      </li>
      <li><span className={downloadStatus[-1].icon}></span> <em>{downloadStatus[-1].text}:</em> The download cannot be
        prepared due to an error or missing data.
      </li>
    </ul>
  </div>
}