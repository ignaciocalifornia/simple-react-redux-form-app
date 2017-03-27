import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import isUPC from 'is-upc';
import InputElement from 'react-input-mask';
import {normalize} from './util';

let isEmptyForm = true;

const validUPCObjects = [
  { upc: "082184090466" },
  { upc: "083085300265" },
  { upc: "889714000045" }
];

const invalidUPCObjects = [
  { upc: "82184090466" },
  { upc: "0830300265" }
];

// Sum the odd-numbered digits (0 + 6 + 0 + 2 + 1 + 5 = 14).
//   Multiply the result by 3 (14 × 3 = 42).
// Add the even-numbered digits (42 + (3 + 0 + 0 + 9 + 4) = 58).
//   Find the result modulo 10 (58 mod 10 = 8).
// If the result is not 0, subtract the result from 10 (10 − 8 = 2).
const calculateLastDigit = (value) => {
  const upc = value.split('');
  const sumOdd = upc.reduce((acc, value, index) => {
    return !(index % 2) ? (Number(acc) + Number(value)) : acc;
  }, 0);
  const mult = sumOdd * 3;
  const sumEven = upc.reduce((acc = 0, value, index) => {
    return (index % 2) ? (Number(acc) + Number(value)) : acc;
  }, 0);
  const res = (mult + sumEven) % 10;
  return (res !== 0) ? (10 - res) : res;
};

const validate = (values) => {
  const errors = {};
  if (!values || !values.members || !values.members.length) {
    isEmptyForm = true;
  } else {
    isEmptyForm = false;
    const membersArrayErrors = [];
    values.members.forEach((member, memberIndex) => {
      const memberErrors = {};
      const upc = normalize(member.upc);
      if (upc && upc.length !== 12) {
        if (upc.length === 11){
          memberErrors.upc = `${calculateLastDigit(upc)} is the last valid digit`;
        } else {
          memberErrors.upc = 'needs 12 digits';
        }
      } else if (!isUPC(upc)) {
        memberErrors.upc = 'invalid';
      }
      membersArrayErrors[memberIndex] = memberErrors;
    });

    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors
    }
  }
  return errors;
};

const UPC_PLACEHOLDER = '_-_____-_____-_';
const UPC_MASK = '9-99999-99999-9';

const renderField = ({ input, label, type, meta: { error }}) => {
  return (
    <span>
      <label>{label}</label>
      <span>
        <InputElement
          {...input}
          type={type}
          placeholder={UPC_PLACEHOLDER}
          mask={UPC_MASK}
          size="17"
        />
        {error && <span className="upcError">{error}</span>}
      </span>
    </span>
  )
};

const renderMembers = ({ fields, meta: { error } }) => {
  return (
    <div>
      <button type="button" onClick={() => fields.push({})}>Add UPC</button>
      <button type="button" onClick={() => validUPCObjects.map((upcObject) => fields.push(upcObject))}
      >Add Valid UPCs</button>
      <button type="button" onClick={() => invalidUPCObjects.map((upcObject) => fields.push(upcObject))}
      >Add Invalid UPCs</button>

      <ul>
        {fields.map((member, index) =>
          <li key={index}>
            <Field
              name={`${member}.upc`}
              type="text"
              component={renderField}
              label={`UPC ${index + 1}`}
            />
            <button
              type="button"
              title="Remove Member"
              onClick={() => {
                fields.remove(index);
              }}
              className="delete-button"
            >Delete</button>
          </li>
        )}
      </ul>
    </div>
)};

let FieldArraysForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, invalid } = props;

  return (
    <form onSubmit={handleSubmit} className="form">
      <FieldArray name="members" component={renderMembers} />
      <div>
        <button type="submit" disabled={submitting || invalid || pristine || isEmptyForm}
        >Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
};

FieldArraysForm = reduxForm({
  form: 'fieldArrays',
  validate
})(FieldArraysForm);

export default FieldArraysForm;
