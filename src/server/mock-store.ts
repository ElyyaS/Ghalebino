import "server-only";

import {
  mockCartItems,
  mockNotifications,
  mockUsers,
} from "./mock-data";

type MockUser = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  avatarUrl: string | null;
  bio: string | null;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type MockCartItem = {
  id: number;
  userId: number | null;
  sessionKey: string | null;
  productId: number;
  licenseId: number;
  createdAt: Date;
  updatedAt: Date;
};

type MockNotification = {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
};

type MockPasswordResetToken = {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
};

type MockStore = {
  users: MockUser[];
  cartItems: MockCartItem[];
  notifications: MockNotification[];
  passwordResetTokens: MockPasswordResetToken[];
  passwords: Map<number, string>;
  sessions: Map<string, number>;
};

const globalForMock = globalThis as typeof globalThis & {
  __ghalebinoMockStore?: MockStore;
};

function createInitialStore(): MockStore {
  const passwords = new Map<number, string>();

  passwords.set(1, "admin");
  passwords.set(2, "seller");
  passwords.set(4, "customer");

  return {
    users: mockUsers.map((user) => ({
      ...user,
      role: user.role as MockUser["role"],
      status: user.status as MockUser["status"],
    })),
    cartItems: mockCartItems.map((item) => ({
      ...item,
      userId: item.userId,
      sessionKey: item.sessionKey,
      updatedAt: item.updatedAt,
    })),
    notifications: mockNotifications.map((notification) => ({
      ...notification,
      type: String(notification.type),
      link: notification.link,
      isRead: notification.isRead,
    })),
    passwordResetTokens: [],
    passwords,
    sessions: new Map<string, number>(),
  };
}

export const mockStore =
  globalForMock.__ghalebinoMockStore ??
  (globalForMock.__ghalebinoMockStore =
    createInitialStore());

export function getMockUserByEmail(email: string) {
  const normalized = email.toLowerCase().trim();

  return mockStore.users.find(
    (user) =>
      user.email.toLowerCase() === normalized &&
      user.status === "ACTIVE",
  );
}

export function getMockUserById(userId: number) {
  return mockStore.users.find(
    (user) =>
      user.id === userId &&
      user.status === "ACTIVE",
  );
}

export function addMockUser(
  data: Omit<
    MockUser,
    "id" | "createdAt" | "updatedAt" | "lastLoginAt"
  >,
  password: string,
) {
  const now = new Date();

  const nextId =
    mockStore.users.reduce(
      (max, user) => Math.max(max, user.id),
      0,
    ) + 1;

  const user: MockUser = {
    ...data,
    id: nextId,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.users.push(user);
  mockStore.passwords.set(nextId, password);

  return user;
}

export function updateMockUser(
  userId: number,
  data: Partial<MockUser>,
) {
  const index = mockStore.users.findIndex(
    (user) => user.id === userId,
  );

  if (index === -1) {
    return null;
  }

  const updated: MockUser = {
    ...mockStore.users[index],
    ...data,
    updatedAt: new Date(),
  };

  mockStore.users[index] = updated;

  return updated;
}

export function getMockCartItems(
  owner: { userId: number } | { sessionKey: string },
) {
  return mockStore.cartItems.filter((item) => {
    if ("userId" in owner) {
      return item.userId === owner.userId;
    }

    return item.sessionKey === owner.sessionKey;
  });
}

export function getMockCartItem(
  owner: { userId: number } | { sessionKey: string },
  cartItemId: number,
) {
  return getMockCartItems(owner).find(
    (item) => item.id === cartItemId,
  );
}

export function addMockCartItem(
  owner: { userId: number } | { sessionKey: string },
  productId: number,
  licenseId: number,
) {
  const existing = getMockCartItems(owner).find(
    (item) =>
      item.productId === productId &&
      item.licenseId === licenseId,
  );

  if (existing) {
    return {
      item: existing,
      alreadyExists: true,
    };
  }

  const now = new Date();

  const nextId =
    mockStore.cartItems.reduce(
      (max, item) => Math.max(max, item.id),
      0,
    ) + 1;

  const item: MockCartItem = {
    id: nextId,
    userId:
      "userId" in owner
        ? owner.userId
        : null,
    sessionKey:
      "sessionKey" in owner
        ? owner.sessionKey
        : null,
    productId,
    licenseId,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.cartItems.push(item);

  return {
    item,
    alreadyExists: false,
  };
}

export function removeMockCartItem(
  owner: { userId: number } | { sessionKey: string },
  cartItemId: number,
) {
  const index = mockStore.cartItems.findIndex((item) => {
    if (item.id !== cartItemId) {
      return false;
    }

    if ("userId" in owner) {
      return item.userId === owner.userId;
    }

    return item.sessionKey === owner.sessionKey;
  });

  if (index === -1) {
    return false;
  }

  mockStore.cartItems.splice(index, 1);

  return true;
}

export function clearMockCart(
  owner: { userId: number } | { sessionKey: string },
) {
  for (
    let index = mockStore.cartItems.length - 1;
    index >= 0;
    index--
  ) {
    const item = mockStore.cartItems[index];

    const belongsToOwner =
      "userId" in owner
        ? item.userId === owner.userId
        : item.sessionKey === owner.sessionKey;

    if (belongsToOwner) {
      mockStore.cartItems.splice(index, 1);
    }
  }
}

export function addMockNotification(
  userId: number,
  data: {
    type: string;
    title: string;
    body: string;
  },
) {
  const nextId =
    mockStore.notifications.reduce(
      (max, item) => Math.max(max, item.id),
      0,
    ) + 1;

  const notification: MockNotification = {
    id: nextId,
    userId,
    type: data.type,
    title: data.title,
    body: data.body,
    link: null,
    isRead: false,
    createdAt: new Date(),
  };

  mockStore.notifications.push(notification);

  return notification;
}

export function addPasswordResetToken(
  userId: number,
  tokenHash: string,
  expiresAt: Date,
) {
  const nextId =
    mockStore.passwordResetTokens.reduce(
      (max, item) => Math.max(max, item.id),
      0,
    ) + 1;

  const record: MockPasswordResetToken = {
    id: nextId,
    userId,
    tokenHash,
    expiresAt,
    usedAt: null,
  };

  mockStore.passwordResetTokens.push(record);

  return record;
}

export function getPasswordResetToken(
  tokenHash: string,
) {
  return mockStore.passwordResetTokens.find(
    (item) => item.tokenHash === tokenHash,
  );
}

export function updatePassword(
  userId: number,
  password: string,
) {
  mockStore.passwords.set(userId, password);

  return updateMockUser(userId, {
    passwordHash: "mock",
  });
}