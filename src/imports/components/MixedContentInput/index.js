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
    const parsedString = str.match(/\{([^}]+)\}/);
    if (params && parsedString) { // if there are any params available to add to the string...
      // find all param matches in the string and iterate through each one
      const replacedStr = str.replace(/{(.*?)}/g, (match, offset, string) => {
        const sanitizedMatch = match.substring(1, match.length - 1);
        const newStr = `<div contentEditable="false" id="param-button-${sanitizedMatch}" class="param-button" style="background: #f5f5f5; margin: auto 3px; font-size: 0.9em; border: 1px solid #09a3ed; padding: 5px; border-radius: 5px; color: #09a3ed; user-select: none; display: inline-block;">${sanitizedMatch}</div>`;
        // return the newly formed string back to the original replace iteration
        return newStr;
      });
      // return the final replaced string after iterating through all string matches
      return replacedStr;
    }
    // If there aren't any params to add - just return the original string
    //
    // If there are params IN the original string, they WILL NOT be parsed as
    // there are no matching available param options also included.
    //
    // This should never be the case as if there is a param in the string,
    // that param will also be listed as an available param.
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

    let params = this.props.paramOptions;
    if (params && params.length) {
      params.forEach((param, index) => {
        sanStr = sanStr.replace(param, `{${param}}`);
        if (index === params.length - 1) {
          this.props.update(val)
            .then(() => console.log('Update successful'));
        }
      });
    }
  }

  onInputClick = (e) => {
    const clickTarget = e.target;
    const targetClass = clickTarget.getAttribute('class');

    if (targetClass === 'param-button') {
      this.setState({ showParamOptions: true });
    }
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
          style={styles.input}
          dangerouslySetInnerHTML={{ __html: this.parseParams(this.props.content, this.props.paramOptions) }}
          contentEditable
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onClick={this.onInputClick}
        >
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
    margin: '40px auto',
    width: 600,
    height: 400,
    background: '#fff',
    border: '1px solid #eee',
    fontSize: '1.25em',
    lineHeight: 1.75,
    padding: 40,
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
