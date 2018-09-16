import React from 'react';
import PropTypes from 'prop-types';

import css from './Button.css';

const Button = ({
  htmlType, children, animation, customizeStyles, clickHandler,
}) => {
  const classes = [
    css.Button,
    animation ? css.ClickedButton : '',
  ];
  const inlineCSS = customizeStyles;
  const btn = (
    /* eslint-disable react/button-has-type */
    <button
      type={htmlType}
      className={classes.join(' ')}
      style={inlineCSS}
      onClick={clickHandler}
      onTouchStart={clickHandler}
    >
      <span>{children}</span>
    </button>
    /* eslint-disable react/button-has-type */
  );
  return btn;
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  htmlType: PropTypes.oneOf(['button', 'submit']),
  animation: PropTypes.bool,
  customizeStyles: PropTypes.oneOfType([PropTypes.object]),
  clickHandler: PropTypes.func,
};

Button.defaultProps = {
  children: '',
  htmlType: 'button',
  animation: false,
  customizeStyles: {},
  clickHandler: () => null,
};

export default Button;
