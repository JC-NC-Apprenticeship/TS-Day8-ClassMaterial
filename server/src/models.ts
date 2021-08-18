import fs from 'fs';
import { Treasure } from './types/Treasures';
import { User } from './types/Users';
import { NewUser, SaleRequest } from '../../common/apiSchema';
import path from 'path';

const USERS_PATH = path.join('.', 'src', 'data', 'users.json');
const TREASURES_PATH = path.join('.', 'src', 'data', 'treasures.json');

const isNewUser = (user: Partial<NewUser>): user is NewUser => {
  let hasKeys = true;

  if (typeof user.forename !== 'string') hasKeys = false;
  if (typeof user.surname !== 'string') hasKeys = false;
  if (typeof user.subscribed_for_newsletter !== 'boolean') hasKeys = false;
  return hasKeys;
};

const isUndefined = (thing: any): thing is undefined => {
  return thing === undefined;
};

export const fetchTreasures: () => Promise<Treasure[]> = () => {
  return fs.promises
    .readFile(TREASURES_PATH, 'utf-8')
    .then((treasureString) => {
      const treasures: Treasure[] = JSON.parse(treasureString);
      return treasures;
    });
};

export const addUser: (newUser: NewUser) => Promise<User> = (newUser) => {
  if (!isNewUser(newUser)) {
    return Promise.reject({ status: 422, msg: 'invalid input' });
  }
  return fs.promises
    .readFile(USERS_PATH, 'utf-8')
    .then((usersString) => {
      const users: User[] = JSON.parse(usersString);
      const userToAdd: User = {
        ...newUser,
      };
      users.push(userToAdd);

      return Promise.all([
        userToAdd,
        fs.promises.writeFile(USERS_PATH, JSON.stringify(users)),
      ]);
    })
    .then(([userToAdd]) => {
      return userToAdd;
    });
};

export const fetchSingleUser: (username: string) => Promise<User> = (
  username
) => {
  return fs.promises.readFile(USERS_PATH, 'utf-8').then((usersString) => {
    const users: User[] = JSON.parse(usersString);
    const foundUser: User | undefined = users.find(
      (user) => user.username === username
    );
    if (!foundUser) return Promise.reject({ status: 404, msg: 'not found' });
    return foundUser;
  });
};

export const updateUser = (
  usernameToUpdate: string,
  { newsletter }: { newsletter: boolean }
) => {
  if (typeof newsletter === "boolean") {
    return fs.promises
      .readFile(USERS_PATH, "utf-8")
      .then((usersString) => {
        const users: User[] = JSON.parse(usersString);
        const user = users.find(
          ({ username }) => username === usernameToUpdate
        );
        if (user !== undefined) {
          user.subscribed_for_newsletter = newsletter;
          return Promise.all([
            user,
            fs.promises.writeFile(USERS_PATH, JSON.stringify(users)),
          ]);
        } else {
          return Promise.reject({ status: 404, msg: "not found" });
        }
      })
      .then(([user]) => {
        return user;
      });
  } else {
    return Promise.reject({ status: 422, msg: "cannot process request" });
  }
};

export const makeSale: ({
  treasure_id,
  username,
}: {
  treasure_id: string;
  username: string;
}) => Promise<string> = ({ treasure_id, username }) => {
  return Promise.all([
    fetchTreasures(),
    fs.promises.readFile(USERS_PATH, 'utf-8'),
  ])
    .then(([treasures, usersString]) => {
      const treasureToBuy = treasures.find(
        (treasure) => treasure.id === treasure_id
      );
      const remainingTreasures = treasures.filter(
        (treasure) => treasure.id !== treasure_id
      );
      const users: User[] = JSON.parse(usersString);

      const purchasingUser = users.find((user) => user.username === username);

      if (!isUndefined(purchasingUser) && !isUndefined(treasureToBuy)) {
        purchasingUser.purchases?.push(treasureToBuy.treasure_name);
        return Promise.all([
          treasureToBuy,
          fs.promises.writeFile(USERS_PATH, JSON.stringify(users)),
          fs.promises.writeFile(
            TREASURES_PATH,
            JSON.stringify(remainingTreasures)
          ),
          fs.promises,
        ]);
      } else {
        return Promise.reject({ status: 404, msg: 'not found' });
      }
    })
    .then(([treasureToBuy]) => {
      return `You purchased ${treasureToBuy?.treasure_name} from ${
        treasureToBuy?.shop
      }, colour: ${treasureToBuy.colour.toUpperCase()}`;
    });
};
