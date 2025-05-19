type SvgHome = React.SVGAttributes<SVGSVGElement>;

const SvgHome: React.FC<SvgHome> = (props) => {
  return(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#09090B"
      fillRule="evenodd"
      d="M14.58.872a.6.6 0 0 1 .84 0l13.5 13.28a.6.6 0 0 1-.84.856L25.5 12.47V25a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V12.47l-2.58 2.538a.6.6 0 1 1-.84-.856zm.42 1.27 9.513 9.358H24.5v13h-5V17a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5v7.5h-7v-13h-.013zM13.5 24.5h5v-7h-5z"
      clipRule="evenodd"
    />
  </svg>
);};
export default SvgHome;
