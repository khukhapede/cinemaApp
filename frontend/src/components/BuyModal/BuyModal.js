import React, { useState, useContext } from "react";

import { Button, Form, Modal } from "react-bootstrap";

import { useMutation } from "react-query";

import { API } from "../../config/api";

import { UserContext } from "../../context/userContext";

import Styles from "./BuyModal.module.css";

export default function BuyModal(props) {
  let api = API();

  const { show, close, title, price, id, refetch } = props;

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    numAccount: "",
    receipt: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.set("receipt", form.receipt[0], form.receipt[0].name);
      formData.set("numAccount", form.numAccount);

      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
        body: formData,
      };

      const response = await api.post("/add-transactions/" + id, config);

      if (response.status === "success") {
        refetch();
        close();
      }
    } catch (err) {
      console.log(err);
    }
  });

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
          <h3 className="mt-3 mb-4 mx-3 text-center">
            <b>Payment</b>
          </h3>
          <div>
            <div className={`${Styles.title}`}>{title}</div>
            <div className={`${Styles.price}`}>Rp.{price}</div>
          </div>

          <Form className="mt-5" onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="m-3">
              <Form.Control
                type="text"
                placeholder="Account Number"
                name="numAccount"
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <input
              type="file"
              id="uploadRc"
              name="receipt"
              hidden
              onChange={handleChange}
            />
            <label htmlFor="uploadRc" className={`${Styles.rcBtn}`}>
              <b>attach payment</b>
              <img src="/./icons/receipt.png" alt="rc" />
            </label>

            {preview && (
              <div>
                <img
                  src={preview}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    margin: "16px",
                  }}
                  alt="preview"
                />
              </div>
            )}

            <div className="d-grid mx-3 my-4">
              <Button className={`${Styles.btnPay}`} type="submit">
                <b>pay</b>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
