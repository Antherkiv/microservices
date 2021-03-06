import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';
import { withAlert } from 'react-alert';
import {
  Row,
  Col,
  Card,
  CardTitle,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
  FormFeedback
} from 'reactstrap';

import { EMAIL_REGEX } from '../Components/Login';
import { actions } from '../../store';

import Api from '../../Api';
import { getUserName } from '../../tools';

const initialValues = {
  email: '',
  password: '',
  passwordConfimation: ''
};

const validation = ({ fullName, email, password, passwordConfimation }) => {
  const errors = {};

  if (typeof fullName === 'undefined') {
    errors.fullName = 'Es requerido';
  }

  if (typeof email === 'undefined') {
    errors.email = 'Es requerido';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'No es un correo electronico';
  }

  if (typeof password === 'undefined') {
    errors.password = 'Es requerido';
  } else if (password.lenght < 8) {
    errors.password = 'La Contraseña debe contar con al menos 8 caracteres';
  } else if (
    typeof passwordConfimation !== 'undefined' &&
    passwordConfimation !== password
  ) {
    errors.password = 'No coinciden las contraseñas';
    errors.passwordConfimation = 'No coinciden las contraseñas';
  }
  return errors;
};

const onSubmit = (authBaseURL, alert, push, setAuthenticated) => (
  { fullName, email, password },
  { setSubmitting, setErrors }
) =>
  axios
    .post(`${authBaseURL}/register`, {
      full_name: fullName,
      email,
      password
    })
    .then(user => {
      axios(`${authBaseURL}/token`, {
        method: 'post',
        data: {
          email,
          password
        },
        withCredentials: true
      }).then(() => {
        alert.success('El usuario se creó satisfactoriamente');
        setAuthenticated(true);
        getUserName();
        push('/');
        setSubmitting(false);
      });
    })
    .catch(({ response: { data: { description } } }) => {
      alert.error(description);
      setSubmitting(false);
    });

const FormRender = ({
  values: { email, password, passwordConfimation, fullName },
  errors: {
    email: emailErr,
    password: passwordErr,
    passwordConfimation: passwordConfimationErr,
    fullName: fullNameErr
  },
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">👨‍💼</InputGroupAddon>
        <Input
          placeholder="Nombre completo"
          type="text"
          name="fullName"
          onChange={handleChange}
          onBlur={handleBlur}
          value={fullName}
          invalid={!!(touched.fullName && fullNameErr)}
        />
        <FormFeedback tooltip>{emailErr}</FormFeedback>
      </InputGroup>
    </FormGroup>
    <FormGroup>
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">📬</InputGroupAddon>
        <Input
          placeholder="e-Mail"
          type="email"
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          value={email}
          invalid={!!(touched.email && emailErr)}
        />
        <FormFeedback tooltip>{emailErr}</FormFeedback>
      </InputGroup>
    </FormGroup>
    <FormGroup>
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">🔒</InputGroupAddon>
        <Input
          placeholder="Contraseña"
          type="password"
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={password}
          invalid={!!(touched.password && passwordErr)}
        />
        <FormFeedback tooltip>{passwordErr}</FormFeedback>
      </InputGroup>
    </FormGroup>
    <FormGroup>
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">🔒</InputGroupAddon>
        <Input
          placeholder="Confirmación de contraseña"
          type="password"
          name="passwordConfimation"
          onChange={handleChange}
          onBlur={handleBlur}
          value={passwordConfimation}
          invalid={!!(touched.passwordConfimation && passwordConfimationErr)}
        />
        <FormFeedback tooltip>{passwordConfimationErr}</FormFeedback>
      </InputGroup>
    </FormGroup>
    <Button
      type="submit"
      disabled={isSubmitting}
      className="float-sm-right"
      size="sm"
    >
      Registrar
    </Button>
  </Form>
);

FormRender.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.bool,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool
};

export default withAlert(({ alert, history: { push } }) => (
  <Row className="h-100 align-items-center">
    <Col sm="12" md={{ size: 4, offset: 4 }}>
      <Card
        style={{
          padding: 20
        }}
      >
        <CardTitle>Registro</CardTitle>
        <Api.Consumer>
          {value => (
            <Formik
              initialValues={initialValues}
              validate={validation}
              render={FormRender}
              onSubmit={onSubmit(
                value.authBaseURL,
                alert,
                push,
                actions.setAuthenticated
              )}
            />
          )}
        </Api.Consumer>
      </Card>
    </Col>
  </Row>
));
