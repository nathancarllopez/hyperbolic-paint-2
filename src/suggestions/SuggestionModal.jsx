import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ERROR_MESSAGE_DURATION } from "../util/constants";
import initializeFormObject from "./initializeFormObject";
import postToMongoDB from "./postToMongoDB";
import SuggestionForm from "./SuggestionForm";
import { Fade } from "react-bootstrap";
import SuggestionConfirm from "./SuggestionConfirm";
import SuggestionError from "./SuggestionError";

export default function SuggestionModal() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(() => initializeFormObject(""));
  const [invalidInputs, setInvalidInputs] = useState(() => initializeFormObject(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalBody, setModalBody] = useState('form');

  async function handleSubmit() {
    setIsSubmitting(true);

    const valid = validateFormData();
    if (valid) {
      try {
        // const response = await postToMongoDB(formData);
        const response = { ok: false };
        if (response.ok) {
          setModalBody('confirm');
        } else {
          setModalBody('error')
        }
      } catch(error) {
        // To do: error handling
        console.log(error);
        throw error;
      }
    }

    setIsSubmitting(false);
  }

  function validateFormData() {
    const badInputs = [];

    const email = formData.email;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail = emailRegex.test(email);
      if (!validEmail) {
        badInputs.push(['email', true]);
      }
    }

    const type = formData.type;
    const otherType = formData.otherType;
    if (!type) {
      badInputs.push(['type', true]);
    } else if (type === 'other' && !otherType) {
      badInputs.push(['otherType', true]);
    }

    const suggestion = formData.suggestion;
    if (!suggestion) {
      badInputs.push(['suggestion', true]);
    }

    if (badInputs.length > 0) {
      setInvalidInputs(prev => {
        setTimeout(() => {
          setInvalidInputs(() => initializeFormObject(false));
        }, ERROR_MESSAGE_DURATION);
  
        const next = Object.fromEntries(badInputs);
        return { ...prev, ...next }
      });

      return false;
    }

    return true;
  }

  function handleCloseModal() {
    setShowModal(false);
    setFormData(() => initializeFormObject(""));
    setModalBody('form');
  }

  return (
    <Container className="text-center mb-2">
      <Button variant="dark" className="border" onClick={() => setShowModal(true)}>
        Submit Suggestion
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thanks for the feedback!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fade
            in={modalBody === 'form'}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <SuggestionForm
                formData={formData}
                setFormData={setFormData}
                invalidInputs={invalidInputs}
              />
            </div>
          </Fade>
          
          <Fade
            in={modalBody === 'confirm'}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <SuggestionConfirm/>
            </div>
          </Fade>

          <Fade
            in={modalBody === 'error'}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <SuggestionError/>
            </div>
          </Fade>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            { isSubmitting ? "Submitting..." : "Submit" }
          </Button>
        </Modal.Footer>
      </Modal>
   </Container>
  );
}