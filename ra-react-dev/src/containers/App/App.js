import React from 'react';

import '../../normalize.css';
import '../../global.css';
import css from './App.css';
import Button from '../../components/Button/Button';

const cssBtnNumbers = {
  margin: '10px',
};

const cssBtnOperators = {
  margin: '5px',
  backgroundColor: 'grey',
  height: '55px',
  width: '55px',
  borderRadius: '10px',
  color: 'white',
  fontSize: '30px',
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '0',
      arithmeticOperator: '',
      operands: { leftOperand: '', rightOperand: '' },
      zeroDivizion: false,
    };
  }

  onClickDigitHandler = (digit) => {
    let { value: currentValue } = this.state;
    currentValue = String(currentValue);
    if (currentValue.length === 1 && currentValue === '0' && digit === 0) return;
    this.setState((prevState) => {
      let newValue = digit;
      const prevValue = String(prevState.value);
      if (prevValue[0] === '0') {
        newValue = digit;
      } else {
        newValue = `${prevState.value}${digit}`;
      }
      return ({ value: newValue });
    });
  }

  onCanselHandler = () => {
    this.setState({
      value: '0',
      arithmeticOperator: '',
      operands: { leftOperand: '', rightOperand: '' },
    });
  }

  onDeleteLastDigitHandler = () => {
    this.setState((prevState) => {
      const prevValue = String(prevState.value);
      if (prevValue.length === 1) { return { value: '0' }; }
      const newValue = prevValue.substr(0, prevValue.length - 1);
      return { value: newValue };
    });
  }

  doMath = () => {
    const { arithmeticOperator, operands } = this.state;
    // handle errors first
    if (!arithmeticOperator) {
      this.setState({
        value: '0',
        arithmeticOperator: '',
        operands: { leftOperand: '', rightOperand: '' },
      });
      return;
    }
    // handle zero divizion case
    if (arithmeticOperator === '/' && operands.rightOperand === '0') {
      this.setState({
        value: '0',
        arithmeticOperator: '',
        operands: { leftOperand: '', rightOperand: '' },
        zeroDivizion: true,
      });
      setTimeout(() => this.setState({ zeroDivizion: false }), 500);
      return;
    }
    // handle missing any operand
    if (!String(operands.leftOperand) && !String(operands.rightOperand)) {
      this.setState({
        value: '0',
        arithmeticOperator: '',
        operands: { leftOperand: '', rightOperand: '' },
      });
      return;
    }
    // form query request for server
    let query = {
      [arithmeticOperator]: [Number(operands.leftOperand), Number(operands.rightOperand)],
    };
    query = JSON.stringify(query);
  }

  arithmeticOperatorBtnHandler = (arithmeticOperator) => {
    const { operands } = this.state;
    if (!String(operands.leftOperand)) {
      this.setState(prevState => ({
        value: '0',
        operands: { leftOperand: prevState.value, rightOperand: '' },
      }));
    }
    if (!!String(operands.leftOperand) && !String(operands.rightOperand)) {
      this.setState(prevState => ({
        value: '0',
        operands: { leftOperand: prevState.operands.leftOperand, rightOperand: prevState.value },
      }));
    }
    if (!!String(operands.leftOperand) && !!String(operands.rightOperand)) {
      this.setState(prevState => ({
        value: '0',
        operands: { leftOperand: prevState.operands.rightOperand, rightOperand: prevState.value },
      }));
    }
    // show sign on calculator display
    if (arithmeticOperator !== '=') {
      this.setState({ arithmeticOperator });
    } else {
      setTimeout(() => this.doMath(), 0);
    }
  }

  render() {
    const { value, arithmeticOperator, zeroDivizion } = this.state;
    // make buttons with digits from 0 to 9
    const digitsButtons = Array(12).fill('').map((btn, index) => {
      const digit = index !== 9 ? index + 1 : 0;
      let button = (
        <Button
          customizeStyles={cssBtnNumbers}
          clickHandler={() => this.onClickDigitHandler(digit)}
          key={digit}
        >
          {String(digit)}
        </Button>
      );
      if (index === 10) {
        button = (
          <Button
            customizeStyles={{ backgroundColor: '#ff9999', margin: '10px', fontSize: '32px' }}
            clickHandler={() => this.onCanselHandler(digit)}
            key={digit}
          >
            CA
          </Button>
        );
      }
      if (index === 11) {
        button = (
          <Button
            customizeStyles={{ backgroundColor: '#ff9999', margin: '10px', fontSize: '28px' }}
            clickHandler={() => this.onDeleteLastDigitHandler(digit)}
            key={digit}
          >
            DEL
          </Button>
        );
      }
      return button;
    });
    return (
      <div className={css.App}>
        <div className={css.displayWrapper}>
          <input
            className={css.displayWrapper_input}
            value={!zeroDivizion ? value : 'Zero Divizion!'}
          />
          <span className={css.displayWrapper_sign}>{arithmeticOperator}</span>
        </div>
        <div className={css.digitsWrapper}>
          {digitsButtons}
        </div>
        <div className={css.operButtonsWrapper}>
          <Button customizeStyles={cssBtnOperators} clickHandler={() => this.arithmeticOperatorBtnHandler('+')}>+</Button>
          <Button customizeStyles={cssBtnOperators} clickHandler={() => this.arithmeticOperatorBtnHandler('-')}>-</Button>
          <Button customizeStyles={cssBtnOperators} clickHandler={() => this.arithmeticOperatorBtnHandler('*')}>*</Button>
          <Button customizeStyles={cssBtnOperators} clickHandler={() => this.arithmeticOperatorBtnHandler('/')}>/</Button>
          <Button
            customizeStyles={{ ...cssBtnOperators, width: '100px' }}
            clickHandler={() => this.arithmeticOperatorBtnHandler('=')}
          >
            =
          </Button>
        </div>
      </div>
    );
  }
}
