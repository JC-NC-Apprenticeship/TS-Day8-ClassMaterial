import {
	useState,
	FormEvent,
	Dispatch,
	SetStateAction,
	FormEventHandler,
} from "react";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { ClientUser, ErrorResponse } from "../../../common/apiSchema";
import Error from "./Error";
import { getUser } from "../api";
import SignUp from "./SignUp";
import styles from "./SignIn.module.css";
const { signIn, signInForm, button } = styles;

interface Props {
	setUser: Dispatch<SetStateAction<ClientUser | null>>;
}

const SignIn = ({ setUser }: Props) => {
	const { push }: RouteComponentProps["history"] = useHistory<History>();

	const [input, setInput] = useState("");
	const [err, setErr] = useState<ErrorResponse | null>(null);
	const [hasAccount, setHasAccount] = useState(true);

	const handleSubmit: FormEventHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		getUser(input)
			.then((user) => {
				setUser(user);
				push("/treasures");
			})
			.catch((err: ErrorResponse) => {
				setErr(err);
			});
	};

	return err ? (
		<Error />
	) : hasAccount ? (
		<div className={signIn}>
			<form onSubmit={handleSubmit} className={signInForm}>
				<label>
					Sign in with username
					<input
						required
						type="test"
						placeholder="username here"
						onChange={(e) => setInput(e.target.value)}
						value={input}
					/>
					<button>Sign In</button>
				</label>
			</form>
			<button className={button} onClick={() => setHasAccount(false)}>
				Click here to create an account
			</button>
		</div>
	) : (
		<SignUp setUser={setUser} setHasAccount={setHasAccount} />
	);
};

export default SignIn;
