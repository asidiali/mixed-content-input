import React from 'react';
import styles from './styles';
import MixedContentInput from '../../MixedContentInput';
import ls from 'local-storage';

const templateParams = [
  'adjustedContactFirstName',
  'adjustedContactLastName',
  'adjustedContactFullName',
  'adjustedDistributorFirstName',
  'adjustedDistributorLastName',
  'adjustedDistributorFullName',
];

const templateName = 'ContactOrderCard';

export default class HomeView extends React.Component {

  state = {
    title: '',
    description: '',
  };

  componentDidMount() {
    let title = ls.get('demo__title');
    let description = ls.get('demo__description');
    if (!title) title = 'You have a new order!';
    if (!description) description = '{adjustedContactFullName} just ordered a moment ago.';
    this.setState({
      title,
      description,
    });
  }

  update = (section, string) => new Promise((resolve, reject) => {
    ls.set(`demo__${section}`, string);
    const update = {};
    update[section] = string;
    this.setState(update, () => resolve());
  });

  render() {
    return (
      <div style={styles.base}>
        <h1>Mixed Content Input Component Demo</h1>
        <hr />
        <div
          style={styles.inputWrapper}
        >
          {this.state.title && this.state.title.length ? (
            <MixedContentInput
              template={templateName}
              section="title"
              content={this.state.title}
              paramOptions={templateParams}
              update={this.update}
            />
          ) : false}

          {this.state.description && this.state.description.length ? (
            <MixedContentInput
              template={templateName}
              section="description"
              content={this.state.description}
              paramOptions={templateParams}
              update={this.update}
            />
          ) : false}
        </div>
      </div>
    );
  }
}
