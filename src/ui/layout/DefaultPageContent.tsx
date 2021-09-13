
const DefaultPageContent = (props: { children: JSX.Element }) => {
  const { children } = props;

  return (
    <div className="default-page-conent">
      {children}
    </div>
  );
};

export default DefaultPageContent;
