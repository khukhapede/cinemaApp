import React, { useState, useContext } from "react";

import { Alert, Button, Form, Modal } from "react-bootstrap";

import { useMutation } from "react-query";

import { API } from "../../config/api";

import { UserContext } from "../../context/userContext";

import Styles from "./AlertModal.module.css";

export default function AlertModal(props) {
  const { show, close, type } = props;
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
          <div className="text-center">
            {(() => {
              if (type === "buy") {
                return <b>you must buy this film to watch</b>;
              } else if (type === "pending") {
                return <b>please wait for approval of your payment</b>;
              } else if (type === "notLogin") {
                  return <b>please login first before buy</b>
              }
            })()}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
