import React, { useState } from "react";

import { Button, Form, Modal, Alert } from "react-bootstrap";

import { useMutation } from "react-query";

import { API } from "../../config/api";

import Styles from "./Register.module.css";

export default function Register(props) {
  const { show, close, subs } = props;

  let api = API();

  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    email: "",
    fullname: "",
    password: "",
  });

  const { email, fullname, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Data body
      const body = JSON.stringify(form);

      // Configuration Content-type
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      };

      // Insert data user to database
      const response = await api.post("/register", config);

      console.log(response);

      // Notification
      if (response.status == "success") {
        const alert = (
          <Alert variant="success" className="py-1">
            Success
          </Alert>
        );
        setMessage(alert);
        setForm({
          fullname: "",
          email: "",
          password: "",
        });
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            {response.message}
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed after catch
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  function subtitute() {
    close();
    subs();
  }

  return (
    <>
      <Modal
        show={show}
        onHide={close}
        centered
        contentClassName={`${Styles.modalContent}`}
        dialogClassName={`${Styles.modalDialog}`}
      >
        <Modal.Body>
          <h1 className="mt-3 mb-4 mx-3">
            <b>Register</b>
          </h1>
          {message && message}

          <Form className="mt-5" onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="m-3">
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Control
                type="text"
                placeholder="full name"
                name="fullname"
                value={fullname}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Control
                type="password"
                placeholder="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <div className="d-grid mx-3 my-4">
              <Button className={`${Styles.buttonLogin}`} type="submit">
                <b>Register</b>
              </Button>
            </div>
          </Form>
          <p className={`${Styles.switch} text-center `}>
            already have account? click
            <button className={`${Styles.switch}`} onClick={subtitute}>
              <b>here</b>
            </button>
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}
