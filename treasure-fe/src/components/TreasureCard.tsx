import { MouseEventHandler, useState } from "react";
import {
	ClientTreasure,
	ClientUser,
	ErrorResponse,
} from "../../../common/apiSchema";
import { buyTreasure } from "../api";
import Error from "./Error";
import styles from "./TreasureCard.module.css";
const { treasureCard, age, cost, colour } = styles;

interface Props {
	treasure: ClientTreasure;
	user: ClientUser;
}

const TreasureCard = ({ treasure, user: { username } }: Props) => {
	const [receipt, setReceipt] = useState<string>("");
	const [err, setErr] = useState<ErrorResponse | null>(null);

	const handleClick: MouseEventHandler = () => {
		buyTreasure({ treasure_id: treasure.id, username: username })
			.then((receipt) => {
				setReceipt(receipt);
			})
			.catch((err: ErrorResponse) => {
				setErr(err);
			});
	};

	return err ? (
		<Error />
	) : receipt ? (
		<p>{receipt}</p>
	) : (
		<div className={treasureCard}>
			<h2>{treasure.treasure_name}</h2>
			<p className={age}>age: {treasure.age}</p>
			<p className={cost}>£{treasure.cost_at_auction}</p>
			<p className={colour}>{treasure.colour}</p>
			<button onClick={handleClick}>Buy</button>
		</div>
	);
};

export default TreasureCard;
