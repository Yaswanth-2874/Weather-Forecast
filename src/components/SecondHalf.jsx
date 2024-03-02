import React from "react";
import DisplayButton from "./DisplayButton";
function SecondHalf(props) {
  const { data, func } = props;
  return (
    <div className="secondhalf">
      <DisplayButton data={data} func={func} index={0} />
      <DisplayButton data={data} func={func} index={1} />
      <DisplayButton data={data} func={func} index={2} />
      <DisplayButton data={data} func={func} index={3} />
      <DisplayButton data={data} func={func} index={4} />
      <DisplayButton data={data} func={func} index={5} />
    </div>
  );
}

export default SecondHalf;
