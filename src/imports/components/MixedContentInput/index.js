import React from 'react';

export default class MixedContentInput extends React.Component {

  parseParams = (str, params) => {
    const arr = str.match(/\{([^}]+)\}/);
    if (params && arr) {
      const replacedStr = str.replace(/{(.*?)}/g, (match, offset, string) => {
        const sanitizedMatch = match.substring(1, match.length - 1);
        const newStr = `<div contentEditable="false" id="param-button-${sanitizedMatch}" class="param-button" style="background: #f5f5f5; margin: auto 3px; font-size: 0.9em; border: 1px solid #09a3ed; padding: 5px; border-radius: 5px; color: #09a3ed; user-select: none; display: inline-block;">${sanitizedMatch}</div>`;
        // create a global event listener for the click
        // has to be global because this is created before the
        // state change is rendered, so el isn't in the DOM yet
        window.addEventListener('click', (e) => {
          const target = e.target;
          console.log('click target');
          console.log(target);
          const cname = target.getAttribute('class');
          if (cname && cname === 'param-button') {
            const clickedMatch = target.textContent;
            let listHTML = '';
            params.forEach((param) => {
              listHTML += `<li id="param-option-${param}" data-for="${clickedMatch}" class="param-option" style="font-weight: ${(param === clickedMatch) ? '700' : '400'}; font-size: 1em; padding: 15px; cursor: pointer; border-bottom: 1px solid #ddd;">${param}</li>`;
            });
            document.getElementById('params-list').innerHTML = listHTML;
            document.getElementById('params-list-wrapper').style.display = 'flex';
            return;
          } else if (cname && cname === 'param-option') {
            const clickedParam = target.textContent;
            const activeMatch = target.getAttribute('data-for');

            document.getElementById(`param-button-${activeMatch}`).textContent = clickedParam;
            document.getElementById(`param-button-${activeMatch}`).id = `param-button-${clickedParam}`;

            document.getElementById('params-list-wrapper').style.display = 'none';
            return;
          } else {
            return false;
          }
        });
        return newStr;
      });
      return replacedStr;
    }
    return str;
  }


  render() {
    return (
      <div
        style={styles.container}
      >
        <div
          style={styles.input}
          dangerouslySetInnerHTML={{ __html: this.parseParams(this.props.content, this.props.paramOptions) }}
        >
        </div>
        <div
          id="params-list-wrapper"
          onClick={(e) => (e.target.style.display = 'none')}
          style={styles.paramsListWrapper}
        >
          <ul
            id="params-list"
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
