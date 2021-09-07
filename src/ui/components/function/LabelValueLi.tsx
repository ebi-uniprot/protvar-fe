interface LabelValueLiProps {
  label: string
  value: string
}

function LabelValueLi(props: LabelValueLiProps) {
  if (!props.value)
    return <></>

  return (
    <li key={props.label + props.value}>
      <b>{props.label}: </b>
      {props.value}
    </li>
  );
}
export default LabelValueLi