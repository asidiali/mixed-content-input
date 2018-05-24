import React from 'react';

export default class MixedContentInput extends React.Component {

  state = {
    showParamOptions: false,
  };

  hideParamOptions = () => this.setState({ showParamOptions: false });

  /*
   * Parse Params
   * This is the main piece of separating out params from the rest of the string.
   * This function needs to be "react"ified...
   */
  parseParams = (str, params) => {
    // detect and break up string by params
    const splitStr = str.split(/\{([^}]+)\}/);

    if (splitStr && splitStr.length && params) {
      const el = splitStr.map((part) => {
        if (part === '') return false;
        if (params && params.includes(part)) {
          return (
            <div
              key={`param-button-${this.props.section}-${part}`}
              ref={ref => (this[`param_${part}`] = ref)}
              contentEditable={false}
              id={`param-button-${this.props.section}-${part}`}
              className="param-button"
              style={styles.paramButton}
              onClick={() => this.handleParamButtonClick(part)}
            >
              {part}
            </div>
          )
        }
        return part;
      });
      return el;
    }

    return str;
  }

  onInputFocus = (e) => {
    const template = this.props.template;
    const section = this.props.section;
    console.log(`${template}/${section} input focused`);
  }

  onInputBlur = (e) => {
    const el = e.target;
    const val = el.innerHTML;
    let sanStr = val.replace(/(<([^>]+)>)/ig, '');
    sanStr = sanStr.replace(/&nbsp;/g, ' ');

    const section = this.props.section;

    let params = this.props.paramOptions;
    if (params && params.length) {
      params.forEach((param, index) => {
        sanStr = sanStr.replace(param, `{${param}}`);
        if (index === params.length - 1) {
          this.props.update(section, sanStr)
            .then(() => console.log('Update successful'));
        }
      });
    }
  }

  handleParamButtonClick = (param) => {
    this.setState({
      showParamOptions: true,
      selectedParam: param,
    });
  }

  /*
  onInputClick = (e) => {
    const clickTarget = e.target;
    const targetClass = clickTarget.getAttribute('class');

    if (targetClass === 'param-button') {
      this.setState({
        showParamOptions: true,
        selectedParam: clickTarget.textContent,
      });
    }
  }
  */

  handleParamOptionClick = (option) => {
    const param = this.state.selectedParam;
    const ref = this[`param_${param}`];

    const str = this.props.content;
    const splitStr = str.split(/\{([^}]+)\}/);
    let updatedStr = '';
    splitStr.forEach((part) => {
      if (part === '') return false;
      if (part === param) return updatedStr += `{${option}}`;
      return updatedStr += part;
    });

    this.props.update(this.props.section, updatedStr)
      .then(() => this.setState({ selectedParam: null, showParamOptions: false }));
  }

  render() {
    return (
      <div
        style={styles.container}
      >
        {/*
          *
          * This is the main component input
          *
          *
        */}
        <div
          ref={ref => (this.input = ref)}
          style={{ ...styles.input, ...this.props.style || {}  }}
          contentEditable
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onClick={this.onInputClick}
        >
          {this.parseParams(this.props.content, this.props.paramOptions)}
        </div>
        {/*
          *
          * This is the hidden params popup menu
          *
          *
        */}
        {this.state.showParamOptions ? (
          <div
            id={`params-list-wrapper-${this.props.template}-${this.props.section}`}
            onClick={this.hideParamOptions}
            style={styles.paramsListWrapper}
          >
            <ul
              id={`params-list-${this.props.template}-${this.props.section}`}
              style={styles.paramsList}
            >
              {this.props.paramOptions.map((option, index) => (
                <li
                  key={`param-option-${index}`}
                  id={`param-option-${option}`}
                  className="param-option"
                  style={styles.paramOption(false)}
                  onClick={() => this.handleParamOptionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ) : false}
      </div>
    );
  }
}

const styles = {
  container: {},
  input: {
    margin: 0,
    fontSize: '1.25em',
    lineHeight: 1.75,
  },
  paramButton: {
    background: '#f5f5f5',
    margin: 'auto 3px',
    fontSize: '0.9em',
    border: '1px solid #09a3ed',
    padding: 5,
    borderRadius: 5,
    color: '#09a3ed',
    userSelect: 'none',
    display: 'inline-block',
  },
  paramsListWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    height: '100vh',
    width: '100vw',
    flexFlow: 'column nowrap',
    justifyContent: 'center',
  },
  paramsList: {
    width: 400,
    margin: 'auto',
    padding: 0,
    background: '#fff',
    listStyle: 'none',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  paramOption: active => ({
    fontWeight: active ? 700 : 400,
    fontSize: '1.1em',
    padding: 15,
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
  }),
};
