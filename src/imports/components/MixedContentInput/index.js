import React from 'react';

export default class MixedContentInput extends React.Component {

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
        // create a global event listener for the click
        // has to be global because this is created before the
        // state change is rendered, so el isn't in the DOM yet
        window.addEventListener('click', (e) => {
          // get click target to check class
          const target = e.target;
          console.log(e.currentTarget);
          console.log(e.target);
          console.log(e);
          const cname = target.getAttribute('class');
          if (cname && cname === 'param-button') { // if we clicked on a param button in the input...
            // pull the value from the button
            const clickedMatch = target.textContent;
            let listHTML = '';
            // create available options for the popup and inject them into the popup list
            params.forEach((param) => {
              listHTML += `<li id="param-option-${param}" data-for="${clickedMatch}" class="param-option" style="font-weight: ${(param === clickedMatch) ? '700' : '400'}; font-size: 1em; padding: 15px; cursor: pointer; border-bottom: 1px solid #ddd;">${param}</li>`;
            });
            document.getElementById(`params-list-${this.props.template}-${this.props.section}`).innerHTML = listHTML;
            document.getElementById(`params-list-wrapper-${this.props.template}-${this.props.section}`).style.display = 'flex';
            return;
          } else if (cname && cname === 'param-option') { // if we clicked on a param option in the popup...
            // pull the value from the list option
            const clickedParam = target.textContent;
            // pull the name of the button the list options pertains to
            const activeMatch = target.getAttribute('data-for');
            // inject the new value directly into the original param button
            document.getElementById(`param-button-${activeMatch}`).textContent = clickedParam;
            // re-ID the original button to match the new param value
            document.getElementById(`param-button-${activeMatch}`).id = `param-button-${clickedParam}`;
            // close the param options popup
            document.getElementById(`params-list-wrapper-${this.props.template}-${this.props.section}`).style.display = 'none';
            return;
          }
          // if the click occurs on any el we're not targeting, ignore...
          return false;
        });
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
    console.log(clickTarget.getAttribute('class'))
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
        <div
          id={`params-list-wrapper-${this.props.template}-${this.props.section}`}
          onClick={(e) => (e.target.style.display = 'none')}
          style={styles.paramsListWrapper}
        >
          <ul
            id={`params-list-${this.props.template}-${this.props.section}`}
            style={styles.paramsList}
          >
          </ul>
        </div>
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
    display: 'none',
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
};
