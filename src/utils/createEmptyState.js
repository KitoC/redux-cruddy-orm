const createEmptyState = ({ name }) => ({
  byId: {},
  ids: [],
  errors: [],
  loading: false,
  name
});

module.exports = createEmptyState;
