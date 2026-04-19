import { Navigate } from 'react-router-dom'
import { ACTIVITY } from '../../../constants/BrowserPaths'

function ResultListPage() {
  return <Navigate to={ACTIVITY} replace />
}

export default ResultListPage
