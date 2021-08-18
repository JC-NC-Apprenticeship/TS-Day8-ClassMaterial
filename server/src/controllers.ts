import { NextFunction, Request, Response } from "express";
import { Treasure } from "./types/Treasures";
import { User } from "./types/Users";
import {
	addUser,
	fetchTreasures,
	fetchSingleUser,
	makeSale,
	updateUser,
} from "./models";
import {
	TreasuresResponse,
	UserResponse,
	SaleResponse,
	ValidPostUserBody,
} from "../../common/apiSchema";

export const getTreasures = (
	req: Request,
	res: Response<TreasuresResponse>
) => {
	fetchTreasures().then((treasures: Treasure[]) => {
		res.status(200).send({ treasures });
	});
};

export const postUser = (
	req: Request,
	res: Response<UserResponse>,
	next: NextFunction
) => {
	const userToAdd: ValidPostUserBody = req.body;
	addUser(userToAdd)
		.then((user: User) => {
			res.status(201).send({ user });
		})
		.catch(next);
};

export const patchUser = (req: Request, res: Response, next: NextFunction) => {
	const { newsletter }: { newsletter: boolean } = req.body;
	const { username } = req.params;
	updateUser(username, { newsletter })
		.then((user: User) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

export const getSingleUser = (
	req: Request,
	res: Response<UserResponse>,
	next: NextFunction
) => {
	const { username } = req.params;

	fetchSingleUser(username)
		.then((user: User) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

export const postSale = (
	req: Request,
	res: Response<SaleResponse>,
	next: NextFunction
) => {
	const { treasure_id, username } = req.body;

	if (typeof treasure_id !== "string") {
		next({ status: 400, msg: "bad request" });
	} else {
		makeSale({ treasure_id, username })
			.then((receipt) => {
				res.status(202).send({ receipt });
			})
			.catch(next);
	}
};
