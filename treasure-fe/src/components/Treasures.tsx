import { useHistory, RouteComponentProps } from "react-router-dom";
import { ClientUser, ClientTreasure } from "../../../common/apiSchema";
import {
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	MouseEventHandler,
} from "react";
import Loading from "./Loading";
import * as api from "../api";
import TreasureCard from "./TreasureCard";
import styles from "./Treasures.module.css";
const { treasuresList, header, button } = styles;

interface Props {
	user: ClientUser;
	setUser: Dispatch<SetStateAction<ClientUser | null>>;
}

const Treasures = ({ user, setUser }: Props) => {
	const { goBack }: RouteComponentProps["history"] = useHistory<History>();

	const [treasures, setTreasures] = useState<ClientTreasure[]>([
		{
			id: "",
			treasure_name: "",
			colour: "",
			age: 0,
			cost_at_auction: 0,
			shop: "",
		},
	]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getTreasures().then((treasures) => {
			setTreasures(treasures);
			setLoading(false);
		});
	}, []);

	const handleClick: MouseEventHandler = () => {
		setUser(null);
		goBack();
	};

	return loading ? (
		<Loading />
	) : (
		<div>
			<h1 className={header}>Treasure Palace Shop</h1>
			<button className={button} onClick={handleClick}>
				Sign out
			</button>
			<ul className={treasuresList}>
				{treasures.map((treasure) => {
					return (
						<TreasureCard key={treasure.id} treasure={treasure} user={user} />
					);
				})}
			</ul>
		</div>
	);
};

export default Treasures;
