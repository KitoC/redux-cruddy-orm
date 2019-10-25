const addA11y = ({
  values,
  onClick,
  withEvent,
  onKeyPress,
  role = "button"
}) => {
  const _onKeyPress = onKeyPress || onClick;

  if (onClick) {
    return {
      role,
      tabIndex: 0,
      onKeyPress: e => {
        if (e.which === 13) {
          if (withEvent) return _onKeyPress(e, values);
          return _onKeyPress(values);
        }
        return null;
      },
      onClick: e => {
        if (withEvent) return onClick(e, values);
        return onClick(values);
      }
    };
  }
  return {};
};

export default addA11y;
