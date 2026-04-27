import { Navigate } from 'react-router-dom'
import { ACTIVITY } from '../../../constants/BrowserPaths'

function DownloadPage() {
  return <Navigate to={`${ACTIVITY}?tab=downloads`} replace />
}

export default DownloadPage
