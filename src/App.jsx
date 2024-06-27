import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import * as dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import MainScreen from "./components/mainScreen";
import ServiceEndMessage from "./components/ServiceEndMessage";
import "./css/App.css";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

function App() {
  const [isServiceEnded, setServiceEnded] = useState(false);

  useEffect(() => {
    const checkIfServiceEndDate = dayjs()
      .tz("Asia/Seoul")
      .isSameOrAfter("2024-07-01", "day");
    setServiceEnded(checkIfServiceEndDate);
  });

  return (
    <div className="App">
      <h1>트게더 댓글 추첨기</h1>
      <div>&nbsp;</div>
      {isServiceEnded ? <ServiceEndMessage /> : <MainScreen />}
      <div className="footer">
        <div>Made by 김뷰엘 with ❤️</div>
        <div>
          <a
            href="https://github.com/dokdo2005/tgd-comment-lottery"
            target={"_blank"}
          >
            <FontAwesomeIcon icon={faGithub} color={"black"} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
