import React from 'react';
import styles from './styles';
import MixedContentInput from '../../MixedContentInput';

const templatedString = 'From your contact list, update attendee {adjustedContactFirstName}\'s product interest.'
const templateParams = [
  'adjustedContactFirstName',
  'adjustedContactLastName',
  'adjustedContactFullName',
];

export default class HomeView extends React.Component {
  render() {
    return (
      <div style={styles.base}>
        <h1>Mixed Content Input Component Demo</h1>
        <hr />
        <MixedContentInput
          content={templatedString}
          paramOptions={templateParams}
        />
      </div>
    );
  }
}
