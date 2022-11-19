import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import streamerIcon from "../img/streamer_icon.png";
import moderatorIcon from "../img/moderator_icon.png";
import "../css/lotteryListEntry.css";

function LotteryListEntry({ type, entry, deleteList, deleteAvailable }) {
  return (
    <ListGroup.Item eventKey={entry.id} active={false}>
      <div className="listEntryArea">
        <div className="listNameArea">
          <img
            src={entry.profile}
            width={30.8}
            style={{ borderRadius: "50%" }}
          />
          &nbsp;
          {entry.broadcaster || entry.moderator ? (
            <img src={entry.broadcaster ? streamerIcon : moderatorIcon} />
          ) : null}
          &nbsp;{entry.nickname}
        </div>
        <div className="listButtonArea">
          {type === "original" ? (
            <Button
              variant="danger"
              disabled={!deleteAvailable}
              onClick={() => deleteList(entry.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          ) : null}
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default LotteryListEntry;
