import React from 'react';
import UPCForm from './upcForm';
import fetch from 'isomorphic-fetch';
import {normalize} from './util';

export default class extends React.Component {
  submit = (values) => {
    const list = values && values.members.map((member) => member && normalize(member.upc));
    console.log('list: ', list);
    fetch(
      `https://iwo3uesa6c.execute-api.us-east-1.amazonaws.com/prod/products`,
      {
        method: 'POST',
        body: JSON.stringify({list})
      }
    ).then((res, error) => {
      if (error) {
        throw new Error(error);
      }
      if (res.status !== 200) {
        throw new Error(`the fetch returned an unsuccessful state status ${res.status}`);
      }
      console.log(`fetch completed with status: ${res.status}`);
    });
  };

  render() {
    return (
      <UPCForm onSubmit={this.submit} />
    );
  }
}
