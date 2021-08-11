import DataLoader from "dataloader";
import { User } from "../entities/User";

// [1, 78, 8, 9]
// [{id: 1, username: 'connor'}, {id: 78, username: 'leland'}, {...}, {...}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    return sortedUsers;
  });
