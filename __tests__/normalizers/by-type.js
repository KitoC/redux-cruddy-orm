const normalizeByType = require("../../src/normalizers/by-type");
const isFunction = require("lodash/isFunction");

describe("normalizers - by-type - nested data", () => {
  const actual = [
    {
      id: 1,
      type: "user",
      posts: [
        {
          id: 1,
          user: { id: 1, type: "user" },
          type: "post",
          comments: [
            { id: 1, type: "comment", user: { id: 2, type: "user" } },
            { id: 2, type: "comment", user: { id: 3, type: "user" } }
          ]
        }
      ]
    }
  ];

  const expected = {
    user: {
      byId: {
        "1": { id: 1, type: "user", posts: [1] },
        "2": { id: 2, type: "user" },
        "3": { id: 3, type: "user" }
      },
      ids: [1, 2, 3],
      type: "user"
    },
    post: {
      byId: {
        "1": { id: 1, user: 1, type: "post", comments: [1, 2] }
      },
      ids: [1],
      type: "post"
    },
    comment: {
      byId: {
        "1": { id: 1, type: "comment", user: 2 },
        "2": { id: 2, type: "comment", user: 3 }
      },
      ids: [1, 2],
      type: "comment"
    }
  };

  it("normalizes nested data into objects by type", () => {
    expect(normalizeByType(actual)).toEqual(expected);
  });
});

describe("normalizers - by-type - JSON:API", () => {
  const actual = {
    data: [
      {
        id: 1,
        type: "user",
        posts: [
          {
            id: 1,
            user: { id: 1, type: "user" },
            type: "post",
            comments: [
              { id: 1, type: "comment", user: { id: 2, type: "user" } },
              { id: 2, type: "comment", user: { id: 3, type: "user" } }
            ]
          }
        ]
      }
    ],
    included: [
      { id: 2, type: "user", posts: [] },
      { id: 3, type: "user", posts: [] },
      {
        id: 1,
        type: "comment",
        user: { id: 2, type: "user" },
        body: "my Comment Body"
      },
      {
        id: 2,
        type: "comment",
        user: { id: 3, type: "user" },
        body: "my Comment Body"
      }
    ]
  };

  const expected = {
    user: {
      byId: {
        "1": { id: 1, type: "user", posts: [1] },
        "2": { id: 2, type: "user", posts: [] },
        "3": { id: 3, type: "user", posts: [] }
      },
      ids: [1, 2, 3],
      type: "user"
    },
    post: {
      byId: {
        "1": { id: 1, user: 1, type: "post", comments: [1, 2] }
      },
      ids: [1],
      type: "post"
    },
    comment: {
      byId: {
        "1": { id: 1, type: "comment", user: 2, body: "my Comment Body" },
        "2": { id: 2, type: "comment", user: 3, body: "my Comment Body" }
      },
      ids: [1, 2],
      type: "comment"
    }
  };

  it("normalizes JSON:API structured data into objects by type", () => {
    expect(normalizeByType(actual)).toEqual(expected);
  });
});

describe("normalizers - by-type - graphql", () => {
  const actual = {
    users: [
      { id: 1, __typename: "user", posts: [1] },
      { id: 2, __typename: "user", posts: [] },
      { id: 3, __typename: "user", posts: [] }
    ],
    posts: [{ id: 1, user: 1, __typename: "post", comments: [1, 2] }],
    comments: [
      { id: 1, __typename: "comment", user: 2, body: "my Comment Body" },
      { id: 2, __typename: "comment", user: 3, body: "my Comment Body" }
    ]
  };

  const expected = {
    user: {
      byId: {
        "1": { id: 1, __typename: "user", posts: [1] },
        "2": { id: 2, __typename: "user", posts: [] },
        "3": { id: 3, __typename: "user", posts: [] }
      },
      ids: [1, 2, 3],
      __typename: "user"
    },
    post: {
      byId: {
        "1": { id: 1, user: 1, __typename: "post", comments: [1, 2] }
      },
      ids: [1],
      __typename: "post"
    },
    comment: {
      byId: {
        "1": { id: 1, __typename: "comment", user: 2, body: "my Comment Body" },
        "2": { id: 2, __typename: "comment", user: 3, body: "my Comment Body" }
      },
      ids: [1, 2],
      __typename: "comment"
    }
  };

  it("normalizes graphql structured data into objects by type specified", () => {
    expect(normalizeByType(actual, "__typename")).toEqual(expected);
  });
});
