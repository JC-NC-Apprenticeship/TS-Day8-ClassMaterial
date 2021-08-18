import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Treasures from "./components/Treasures";
import { ClientUser } from "../../common/apiSchema";
import styles from "./App.module.css";

function App() {
	const [user, setUser] = useState<ClientUser | null>(null);

	return (
		<div className={styles.App}>
			<Router>
				<Switch>
					{user ? (
						<Route path="/treasures" component={Treasures}>
							<Treasures user={user} setUser={setUser} />
						</Route>
					) : (
						<Route path="/">
							<SignIn setUser={setUser} />
						</Route>
					)}
				</Switch>
			</Router>
		</div>
	);
}

export default App;
