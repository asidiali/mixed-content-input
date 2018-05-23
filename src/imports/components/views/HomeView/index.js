import React from 'react';
import styles from './styles';
import MixedContentInput from '../../MixedContentInput';
import ls from 'local-storage';

const templateParams = [
  'adjustedContactFirstName',
  'adjustedContactLastName',
  'adjustedContactFullName',
];

const templateName = 'ContactOrderCard';

export default class HomeView extends React.Component {

  state = {
    template: '',
  };

  componentDidMount() {
    let string = ls.get('demo__data');
    if (!string) string = '{adjustedContactFullName} just ordered a moment ago!';
    this.setState({ template: string });
  }

  update = (string) => new Promise((resolve, reject) => {
    console.log(string);
    ls.set('demo__data', string);
    this.setState({ template: string }, () => resolve());
  });

  render() {
    return (
      <div style={styles.base}>
        <h1>Mixed Content Input Component Demo</h1>
        <hr />
        {this.state.template && this.state.template.length ? (
          <MixedContentInput
            template={templateName}
            section="title"
            content={this.state.template}
            paramOptions={templateParams}
            update={this.update}
          />
        ) : false}
      </div>
    );
  }
}
