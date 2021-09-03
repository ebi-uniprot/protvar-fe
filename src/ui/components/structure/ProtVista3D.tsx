import useCustomElement from '../../../hooks/useCustomElement';
import { Loader } from 'franklin-sites';

interface ProtVista3DProps {
  accession: string,
  pos: number,
  id: string
}

const ProtVista3D = (props: ProtVista3DProps) => {
  const { accession, pos, id } = props;
  const protvistaStructure = useCustomElement(
    () => import(/* webpackChunkName: "protvista-structure" */ 'protvista-structure'),
    'protvista-structure'
  );

  if (!protvistaStructure)
    return <PageSpecificStructure component={<Loader />} />

  let position = pos + ':' + pos;
  return <PageSpecificStructure component={<protvista-structure accession={accession} structureid={id} highlight={position} />} />
}

interface PageSpecificStructureProps {
  component: JSX.Element
}

const PageSpecificStructure = (props: PageSpecificStructureProps) => {
  return (
    <td colSpan={13} className="expanded-row">
      <div className="significances-groups">
        <div className="column">
          {props.component}
        </div>
      </div>
    </td>
  );
}

export default ProtVista3D;