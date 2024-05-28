import { NavLink } from 'react-router-dom'
import { DOWNLOAD, HOME, SEARCH } from '../../constants/BrowserPaths'
import { MappingRecord } from '../../utills/Convertor'

const DefaultPageContent = (props: {
  children: JSX.Element
  downloadCount: number
  searchResults?: MappingRecord[][][]
}) => {
  const { children, downloadCount, searchResults } = props
  return (
    <div className="default-page-content">
      <div className="sidebar">
        <nav>
          <ul>
            <li className="sidebar-menu">
              <NavLink to={HOME}>Search</NavLink>
            </li>
            <li className="sidebar-menu">
              {searchResults?.length ?
                <NavLink to={SEARCH}>Results</NavLink> :
                <NavLink to={SEARCH} className="disabled">Results</NavLink>
              }
            </li>
            <li className="sidebar-menu">
              <NavLink to={DOWNLOAD}>Downloads ({downloadCount})</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-content">{children}</div>
    </div>
  )
}

export default DefaultPageContent
