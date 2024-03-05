import DefaultPageLayout from "../../layout/DefaultPageLayout";
import LegendModal from "../../modal/LegendModal";
import {useParams} from "react-router-dom";
import NewResultTable from "../../components/result/NewResultTable";
import {useEffect} from "react";
import {NewFormData} from "../../NewApp";
import {NewPaginationRow} from "../search/PaginationRow";

interface ResultPageProps {
  loading: boolean
  formData: NewFormData
  getData: any
}

function ResultPageContent(props: ResultPageProps) {

  const params = useParams<{ id: string }>();
  const { id } = params;
  const { loading, formData, getData } = props

  useEffect(() => {
    //getResult(id).then((response) => {
    //  setData(response.data);
    //})

    if (formData.response == null)
      getData(id)

  }, [id, formData, getData])

  if (loading)
    return <>Loading...</>
  else if (formData.response == null)
    return <h5>No result found. Try search for variants again or use a different result id.</h5>

  return <>
    <div className="search-results">
      <div className="flex justify-content-space-between">
        <NewPaginationRow loading={loading}  formData={formData} getData={getData} />
        <div className="legend-container" >
          <LegendModal />
          **DownloadModal**
        </div>

      </div>
      <NewResultTable id={id} data={formData} />
      **Pagination Row**
    </div>
  </>
}

function ResultPage(props: ResultPageProps) {
  return <DefaultPageLayout content={<ResultPageContent {...props} /> } />
}
export default ResultPage;