import {
	Dispatch,
	SetStateAction,
	FormEvent,
	useState,
	ChangeEvent,
	FormEventHandler,
} from "react";
import { postUser } from "../api";
import { ClientUser, ErrorResponse } from "../../../common/apiSchema";
import { useHistory, RouteComponentProps } from "react-router-dom";
import Error from "./Error";
import styles from "./SignUp.module.css";
const { signUpForm, button } = styles;

interface Props {
	setUser: Dispatch<SetStateAction<ClientUser | null>>;
	setHasAccount: Dispatch<SetStateAction<boolean>>;
}

const SignUp = ({ setUser, setHasAccount }: Props) => {
	const { push }: RouteComponentProps["history"] = useHistory<History>();

	const [input, setInput] = useState<ClientUser>({
		username: "",
		forename: "",
		surname: "",
		subscribed_for_newsletter: true,
	});
	const [err, setErr] = useState<ErrorResponse | null>(null);

	const handleSubmit: FormEventHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		postUser(input)
			.then((user) => {
				setUser(user);
				push("/treasures");
			})
			.catch((err: ErrorResponse) => {
				setErr(err);
			});
	};

	const handleChange = (
		key: keyof ClientUser,
		value: ClientUser[typeof key]
	) => {
		setInput({ ...input, [key]: value });
	};

	const { username, forename, surname, subscribed_for_newsletter } = input;

	return err ? (
		<Error />
	) : (
		<div>
			<form onSubmit={handleSubmit} className={signUpForm}>
				<p>Create account</p>
				<label>
					Username{" "}
					<input
						required
						type="text"
						placeholder="username here"
						onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
							handleChange("username", target.value);
						}}
						value={username}
					/>
				</label>
				<label>
					Forename{" "}
					<input
						required
						type="text"
						placeholder="forename here"
						onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
							handleChange("forename", target.value);
						}}
						value={forename}
					/>
				</label>
				<label>
					Surname{" "}
					<input
						required
						type="text"
						placeholder="surname here"
						onChange={({ target }) => {
							handleChange("surname", target.value);
						}}
						value={surname}
					/>{" "}
				</label>
				<label>
					<button
						type="button"
						onClick={() =>
							handleChange(
								"subscribed_for_newsletter",
								!subscribed_for_newsletter
							)
						}
					>
						{subscribed_for_newsletter ? "✓" : "x"}
					</button>
					{subscribed_for_newsletter
						? "Unsubscribe from the mailing list"
						: "Subscribe to the mailing list"}
				</label>

				<button type="submit">Sign Up</button>
			</form>

			<button className={button} onClick={() => setHasAccount(true)}>
				Already have an account? Click here to sign in
			</button>
		</div>
	);
};

export default SignUp;
