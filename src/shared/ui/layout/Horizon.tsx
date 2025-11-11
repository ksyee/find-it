interface HorizonProps {
  lineBold: "bold" | "thin";
  lineWidth: "short" | "long";
}

const Horizon = ({ lineBold, lineWidth }: HorizonProps) => {
  let style: string = "";

  if (lineBold === "thin" && lineWidth === "short") {
    style = "h-px w-[315px] bg-gray-300 opacity-60";
  } else if (lineBold === "bold" && lineWidth === "short") {
    style = "h-[1.5px] w-[315px] bg-gray-300";
  } else if (lineBold === "thin" && lineWidth === "long") {
    style = "h-px w-full bg-gray-300 opacity-60";
  } else if (lineBold === "bold" && lineWidth === "long") {
    style = "h-[1.5px] w-full bg-gray-300";
  }

  return <div className={style}></div>;
};

export default Horizon;
