import useCustomElement from '../../../hooks/useCustomElement';
import Loader from '../../elements/Loader';
import StructureIcon from '../../../images/structures-3d.svg';

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
    <td colSpan={10} className="expanded-row">
      <div className="significances-groups">
        <div className="column">
          <h5><img src={StructureIcon} className="click-icon" alt="structure icon" title="3D structure" /> Structures</h5>
          {props.component}
        </div>
      </div>
    </td>
  );
}

export default ProtVista3D;