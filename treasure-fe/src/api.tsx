import axios, { AxiosResponse } from "axios";
import {
	TreasuresResponse,
	UserResponse,
	ClientUser,
	SaleRequest,
	SaleResponse,
	ClientTreasure,
} from "../../common/apiSchema";

const baseURL = `http://localhost:8080/api`;

export const getUser = (username: string): Promise<ClientUser> => {
	return axios
		.get<UserResponse>(`${baseURL}/users/${username}`)
		.then(({ data: { user } }) => {
			return user;
		});
};

export const postUser = (user: ClientUser): Promise<ClientUser> => {
	return axios
		.post<ClientUser, AxiosResponse<UserResponse>>(`${baseURL}/users`, user)
		.then(({ data: { user } }) => {
			return user;
		});
};

export const getTreasures = (): Promise<ClientTreasure[]> => {
	return axios
		.get<TreasuresResponse>(`${baseURL}/treasures`)
		.then(({ data: { treasures } }) => {
			return treasures;
		});
};

export const buyTreasure = (saleRequest: SaleRequest): Promise<string> => {
	return axios
		.post<SaleRequest, AxiosResponse<SaleResponse>>(
			`${baseURL}/sale`,
			saleRequest
		)
		.then(({ data: { receipt } }) => {
			return receipt;
		});
};
