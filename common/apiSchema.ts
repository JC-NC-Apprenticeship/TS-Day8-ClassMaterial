import { Treasure } from "../server/src/types/Treasures";
import { User } from "../server/src/types/Users";

export type TreasuresResponse = {
	treasures: Treasure[];
};

export type ErrorResponse = {
	status: number;
	msg: string;
};

export type UserResponse = {
	user: User;
};

export type NewUser = Omit<User, "id" | "shop_name" | "purchases">;

export type SaleResponse = { receipt: string };

export type SaleRequest = {
	treasure_id: string;
	username: string;
};

export type ClientUser = {
	username: string;
	subscribed_for_newsletter: boolean;
	forename: string;
	surname: string;
	shop_name?: string | null;
	purchases?: (string | null)[] | null;
};

export type ClientTreasure = {
	id: string;
	treasure_name: string;
	colour: string;
	age: number;
	cost_at_auction: number;
	shop: string;
};

export type ValidPostUserBody = {
  username: string;
  forename: string;
  surname: string;
  subscribed_for_newsletter: boolean;
};
