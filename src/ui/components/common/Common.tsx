export const pubmedRef = (id: number) => {
  return <sup><a href={`http://www.ncbi.nlm.nih.gov/pubmed/${id}`} target="_blank"
                 rel="noreferrer" title={`Source: PubMed ID ${id}`}>ref</a></sup>
}