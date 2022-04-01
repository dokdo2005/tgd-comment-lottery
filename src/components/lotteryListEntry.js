import { ListGroup } from "react-bootstrap";
import streamerIcon from "../img/streamer_icon.png";
import moderatorIcon from "../img/moderator_icon.png";

function LotteryListEntry({ entry }) {
  return (
    <ListGroup.Item eventKey={entry.id}>
      <img src={entry.profile} width={30.8} style={{ borderRadius: "50%" }} />
      &nbsp;
      {entry.broadcaster || entry.moderator ? (
        <img src={entry.broadcaster ? streamerIcon : moderatorIcon} />
      ) : null}
      &nbsp;{entry.nickname}
    </ListGroup.Item>
  );
}

export default LotteryListEntry;
